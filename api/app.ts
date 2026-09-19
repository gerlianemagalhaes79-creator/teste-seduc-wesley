import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

// Enable CORS for Vercel and all preview environments
app.use((_req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Server-side Gemini initialization with multi-key detection
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini execution with automatic retry, fast timeout and valid models
// gemini-3.1-flash-lite is the primary model because it has much higher free-tier quota than gemini-3.8-flash
const DEFAULT_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
];

const modelCooldowns = new Map<string, number>();

function isModelAvailable(model: string): boolean {
  const cooldownUntil = modelCooldowns.get(model);
  if (!cooldownUntil) return true;
  if (Date.now() > cooldownUntil) {
    modelCooldowns.delete(model);
    return true;
  }
  return false;
}

function markModelCooldown(model: string, durationMs: number = 60000) {
  modelCooldowns.set(model, Date.now() + durationMs);
}

async function callGeminiWithFallback(params: {
  contents: any;
  config?: any;
  preferredModel?: string;
  maxRetriesPerModel?: number;
}) {
  const ai = getAi();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const preferred = params.preferredModel || "gemini-3.1-flash-lite";
  const allCandidateModels = Array.from(new Set([preferred, ...DEFAULT_MODELS]));
  const availableModels = allCandidateModels.filter(isModelAvailable);
  const modelsToTry = availableModels.length > 0 ? availableModels : allCandidateModels;

  let lastError: any = null;

  for (const model of modelsToTry) {
    const retries = params.maxRetriesPerModel ?? 1;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const timeoutMs = 25000;
        const callPromise = ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ${timeoutMs}ms on model ${model}`)), timeoutMs)
        );

        const response = (await Promise.race([callPromise, timeoutPromise])) as any;
        if (response && (response.text !== undefined || response.candidates)) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);

        const isRateLimited =
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("quota");

        if (isRateLimited) {
          markModelCooldown(model, 60000);
          break; // move to next model without wasting attempts
        }

        const isTemporary =
          errMsg.includes("503") ||
          errMsg.includes("500") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("Timeout");

        if (isTemporary && attempt < retries - 1) {
          await new Promise((res) => setTimeout(res, 200));
        }
      }
    }
  }

  throw lastError;
}

// Router to handle all API routes cleanly
const apiRouter = express.Router();

// Health check
apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "SEDUC Ceará FUNECE Mentor API",
    hasApiKey: Boolean(
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.API_KEY
    ),
  });
});

// 1. Mentor FUNECE Chat endpoint and aliases (/mentor/chat, /seduc/tutor, /tutor)
const handleMentorChat = async (req: Request, res: Response) => {
  try {
    const { message, specialty, studentContext, chatHistory, modelTier, mentorRole } = req.body;

    let scheduleSection = "";
    if (studentContext?.scheduleByDay && Array.isArray(studentContext.scheduleByDay)) {
      scheduleSection = "\n\nCRONOGRAMA OFICIAL DE ESTUDOS DO ALUNO POR DIA:\n";
      for (const day of studentContext.scheduleByDay) {
        scheduleSection += `\n[DIA ${day.dayNumber} - ${day.dayLabel}]:\n`;
        for (const top of day.topics) {
          scheduleSection += `• ${top.moduleName}: ${top.title}\n`;
          if (top.keyFormulasOrLaws) {
            scheduleSection += `  - Base Legal / Doutrina: ${top.keyFormulasOrLaws}\n`;
          }
          if (top.subtopics && top.subtopics.length > 0) {
            scheduleSection += `  - Subtópicos: ${top.subtopics.slice(0, 4).join("; ")}\n`;
          }
        }
      }
      scheduleSection += `\nIMPORTANTE - REGRAS RÍGIDAS DE IDENTIFICAÇÃO DE DIAS:
1. Quando o aluno pedir "tópico do dia 2", "dia 2", "terça-feira" ou "segundo dia", responda estritamente sobre os tópicos listados em [DIA 2 - Terça-feira]. NUNCA mencione os tópicos do Dia 4 ou de outros dias como se fossem do Dia 2.
2. Quando o aluno pedir "tópico do dia 4", "dia 4", "quinta-feira" ou "quarto dia", responda estritamente sobre os tópicos de [DIA 4 - Quinta-feira].
3. Apresente os tópicos do dia solicitado com clareza, destacando os pontos mais cobrados pela CEV-UECE / FUNECE, autores pedagógicos e macetes de memorização.`;
    }

    const now = new Date();
    const weekdayNames = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const serverWeekday = weekdayNames[now.getDay()];
    const currentWeekday = studentContext?.currentDayOfWeekName || serverWeekday;
    const currentDateStr = studentContext?.currentDateFormatted || now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const systemPrompt = `Você atua como "Prof. Crateús - Professor Mentor de Alto Nível e Elaborador Oficial SEDUC CE", aplicando com rigor extremo os padrões conceituais, terminológicos e metodológicos da banca FUNECE (CEV/UECE) para o Concurso Público de Professores Efetivos da SEDUC Ceará 2026.
Disciplina de Foco: ${studentContext?.specialtyName || specialty || "Educação / Especialidade"}.

═════════════════════════════════════════════════════════════════════
1. DIRETIVA SUPREMA DE ESCOPO E SUBTÓPICO EXATO (ANTI-DESVIO)
═════════════════════════════════════════════════════════════════════
• A hierarquia de tópicos (DISCIPLINA → TÓPICO → SUBTÓPICO) é uma barreira rígida e inegociável.
• Cada resposta, aula ou questão deve focar estritamente no conceito específico contido no SUBTÓPICO EXATO solicitado.
• É TERMINANTEMENTE PROIBIDO desviar para outros conteúdos da disciplina só porque são mais populares ou comuns (ex.: se o pedido for sobre Genética/Probabilidade, nunca desvie para Citologia/Membrana; se for sobre Mitose, não desvie para Meiose ou Respiração Celular).
• O nome do tópico ou subtópico é apenas o endereço do conteúdo; nunca crie meta-questões perguntando sobre a banca ou sobre o edital em si. Avalie sempre o conhecimento científico/disciplinar real.

═════════════════════════════════════════════════════════════════════
2. REGRAS INEGOCIÁVEIS DE INEDITISMO E ANTI-REPETIÇÃO (SIMULADOS)
═════════════════════════════════════════════════════════════════════
• ZERO DUPLICIDADE: É terminantemente proibido repetir o mesmo enunciado, cenário, exemplo ou raciocínio de perguntas anteriores.
• NÃO INVERTA APENAS O GABARITO: Mudar a ordem das alternativas ou trocar a letra correta NÃO cria uma questão nova.
• EXPLORAÇÃO PROFUNDA DO TÓPICO: Todo subtópico é amplo. A cada nova requisição sobre o mesmo assunto, explore uma ramificação, vertente teórica, exceção normativa ou mecanismo científico diferente.
• ESTRUTURA DAS QUESTÕES:
  - 4 alternativas plausíveis e homogêneas (A, B, C, D), com linguagem formal de concurso.
  - Apenas 1 alternativa inequivocamente correta.
  - Comentário que ensina a matéria: justifique a correta e aponte o erro conceitual específico de cada distrator.

═════════════════════════════════════════════════════════════════════
3. COMPORTAMENTO DO PROFESSOR MENTOR & TRATAMENTO DE CONVERSA
═════════════════════════════════════════════════════════════════════
• MENSAGENS CONVERSACIONAIS NÃO SÃO TÓPICOS:
  - Expressões como "não entendi", "está difícil", "não sei isso", "explique melhor", "socorro", "como a banca cobra isso?" e desabafos emocionais NUNCA devem ser transformados em títulos de aulas ou tópicos do edital.
  - Se o aluno demonstrar dúvida ou pedir para explicar melhor, MANTENHA O ASSUNTO ATUAL, acolha com calma e mude a didática: use analogias da vida real e simplifique a explicação antes de trazer termos rebuscados.
• SAUDAÇÕES SIMPLES:
  - Se a mensagem for apenas um cumprimento ("oi", "olá", "boa tarde", "tudo bem?"), responda em 1 a 2 frases curtas e amigáveis, sem despejar texto teórico antes que um assunto seja solicitado.
• CONSULTA A DATAS E DIAS:
  - Quando o aluno perguntar sobre hoje: DATA DE HOJE: ${currentDateStr} (HOJE É RIGOROSAMENTE ${currentWeekday.toUpperCase()}).
  - Quando o aluno solicitar um dia específico (ex.: "quero os assuntos do dia 4" ou "o que estudo na terça"), apresente as metas oficiais de estudo daquela data (Específica e Pedagógicos/Educação Brasileira), sem inventar tópicos a partir da frase digitada.
• ESTRUTURA DAS AULAS (quando o aluno pedir para explicar um tópico):
  1. Ponto Central e Definição Técnica (direto ao ponto, com rigor acadêmico).
  2. Aplicação Prática e Padrão FUNECE (pegadinhas clássicas, distratores recorrentes da CEV/UECE).
  3. Pergunta Final Reflexiva (oferecendo simplificação prática ou um microdesafio inédito).

═════════════════════════════════════════════════════════════════════
4. FORMATAÇÃO LIMPA DE FÓRMULAS E SÍMBOLOS MATEMÁTICOS/CIENTÍFICOS
═════════════════════════════════════════════════════════════════════
• Nunca deixe comandos LaTeX crus soltos no texto sem delimitadores (como \\lambda, \\frac, \\times).
• Fórmulas e equações isoladas devem ficar entre dois sinais de dólar:
  $$d = \\frac{0,61 \\cdot \\lambda}{AN}$$
• Variáveis no meio da frase devem ficar entre um sinal de dólar ($d$, $\\lambda$, $AN$, $\\Delta$).
• Prefira caracteres diretos para unidades e operações simples quando não for necessária equação complexa.

DADOS OFICIAIS DO CONCURSO SEDUC-CE 2026:
• Banca: FUNECE / CEV-UECE | Prova: 22 de novembro de 2026 (80 questões de A, B, C, D + Estudo de Caso).
• Base pedagógica: Libâneo, Saviani, Luckesi, Tardif, Vasconcellos, Zabala, LDB 9.394/96 atualizada, DCRC, BNCC, Lei Estadual nº 10.884/84 e SPAECE.

CONTEXTO DO ALUNO:
• Disciplina: ${studentContext?.specialtyName || specialty || "Não definida"}
• Horas diárias: ${studentContext?.hoursPerDay || "2-3h"} | Aproveitamento: ${studentContext?.accuracyRate || "70%"}.${scheduleSection}
${
  mentorRole === "discursiva"
    ? `\nFOCO DESTE MODO: Você está atuando no modo ESPECIALISTA EM PROVA DISCURSIVA E ESTUDO DE CASO PEDAGÓGICO DA FUNECE. Oriente a estruturação de introdução, fundamentação legal/teórica e proposta de intervenção didática alinhada à realidade das escolas estaduais do Ceará.`
    : mentorRole === "pegadinhas"
    ? `\nFOCO DESTE MODO: Você está atuando no modo CAÇADOR DE PEGADINHAS E DISTRATORES DA CEV/UECE. Destaque palavras proibitivas, trocas sutis de termos da LDB e técnicas de eliminação de alternativas.`
    : mentorRole === "banca_examinadora"
    ? `\n═════════════════════════════════════════════════════════════════════
FOCO DESTE MODO: BANCA EXAMINADORA PROFISSIONAL (ELABORADOR E APLICADOR DE QUESTÕES)
═════════════════════════════════════════════════════════════════════
Você é um elaborador e aplicador oficial de questões para concursos públicos na área da educação (Banca FUNECE / CEV-UECE para SEDUC-CE).
Sua função é atuar estritamente como uma banca examinadora profissional:
- Crie questões compatíveis com o cargo de Professor da SEDUC-CE, o edital, a disciplina e o subtópico específico.
- Nunca faça perguntas genéricas ou triviais. Cada questão deve parecer uma questão real de prova de concurso.
- Apresente 1 questão por vez no formato:
  QUESTÃO [Número]
  Disciplina: [disciplina]
  Item do edital: [item ou subitem]
  Habilidade avaliada: [habilidade]
  Nível: [intermediário, intermediário-difícil ou difícil]
  
  [Enunciado contextualizado, técnico e sem ambiguidade]
  
  A) [alternativa]
  B) [alternativa]
  C) [alternativa]
  D) [alternativa]
  
  Responda indicando a letra da alternativa escolhida. Se desejar, justifique sua resposta.
- Não mostre o gabarito antes do usuário responder.
- Após a resposta do usuário: informe se está correto/incorreto, apresente o gabarito com justificativa detalhada da correta e aponte o erro específico de cada distrator, citando a fonte legal ou autor real (sem inventar artigos). Em seguida, apresente a próxima questão inédita.`
    : ""
}`;

    // Select preferred model based on tier
    const preferredModel =
      modelTier === "complex"
        ? "gemini-3.1-pro-preview"
        : modelTier === "fast"
        ? "gemini-3.1-flash-lite"
        : "gemini-3.5-flash";

    // Construct context history
    let contents = "";
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-8);
      contents += "Histórico recente da conversa:\n";
      for (const h of recentHistory) {
        contents += `${h.sender === "user" ? "Aluno" : "Mentor FUNECE"}: ${h.text}\n`;
      }
      contents += `\nNova dúvida do Aluno: ${message}`;
    } else {
      contents = message;
    }

    try {
      const response = await callGeminiWithFallback({
        preferredModel,
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        return res.json({ reply: response.text });
      }
    } catch (genError: any) {
      const reason = genError?.message ? genError.message.slice(0, 80) : "offline/quota";
      console.log(`[Mentor Chat] Seamless tactical guidance fallback applied (${reason})`);
    }

    // Check if user is asking what day is today
    const isAskingToday = /que\s+dia\s+(?:é|e)\s+hoje|hoje\s+(?:é|e)\s+que\s+dia|qual\s+(?:é|e)\s+o\s+dia\s+de\s+hoje|que\s+dia\s+estamos/i.test(message);
    if (isAskingToday) {
      const todayNumber = now.getDay() === 0 ? 7 : now.getDay();
      const todaySchedule = studentContext?.scheduleByDay?.find((d: any) => d.dayNumber === todayNumber);
      let studyNote = "";
      if (todaySchedule && todaySchedule.topics?.length > 0) {
        studyNote = `\n\n📚 **Seus tópicos programados para hoje (${currentWeekday}):**\n` +
          todaySchedule.topics.map((t: any) => `• **${t.moduleName}:** ${t.title}`).join("\n");
      }
      return res.json({
        reply: `📅 **Hoje é ${currentWeekday} (${currentDateStr})**!${studyNote}\n\n🎯 Vamos com foco total na preparação da SEDUC-CE / FUNECE. Em que posso te orientar hoje?`,
      });
    }

    // Check if the user specifically asked for a day number
    const dayMatch = message.match(/(?:dia|t[oó]pico\s+do\s+dia)\s*([1-6])/i);
    if (dayMatch && studentContext?.scheduleByDay) {
      const requestedDayNum = parseInt(dayMatch[1], 10);
      const dayData = studentContext.scheduleByDay.find((d: any) => d.dayNumber === requestedDayNum);
      if (dayData && dayData.topics?.length > 0) {
        const topicsList = dayData.topics
          .map((t: any) => `• **${t.moduleName}:** ${t.title}${t.keyFormulasOrLaws ? `\n  📌 *Base Legal/Conceito:* ${t.keyFormulasOrLaws}` : ""}${t.subtopics?.length ? `\n  *Subtópicos:* ${t.subtopics.slice(0, 3).join("; ")}` : ""}`)
          .join("\n\n");

        return res.json({
          reply: `📅 **Tópicos Oficiais do ${dayData.dayLabel} (Dia ${dayData.dayNumber})**:

Aqui está o que está programado para você estudar no **Dia ${dayData.dayNumber}**:

${topicsList}

🎯 **Foco da Banca FUNECE para o Dia ${dayData.dayNumber}:**
A CEV-UECE costuma cobrar estes tópicos de forma direta e conceitual. Revise os autores-chave, a letra da lei e resolva pelo menos 10 a 15 questões desse dia na aba de Simulados para fixar o vocabulário típico da banca!`,
        });
      }
    }

    // High quality offline fallback reply
    const topicFocus = message?.slice(0, 80) || "seu plano de estudos";
    const backupReply = `**Orientação Tática do Prof. Crateús (Mentor FUNECE):**

Sobre **"${topicFocus}"**:
1. **Lógica da CEV/UECE:** A FUNECE não cobra achismos. Foque na literalidade dos textos normativos (LDB, Lei Estadual 9.826/74 e 10.884/84) e nas definições clássicas de José Carlos Libâneo (*Didática*) e Cipriano Luckesi (*Avaliação da Aprendizagem*).
2. **Pegadinha Clássica:** Fique muito atento(a) a alternativas que tentam trocar termos de gestão democrática por posturas centralizadoras, ou que confundem avaliação formativa (processual e contínua) com avaliação somativa (classificatória).
3. **Estratégia Imediata:** Resolva agora ao menos 5 questões do nosso simulador filtrando por este assunto para calibrar seu olho para os distratores da banca.

*Constância vence o concurso. Qual outro ponto do edital você gostaria de dissecar?*`;

    return res.json({ reply: backupReply });
  } catch (error: any) {
    console.error("Mentor chat endpoint critical error:", error);
    res.json({
      reply: "Professor, para este tema da SEDUC-CE, lembre-se: a FUNECE prioriza a literalidade da legislação e autores como Libâneo e Luckesi. Revise os conceitos na aba de Materiais e treine nas questões comentadas!",
    });
  }
};

apiRouter.post("/mentor/chat", handleMentorChat);
apiRouter.post("/seduc/tutor", handleMentorChat);
apiRouter.post("/tutor", handleMentorChat);

// 2. Weekly Adaptive Diagnosis
apiRouter.post("/mentor/weekly-diagnosis", async (req: Request, res: Response) => {
  try {
    const { specialty, studyStats, delayedTopics, topicAccuracies } = req.body;

    const prompt = `Analise o desempenho deste professor concorrente da SEDUC-CE na disciplina de ${specialty}:
Estatísticas:
- Total de questões respondidas: ${studyStats?.totalQuestions || 0}
- Taxa geral de acertos: ${studyStats?.overallAccuracy || 0}%
- Sequência de dias (Streak): ${studyStats?.streak || 1} dias
- Tópicos atrasados no cronograma: ${delayedTopics?.join(", ") || "Nenhum"}
- Desempenho por tema: ${JSON.stringify(topicAccuracies || {})}

Como Examinador e Mentor especialista na banca FUNECE:
1. Faça um diagnóstico direto do estado de preparação.
2. Indique exatamente 3 prioridades táticas para a próxima semana para recuperar atrasos e blindar os pontos fracos.
3. Aponte 2 pegadinhas quentes da FUNECE que costumam derrubar candidatos nessa disciplina.
4. Forneça uma frase de comando e motivação.

Retorne em formato JSON válido com a seguinte estrutura:
{
  "diagnosticSummary": "texto com o diagnóstico geral",
  "scoreRating": "Excelente" | "Bom ritmo" | "Atenção necessária" | "Alerta de atraso",
  "priorityActions": ["Ação 1", "Ação 2", "Ação 3"],
  "funeceTrapsToWatch": ["Pegadinha 1", "Pegadinha 2"],
  "recommendedHoursWeekly": 15,
  "mentorMotivation": "Mensagem do professor mentor",
  "scheduleAdjustmentAdvice": "Como reorganizar os conteúdos atrasados no cronograma"
}`;

    try {
      const response = await callGeminiWithFallback({
        preferredModel: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (genError: any) {
      const reason = genError?.message ? genError.message.slice(0, 80) : "offline/quota";
      console.log(`[Weekly Diagnosis] Structured diagnostic fallback applied (${reason})`);
    }

    res.json({
      diagnosticSummary: `Análise do Mentor FUNECE para ${specialty || "SEDUC-CE"}: Seu ritmo de estudos está ativo. É fundamental equilibrar Conhecimentos Gerais (Legislação + Didática) com a sua Especialidade para garantir pontuação de corte.`,
      scoreRating: (studyStats?.overallAccuracy || 70) >= 75 ? "Bom ritmo" : "Atenção necessária",
      priorityActions: [
        "Eliminar tópicos atrasados dedicando 30 minutos extras no início da sessão",
        "Resolver baterias de 15 questões diárias da FUNECE de Didática e Legislação",
        "Revisar o Documento Curricular Referencial do Ceará (DCRC) e a BNCC",
      ],
      funeceTrapsToWatch: [
        "A FUNECE costuma trocar termos de 'Gestão Democrática' por termos de 'Gestão Autocrática/Centralizada' em questões de LDB",
        "Atenção às diferenças conceituais entre Libâneo e Luckesi sobre a Avaliação Mediadora vs Avaliação Classificatória",
      ],
      recommendedHoursWeekly: 18,
      mentorMotivation: "Cada questão resolvida hoje é uma vaga a menos para a concorrência na SEDUC-CE. Mantenha a constância!",
      scheduleAdjustmentAdvice: "Distribua os conteúdos pendentes nos dias de menor carga horária ou no sábado de revisão.",
    });
  } catch (error: any) {
    console.error("Weekly diagnosis error:", error);
    res.json({
      diagnosticSummary: "Seu ritmo de estudos para a SEDUC-CE está em andamento. Foque nas matérias de maior peso no edital.",
      scoreRating: "Bom ritmo",
      priorityActions: ["Resolver questões diárias", "Revisar leis do Ceará", "Realizar simulados cronometrados"],
      funeceTrapsToWatch: ["Literalidade da LDB", "Tendências pedagógicas de Libâneo"],
      recommendedHoursWeekly: 16,
      mentorMotivation: "Mantenha o foco até o dia da prova!",
      scheduleAdjustmentAdvice: "Reorganize os conteúdos pendentes nos fins de semana.",
    });
  }
});

// 2.1 Simulator Question AI Chatbot endpoint (Multi-turn Question & Exam Assistant)
apiRouter.post("/simulado/chat", async (req: Request, res: Response) => {
  try {
    const { message, questionContext, chatHistory, modelTier, tutorRole } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem do aluno é obrigatória." });
    }

    const preferredModel =
      modelTier === "complex"
        ? "gemini-3.8-flash"
        : modelTier === "general"
        ? "gemini-3.8-flash"
        : "gemini-flash-latest";

    // Build role-specific system instructions
    let roleDescription = "";
    if (tutorRole === "socratic") {
      roleDescription = `Você atua como "Tutor Socrático de Questões da SEDUC-CE / FUNECE".
Seu objetivo é conduzir o candidato por meio de pistas, analogias e perguntas reflexivas.
Se o aluno ainda estiver em dúvida ou não tiver respondido, NÃO entregue a alternativa correta de imediato: oriente-o a deduzir a resposta a partir do conceito central.
Se o aluno já tiver respondido, valide o raciocínio dele e reforce por que os outros distratores são armadilhas da CEV/UECE.`;
    } else if (tutorRole === "trap_breaker") {
      roleDescription = `Você atua como "Desconstrutor de Pegadinhas da Banca FUNECE (CEV/UECE)".
Seu foco cirúrgico é desmascarar a psicologia dos elaboradores da FUNECE:
• Por que cada alternativa errada parece sedutora para quem estudou superficialmente;
• Quais palavras restritivas foram usadas como armadilha ("somente", "vedado", "exclusivamente", "prioritariamente");
• Como eliminar com segurança os distratores em menos de 1 minuto na prova real.`;
    } else {
      roleDescription = `Você atua como "Mestre Doutrinário & Legal da FUNECE".
Seu foco é aprofundamento acadêmico e normativo: cite teóricos de referência (Libâneo, Saviani, Luckesi, Tardif, Piaget, Vygotsky, Zabala) ou os artigos exatos da legislação (LDB 9.394/96, CF/88, Lei Estadual 9.826/74, Lei Estadual 10.884/84, DCRC e BNCC) com alto rigor terminológico.`;
    }

    const questionBlock = questionContext
      ? `
═════════════════════════════════════════════════════════════════════
CONTEXTO DA QUESTÃO EM DISCUSSÃO:
═════════════════════════════════════════════════════════════════════
• Disciplina: ${questionContext.discipline || "Educação / Específica"}
• Assunto/Tópico: ${questionContext.topic || "Geral"}
• Subtópico: ${questionContext.subtopic || ""}
• Enunciado: ${questionContext.statement}
• Alternativas:
${(questionContext.options || []).map((o: any) => `  [${o.id}] ${o.text}`).join("\n")}
• Gabarito Oficial: Letra ${questionContext.correctOptionId || "?"}
• Resposta que o aluno escolheu: ${
          questionContext.userSelectedOption
            ? `Letra ${questionContext.userSelectedOption}`
            : "Ainda em análise (não respondeu)"
        }
• Justificativa da banca: ${questionContext.explanation || "Sem comentário disponível"}
• Radar de Pegadinha FUNECE: ${questionContext.funeceInsight || ""}
• Referência Doutrinária/Legal: ${questionContext.legalOrAuthorReference || ""}
${
  questionContext.eliteAnalysis
    ? `• Análise de Casca de Banana: ${questionContext.eliteAnalysis.mainTrap} | Exceção: ${questionContext.eliteAnalysis.technicalException}`
    : ""
}`
      : "";

    const systemPrompt = `${roleDescription}

${questionBlock}

═════════════════════════════════════════════════════════════════════
DIRETRIZES DE RESPOSTA DO CHATBOT DE SIMULADOS:
═════════════════════════════════════════════════════════════════════
1. Responda diretamente à dúvida do candidato mantendo o foco absoluto no contexto da questão ou técnica de prova.
2. Mantenha tom amigável, motivador e com rigor técnico de concurso público.
3. Formate fórmulas matemáticas/científicas limpas: use $...$ para termos em linha e $$...$$ para equações em bloco.
4. Mantenha a coerência com as mensagens anteriores da conversa.`;

    let contents = "";
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      contents += "Histórico recente da conversa sobre a questão:\n";
      for (const h of chatHistory.slice(-8)) {
        contents += `${h.sender === "user" ? "Aluno" : "Tutor Gemini"}: ${h.text}\n`;
      }
      contents += `\nNova mensagem do Aluno: ${message}`;
    } else {
      contents = message;
    }

    try {
      const response = await callGeminiWithFallback({
        preferredModel,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
        },
      });

      if (response && response.text) {
        return res.json({ reply: response.text, modelUsed: preferredModel });
      }
    } catch (genError: any) {
      const reason = genError?.message ? genError.message.slice(0, 80) : "offline/quota";
      console.log(`[Simulator Chat] Curated question explanation fallback applied (${reason})`);
    }

    // Fallback response if offline
    return res.json({
      reply: `📌 **Orientação do Tutor de Simulados (Padrão FUNECE):**\n\nNesta questão sobre **"${
        questionContext?.topic || "o conteúdo"
      }"**, o ponto nevrálgico é a alternativa correta **${questionContext?.correctOptionId || ""}**.\n\nA banca CEV-UECE constrói os distratores induzindo o candidato a confundir princípios gerais com regras de aplicação estrita. Observe o gabarito comentado para fixar a literalidade do dispositivo cobrado!`,
      modelUsed: "offline-fallback",
    });
  } catch (error: any) {
    console.error("Simulator chat error:", error);
    res.status(500).json({ error: "Falha na comunicação com o Tutor de Simulados." });
  }
});

// 3. Dynamic FUNECE Questions Generator (1 question per microtopic with anti-repetition & multi-facet exploration)
apiRouter.post("/questions/generate-funece", async (req: Request, res: Response) => {
  try {
    const { specialty, topic, subtopic, count = 1, avoidStatements = [], facetAngle } = req.body;

    const topicContext = subtopic
      ? `${topic} (Microtópico específico: ${subtopic})`
      : (topic || "Legislação Educacional e Didática");

    const anglesList = [
      "Estudo de Caso Prático em Sala de Aula da Rede Estadual do Ceará (SEDUC-CE)",
      "Análise Aprofundada e Doutrinária de Autores Pedagógicos Clássicos (Libâneo, Luckesi, Saviani, Tardif, Vasconcellos, Zabala)",
      "Literalidade, Exceções e Marcos Regulatórios (LDB Lei 9.394/96 atualizada, DCRC e BNCC)",
      "Gestão Democrática Escolar, PPP, Colegiados e Atribuições Docentes (LDB Arts. 12, 13 e 14)",
      "Avaliação Formativa/Diagnóstica vs Somativa e Mediação da Aprendizagem",
      "Pegadinha de Qualificadores Sutis e Troca de Competências Institucionais da FUNECE",
      "Metodologias Ativas, Interdisciplinaridade e Competências Gerais no Ensino Médio",
      "Legislação Estadual do Ceará (Estatuto do Magistério Lei 10.884/84 e Sistema SPAECE)",
    ];

    const randomAngle = facetAngle || anglesList[Math.floor(Math.random() * anglesList.length)];
    const avoidSection = Array.isArray(avoidStatements) && avoidStatements.length > 0
      ? `\nREGRA ESTRITA DE NÃO-REPETIÇÃO (QUESTÕES ANTERIORES JÁ RESOLVIDAS NESTE MESMO MICROTÓPICO):
O aluno já gerou ou respondeu a questões anteriores sobre este microtópico. Abaixo estão os trechos dos enunciados anteriores:
${avoidStatements.slice(-5).map((stmt: string, i: number) => `• [Enunciado anterior ${i + 1}]: "${stmt}"`).join("\n")}

É TERMINANTEMENTE PROIBIDO repetir a mesma situação, o mesmo artigo de lei, a mesma abordagem ou o mesmo autor das questões acima.
Como este microtópico é amplo e multifacetado, você DEVE focar em um NOVO sub-aspecto, outro artigo, outro teórico ou outra situação prática não abordada anteriormente.`
      : "\nComo este microtópico é amplo e possui inúmeros desdobramentos, elabore uma questão rica, inédita e representativa da banca examinadora.";

    const prompt = `Você atua como Elaborador Oficial de Questões de Nível Superior e Rigor Extremo focado no Concurso Público para Professores Efetivos da SEDUC Ceará 2026 (Comissão Examinadora FUNECE / CEV-UECE).

═════════════════════════════════════════════════════════════════════
1. DIRETIVA SUPREMA DE ESCOPO E SUBTÓPICO EXATO (ANTI-DESVIO)
═════════════════════════════════════════════════════════════════════
• Disciplina: ${specialty || "Conhecimentos Pedagógicos e Legislação"}
• Assunto / Tópico: ${topic || "Legislação Educacional e Didática"}
• Subassunto / Subtópico Exato: ${subtopic || "Práxis Docente e Marcos Normativos"}
• Ângulo / Vertente Específica: ${randomAngle}

REGRAS RÍGIDAS DE ESCOPO:
- A hierarquia (DISCIPLINA → TÓPICO → SUBTÓPICO) é uma barreira rígida e inegociável.
- A questão DEVE focar estritamente no conceito específico contido no SUBTÓPICO EXATO solicitado: "${subtopic || topic}".
- É TERMINANTEMENTE PROIBIDO desviar para outros conteúdos da disciplina só porque são mais populares ou comuns (ex.: se o pedido for sobre Genética/Probabilidade, nunca desvie para Citologia/Membrana; se for sobre Óptica Geométrica, não desvie para Mecânica).
- O nome do tópico ou subtópico é apenas o endereço do conteúdo; NUNCA crie meta-questões perguntando sobre a banca ou sobre o edital em si. Avalie sempre o conhecimento científico/disciplinar real do candidato.
${avoidSection}

═════════════════════════════════════════════════════════════════════
2. REGRAS INEGOCIÁVEIS DE INEDITISMO E ANTI-REPETIÇÃO (SIMULADOS)
═════════════════════════════════════════════════════════════════════
• ZERO DUPLICIDADE: É terminantemente proibido repetir o mesmo enunciado, cenário, exemplo ou raciocínio de perguntas anteriores.
• NÃO INVERTA APENAS O GABARITO: Mudar a ordem das alternativas ou trocar a letra correta NÃO cria uma questão nova.
• EXPLORAÇÃO PROFUNDA DO TÓPICO: Todo subtópico é amplo. A cada nova requisição sobre o mesmo assunto, explore uma ramificação, vertente teórica, exceção normativa ou mecanismo científico diferente.
• ESTRUTURA DAS QUESTÕES:
  - 4 alternativas plausíveis e homogêneas (A, B, C, D), com linguagem formal de concurso e extensão similar.
  - Apenas 1 alternativa inequivocamente correta.
  - Comentário que ensina a matéria: justifique a correta e aponte o erro conceitual específico de cada distrator.
• Antes de redigir a questão, analise internamente: Qual é a casca de banana principal? Qual exceção técnica será testada? Por que as alternativas incorretas parecem corretas? Só então, entregue a questão formatada.

═════════════════════════════════════════════════════════════════════
3. FORMATAÇÃO LIMPA DE FÓRMULAS E SÍMBOLOS MATEMÁTICOS/CIENTÍFICOS
═════════════════════════════════════════════════════════════════════
• Nunca deixe comandos LaTeX crus soltos no texto sem delimitadores (como \\lambda, \\frac, \\times).
• Fórmulas e equações isoladas devem ficar entre dois sinais de dólar ($$...$$).
• Variáveis no meio da frase devem ficar entre um sinal de dólar ($d$, $\\lambda$, $AN$, $\\Delta$).
• Prefira caracteres diretos para unidades e operações simples quando não for necessária equação complexa.

FORMATO OBRIGATÓRIO (JSON PURO):
Retorne EXCLUSIVAMENTE um objeto JSON válido no seguinte schema:
{
  "questions": [
    {
      "id": "gen-${Date.now()}-1",
      "discipline": "${specialty || "Geral"}",
      "topic": "${topic || "Geral"}",
      "subtopic": "${subtopic || ""}",
      "statement": "Texto denso e contextualizado do enunciado avaliando o conhecimento científico/disciplinar real...",
      "options": [
        { "id": "A", "text": "Alternativa A técnica e bem elaborada" },
        { "id": "B", "text": "Alternativa B técnica e bem elaborada" },
        { "id": "C", "text": "Alternativa C técnica e bem elaborada" },
        { "id": "D", "text": "Alternativa D técnica e bem elaborada" }
      ],
      "correctOptionId": "A",
      "eliteAnalysis": {
        "mainTrap": "Casca de banana principal preparada pela banca examinadora...",
        "technicalException": "Exceção técnica, mecanismo científico ou detalhe obscuro testado...",
        "distractorsTrapAnalysis": "Por que as alternativas incorretas parecem corretas para quem estudou superficialmente..."
      },
      "explanation": "Gabarito Comentado Item por Item:\\n• Item A (CORRETO): justificativa fundamentada ensinando a matéria...\\n• Item B (INCORRETO): erro conceitual específico do distrator...\\n• Item C (INCORRETO): erro conceitual específico do distrator...\\n• Item D (INCORRETO): erro conceitual específico do distrator...",
      "funeceInsight": "Radar de Pegadinha FUNECE: como a banca CEV/UECE formula a armadilha neste conteúdo...",
      "legalOrAuthorReference": "Referência Científica, Doutrinária ou Legal precisa",
      "difficulty": "Difícil"
    }
  ]
}`;

    try {
      const response = await callGeminiWithFallback({
        preferredModel: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        let rawText = response.text.trim();
        if (rawText.startsWith("```json")) {
          rawText = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
        } else if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        const parsed = JSON.parse(rawText);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return res.json(parsed);
        }
      }
    } catch (genError: any) {
      const reason = genError?.message ? genError.message.slice(0, 80) : "offline/quota";
      console.log(`[Questions Generator] Curated FUNECE question bank fallback applied (${reason})`);
    }

    // High quality generated multifaceted question fallback pool
    const safeTopic = topic || "Legislação e Didática";
    const safeSubtopic = subtopic || "Marcos Regulatórios e Prática Pedagógica";
    const timestamp = Date.now();

    const fallbackTemplates = [
      {
        angle: "Perspectiva Prática e Gestão Democrática",
        statement: `(FUNECE / SEDUC-CE - Inédita) No âmbito do Ensino Médio da rede estadual do Ceará, a consolidação do tema "${safeTopic}" (${safeSubtopic}) exige uma práxis articulada aos princípios da gestão democrática e autonomia pedagógica. Considerando as diretrizes curriculares e doutrinárias vigentes, assinale a opção CORRETA:`,
        options: [
          { id: "A", text: "A ação pedagógica deve articular o conhecimento sistematizado à realidade dos estudantes, promovendo a apropriação crítica e o desenvolvimento de competências socioemocionais." },
          { id: "B", text: "A elaboração da proposta curricular prescinde da participação coletiva do corpo docente, devendo ser estritamente delegada à coordenação técnica da CREDE." },
          { id: "C", text: "Os processos avaliativos devem priorizar a classificação seletiva em detrimento da função diagnóstica e formativa da aprendizagem." },
          { id: "D", text: "O currículo escolar deve pautar-se pela fragmentação conteudista mecânica, vedando práticas interdisciplinares e projetos integradores." }
        ],
        correctOptionId: "A",
        explanation: "• Item A (CORRETO): Expressa a concepção emancipatória e crítica da Didática (Saviani e Libâneo) e os princípios da LDB (Art. 3º e 14).\n• Itens B, C e D (INCORRETOS): Introduzem concepções autoritárias, burocráticas ou descontextualizadas rejeitadas pela FUNECE.",
        funeceInsight: "A FUNECE costuma apresentar distratores que minimizam a gestão colegiada e a intervenção diagnóstica.",
        legalOrAuthorReference: "LDB nº 9.394/1996, Arts. 12 a 14; LIBÂNEO, J. C. Didática.",
        difficulty: "Difícil" as const,
        eliteAnalysis: {
          mainTrap: "Tentativa de legitimar o autoritarismo burocrático mascarado sob jargões de eficiência administrativa.",
          technicalException: "A gestão democrática no Ceará é princípio constitucional e legal inafastável, não mera convenção escolar.",
          distractorsTrapAnalysis: "Os distratores utilizam linguagem técnica formal para tentar convencer o candidato desatento a aceitar hierarquias centralizadoras."
        }
      },
      {
        angle: "Perspectiva Legal e Normativa",
        statement: `(FUNECE / SEDUC-CE - Inédita) No que concerne aos marcos regulatórios e à legislação educacional aplicável ao conteúdo de "${safeTopic}" (${safeSubtopic}), assinale a afirmativa tecnicamente CORRETA segundo o ordenamento jurídico educacional:`,
        options: [
          { id: "A", text: "O dever do Estado com a educação escolar pública efetiva-se mediante garantia de padrão de qualidade e atendimento ao educando em todas as etapas da Educação Básica." },
          { id: "B", text: "O Projeto Político-Pedagógico (PPP) é dispensável para unidades de ensino que adotem materiais apostilados padronizados." },
          { id: "C", text: "A incumbência docente exclui a participação na elaboração da proposta pedagógica da escola, restringindo-se à aplicação de provas." },
          { id: "D", text: "O ensino fundamental e médio devem ser ministrados sob rígida homogeneidade metodológica, sendo vedada a pluralidade de ideias e de concepções pedagógicas." }
        ],
        correctOptionId: "A",
        explanation: "• Item A (CORRETO): Literalidade e princípio estruturante da CF/88 (Art. 206) e da LDB (Art. 4º).\n• Itens B, C e D (INCORRETOS): Violam os Arts. 3º, 12 e 13 da LDB.",
        funeceInsight: "A FUNECE frequentemente cobra a distinção entre incumbências da escola (Art. 12) e incumbências dos docentes (Art. 13).",
        legalOrAuthorReference: "Constituição Federal Art. 206; LDB Lei nº 9.394/1996.",
        difficulty: "Difícil" as const,
        eliteAnalysis: {
          mainTrap: "Confusão deliberada entre incumbências do estabelecimento escolar e deveres do corpo docente.",
          technicalException: "O PPP tem caráter obrigatório e indelegável, vedada qualquer substituição por sistemas de ensino privados.",
          distractorsTrapAnalysis: "Apresentam afirmativas que simulam exigências de padronização, contradizendo o princípio do pluralismo pedagógico."
        }
      },
      {
        angle: "Perspectiva Doutrinária e Metodológica",
        statement: `(FUNECE / SEDUC-CE - Inédita) Sob a ótica das teorias pedagógicas contemporâneas aplicadas a "${safeTopic}" (${safeSubtopic}), analise a relação entre o processo de ensino-aprendizagem e a mediação docente, assinalando a alternativa CORRETA:`,
        options: [
          { id: "A", text: "A mediação pedagógica intencional atua na Zona de Desenvolvimento Proximal, possibilitando que o estudante transforme saberes potenciais em competências consolidadas." },
          { id: "B", text: "O conhecimento é adquirido exclusivamente por condicionamento operante linear, prescindindo de interações sociais e mediação semiótica." },
          { id: "C", text: "O papel do educador restringe-se ao de mero espectador neutro, sem responsabilidade de intervenção planejada no percurso formativo." },
          { id: "D", text: "O erro do estudante deve ser tratado como falha moral passível de punição, e não como indicador diagnóstico do percurso cognitivo." }
        ],
        correctOptionId: "A",
        explanation: "• Item A (CORRETO): Fundamenta-se na teoria histórico-cultural de Lev Vygotsky, amplamente referenciada pela banca UECE/CEV.\n• Itens B, C e D (INCORRETOS): Reduzem o processo educativo a visões mecanicistas ou punitivas.",
        funeceInsight: "A banca CEV-UECE prestigia referenciais interacionistas e histórico-críticos, destacando o papel ativo do professor como mediador do saber.",
        legalOrAuthorReference: "VYGOTSKY, L. S. A Formação Social da Mente; LUCKESI, C. C. Avaliação da Aprendizagem Escolar.",
        difficulty: "Difícil" as const,
        eliteAnalysis: {
          mainTrap: "Redução da mediação sociointeracionista a um tecnicismo condutivista simplista.",
          technicalException: "O erro em Vygotsky e Luckesi é epistemológico e construtivo, ponto central para a avaliação diagnóstica.",
          distractorsTrapAnalysis: "Empregam terminologia comportamentalista estrita que atrai candidatos com vícios de formação tradicional."
        }
      }
    ];

    const chosenTemplate = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
    const fallbackQuestion = {
      id: `gen-fb-${timestamp}-${Math.floor(Math.random() * 1000)}`,
      discipline: specialty || "Didática e Legislação",
      topic: safeTopic,
      subtopic: safeSubtopic,
      specialty,
      banca: "FUNECE Inédita",
      statement: chosenTemplate.statement,
      options: chosenTemplate.options,
      correctOptionId: chosenTemplate.correctOptionId,
      explanation: chosenTemplate.explanation,
      funeceInsight: chosenTemplate.funeceInsight,
      legalOrAuthorReference: chosenTemplate.legalOrAuthorReference,
      difficulty: chosenTemplate.difficulty,
      eliteAnalysis: chosenTemplate.eliteAnalysis,
    };

    res.json({ questions: [fallbackQuestion] });
  } catch (error: any) {
    console.error("Questions generation critical error:", error);
    res.status(500).json({ error: "Falha ao gerar questão com a IA." });
  }
});

// 4. Generate Optimized PDF Material Summary Sheet
apiRouter.post("/materials/generate-summary", async (req: Request, res: Response) => {
  try {
    const { specialty, topic } = req.body;

    const prompt = `Crie um RESUMO ESQUEMATIZADO OTIMIZADO PARA O EDITAL DA SEDUC-CE (Banca FUNECE).
Especialidade: ${specialty}
Tópico: ${topic}

O material deve conter:
1. Título do Eixo do Edital
2. Conceitos-Chave indispensáveis (bullet points objetivos)
3. "Como a FUNECE cobra este tema" (padrões de cobrança da banca UECE/CEV)
4. Mnemônicos e Esquemas Práticos para memorização rápida
5. Tabela Comparativa ou Síntese Doutrinária/Legal
6. 2 Questões-Exemplo com gabarito comentado
7. Checklist de Revisão Rápida para o dia da prova.

Retorne em formato JSON:
{
  "title": "Título claro do material",
  "specialty": "${specialty}",
  "topic": "${topic}",
  "estimatedReadTimeMinutes": 8,
  "keyConcepts": ["Conceito 1...", "Conceito 2..."],
  "funeceProfile": "Explicação da forma que a FUNECE formula itens deste conteúdo...",
  "mnemonics": [
    { "name": "Nome da Regra / Macete", "description": "Como aplicar no concurso..." }
  ],
  "contentSections": [
    {
      "heading": "Título da Seção",
      "body": "Texto explicativo denso e objetivo...",
      "highlight": "Ponto de atenção ou pegadinha"
    }
  ],
  "summaryTable": {
    "headers": ["Critério / Autor", "Conceito Central", "Palavra-Chave na FUNECE"],
    "rows": [
      ["Linha 1", "Conceito 1", "Chave 1"],
      ["Linha 2", "Conceito 2", "Chave 2"]
    ]
  },
  "quickChecklist": ["Item 1 revisado", "Item 2 memorizado", "Item 3 praticado"]
}`;

    try {
      const response = await callGeminiWithFallback({
        preferredModel: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (genError: any) {
      const reason = genError?.message ? genError.message.slice(0, 80) : "offline/quota";
      console.log(`[Material Summary] Curated FUNECE summary fallback applied (${reason})`);
    }

    res.json({
      title: `Resumo Esquematizado FUNECE: ${topic}`,
      specialty: specialty || "Geral",
      topic: topic || "Legislação e Didática",
      estimatedReadTimeMinutes: 8,
      keyConcepts: [
        `Conceito central e definições fundamentais de ${topic} no âmbito da SEDUC-CE`,
        "Fundamentação legal e doutrinária exigida no edital",
        "Articulação entre a teoria e a prática pedagógica nas escolas estaduais do Ceará",
      ],
      funeceProfile: `A FUNECE costuma formular questões diretas sobre este tema, exigindo memorização de competências, marcos temporais e distinções doutrinárias essenciais.`,
      mnemonics: [
        {
          name: "Regra de Ouro FUNECE",
          description: "Elimine de imediato alternativas com termos restritivos arbitrários ('somente', 'exclusivamente', 'vedado em qualquer hipótese').",
        },
      ],
      contentSections: [
        {
          heading: "1. Marco Teórico e Legal",
          body: `O estudo deste conteúdo deve ser orientado pelas diretrizes oficiais e referências bibliográficas do edital, com atenção especial à terminologia técnica.`,
          highlight: "Atenção às atualizações legislativas e normativas do Ceará.",
        },
      ],
      summaryTable: {
        headers: ["Eixo", "Conceito Chave", "Enfoque na Prova"],
        rows: [
          ["Fundamento Principal", "Definição Doutrinária", "Cobrança Conceitual"],
          ["Aplicação Prática", "Contexto Escolar SEDUC", "Estudo de Caso / Questão"],
        ],
      },
      quickChecklist: [
        "Leitura do artigo/capítulo de referência",
        "Resolução de 10 questões da CEV-UECE",
        "Revisão dos pontos de pegadinha",
      ],
    });
  } catch (error: any) {
    console.error("Summary generation critical error:", error);
    res.status(500).json({ error: "Falha ao gerar resumo otimizado." });
  }
});

// Register routes on both "/api" and root "/" so Vercel rewrites match regardless of path prefix
app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
