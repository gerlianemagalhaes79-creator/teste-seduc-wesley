import { MentorWeeklyDiagnosis, Question, PDFMaterial, SpecialtyId } from "../types";

export interface ChatHistoryItem {
  sender: "user" | "mentor";
  text: string;
}

export interface StudentScheduleDay {
  dayNumber: number;
  dayLabel: string;
  topics: Array<{
    title: string;
    moduleName: string;
    description?: string;
    keyFormulasOrLaws?: string;
    subtopics?: string[];
  }>;
}

export interface StudentContextPayload {
  hoursPerDay: number;
  delayedTopics: string[];
  accuracyRate: string;
  scheduleByDay?: StudentScheduleDay[];
  specialtyName?: string;
  currentDateFormatted?: string;
  currentDayOfWeekName?: string;
  currentDayNumber?: number;
}

export type GeminiModelTier = "fast" | "general" | "complex";

export interface QuestionContextPayload {
  id?: string;
  discipline?: string;
  topic?: string;
  subtopic?: string;
  statement: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
  funeceInsight?: string;
  legalOrAuthorReference?: string;
  userSelectedOption?: string | null;
  eliteAnalysis?: {
    mainTrap?: string;
    technicalException?: string;
    distractorsTrapAnalysis?: string;
  };
}

export async function askMentorChat(
  message: string,
  specialty: SpecialtyId,
  studentContext: StudentContextPayload,
  chatHistory: ChatHistoryItem[] = [],
  modelTier: GeminiModelTier = "general",
  mentorRole: "general" | "discursiva" | "pegadinhas" | "banca_examinadora" = "general"
): Promise<string> {
  try {
    const res = await fetch("/api/mentor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        specialty,
        studentContext,
        chatHistory,
        modelTier,
        mentorRole,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.reply || data.fallback || "Professor, continue firme nos estudos com foco no perfil da FUNECE!";
  } catch (err: any) {
    console.log("[Client] Using offline mentor fallback:", err?.message || "offline");

    const trimmedMsg = message.trim().toLowerCase();

    // 1. Simple Greetings: 1 to 2 short and friendly sentences
    if (/^(oi|ol[aá]|bom\s+dia|boa\s+tarde|boa\s+noite|e\s+a[ií]|tudo\s+bem|opa)[!.,?]?$/i.test(trimmedMsg)) {
      return `Olá, Professor(a)! Como posso orientar sua preparação para o concurso da SEDUC-CE hoje? Conte comigo!`;
    }

    // 2. Emotional / Conversational doubts: Calm welcoming and didactics
    if (/(n[aã]o\s+entendi|est[aá]\s+dif[ií]cil|n[aã]o\s+sei\s+isso|explique\s+melhor|socorro|me\s+ajuda|n[aã]o\s+compreendi)/i.test(trimmedMsg)) {
      return `Calma, professor(a)! Vamos descomplicar esse conteúdo passo a passo. Diga-me exatamente qual ponto ou termo específico gerou dúvida para que eu utilize uma analogia prática e direta ao padrão da FUNECE.`;
    }

    // 3. Check if user is asking what day is today
    const isAskingToday = /que\s+dia\s+(?:é|e)\s+hoje|hoje\s+(?:é|e)\s+que\s+dia|qual\s+(?:é|e)\s+o\s+dia\s+de\s+hoje|que\s+dia\s+estamos/i.test(message);
    if (isAskingToday) {
      const now = new Date();
      const weekdayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
      const currentWeekday = studentContext.currentDayOfWeekName || weekdayNames[now.getDay()];
      const currentDateStr = studentContext.currentDateFormatted || now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const todayNumber = studentContext.currentDayNumber || (now.getDay() === 0 ? 7 : now.getDay());
      const todaySchedule = studentContext.scheduleByDay?.find((d) => d.dayNumber === todayNumber);
      let studyNote = "";
      if (todaySchedule && todaySchedule.topics.length > 0) {
        studyNote = `\n\n📚 **Seus tópicos programados para hoje (${currentWeekday}):**\n` +
          todaySchedule.topics.map((t) => `• **${t.moduleName}:** ${t.title}`).join("\n");
      }
      return `📅 **Hoje é ${currentWeekday} (${currentDateStr})**!${studyNote}\n\n🎯 Foco total nos estudos para a SEDUC-CE / FUNECE. Qual tópico você gostaria de dissecar agora?`;
    }

    // 4. Day-aware offline fallback if user asks about a specific day (e.g. dia 2, dia 4)
    const dayMatch = message.match(/(?:dia|t[oó]pico\s+do\s+dia)\s*([1-6])/i);
    if (dayMatch && studentContext.scheduleByDay) {
      const requestedDay = parseInt(dayMatch[1], 10);
      const dayData = studentContext.scheduleByDay.find((d) => d.dayNumber === requestedDay);
      if (dayData && dayData.topics.length > 0) {
        const topicsList = dayData.topics
          .map((t, idx) => `• **${t.moduleName}:** ${t.title}${t.keyFormulasOrLaws ? `\n  📌 *Base Legal/Mnemônico:* ${t.keyFormulasOrLaws}` : ""}`)
          .join("\n\n");
        return `📅 **Metas Oficiais de Estudo - ${dayData.dayLabel} (Dia ${dayData.dayNumber})**:

${topicsList}

💡 **Padrão FUNECE (CEV-UECE):**
Resolva questões diretas de múltipla escolha sobre esses temas para fixar as exceções e evitar os distratores clássicos da banca!`;
      }
    }

    return `Olá, Professor(a)! Como seu Mentor FUNECE para ${(studentContext.specialtyName || specialty).toUpperCase()}:
Lembre-se de que a CEV/UECE valoriza questões com rigor conceitual, doutrina clássica de Libâneo e Luckesi, e a letra da lei da LDB e do Estatuto do Magistério do Ceará (Lei 10.884/84).

Qual subtópico específico do seu edital você gostaria de dissecar agora?`;
  }
}

export async function askSimuladoChat(
  message: string,
  questionContext?: QuestionContextPayload | null,
  chatHistory: ChatHistoryItem[] = [],
  modelTier: GeminiModelTier = "fast",
  tutorRole: "socratic" | "trap_breaker" | "theoretical" = "trap_breaker"
): Promise<string> {
  try {
    const res = await fetch("/api/simulado/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        questionContext,
        chatHistory,
        modelTier,
        tutorRole,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return (
      data.reply ||
      "Nesta questão da FUNECE, atente-se às pegadinhas conceituais e ao gabarito oficial com fundamentação técnica."
    );
  } catch (err: any) {
    console.log("[Client] Using offline simulado chatbot fallback:", err?.message || "offline");
    if (questionContext) {
      return `📌 **Tutor Gemini FUNECE (Análise da Questão):**\n\nNesta questão de **${
        questionContext.topic || "Didática/Específica"
      }**, o gabarito oficial é a **Letra ${questionContext.correctOptionId}**.\n\n${
        questionContext.explanation ||
        "Fique atento aos distratores que invertem atribuições normativas ou utilizam termos excludentes."
      }\n\n💡 *Dica:* A CEV/UECE valoriza a fidelidade doutrinária e legal.`;
    }
    return `Olá! Sou seu Tutor Gemini de Simulados FUNECE. Em que posso te ajudar na resolução desta bateria de questões?`;
  }
}

export async function fetchWeeklyDiagnosis(
  specialty: SpecialtyId,
  studyStats: {
    totalQuestions: number;
    overallAccuracy: number;
    streak: number;
  },
  delayedTopics: string[],
  topicAccuracies: Record<string, number>
): Promise<MentorWeeklyDiagnosis> {
  try {
    const res = await fetch("/api/mentor/weekly-diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        specialty,
        studyStats,
        delayedTopics,
        topicAccuracies,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: MentorWeeklyDiagnosis = await res.json();
    return {
      ...data,
      generatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.log("[Client] Using offline diagnosis fallback:", err?.message || "offline");
    return {
      diagnosticSummary: `Análise do Mentor FUNECE para ${specialty}: Seu rendimento geral está em ${studyStats.overallAccuracy}%. Para garantir sua vaga na SEDUC-CE, é essencial blindar os conteúdos de Legislação Educacional e eliminar os tópicos atrasados.`,
      scoreRating: studyStats.overallAccuracy >= 75 ? "Bom ritmo" : "Atenção necessária",
      priorityActions: [
        "Dedicar 40 minutos diários exclusivamente para questões comentadas da FUNECE",
        "Revisar o Estatuto do Magistério do Ceará (Lei Estadual nº 10.884/84)",
        "Resolver o Caderno de Erros acumulado nos últimos simulados",
      ],
      funeceTrapsToWatch: [
        "A FUNECE costuma trocar competências da Escola (LDB Art. 12) pelas do Professor (Art. 13)",
        "Cuidado com questões de crase antes de pronomes de tratamento e palavras masculinas",
      ],
      recommendedHoursWeekly: 18,
      mentorMotivation: "Quem domina o estilo da banca FUNECE não é surpreendido no dia da prova da SEDUC-CE. A vaga de professor efetivo é sua!",
      scheduleAdjustmentAdvice: "Realoque os tópicos atrasados para o sábado de revisão ou para o primeiro horário do dia.",
      generatedAt: new Date().toISOString(),
    };
  }
}

export async function generateFuneceQuestions(
  specialty: SpecialtyId,
  topic: string,
  count = 1,
  subtopic?: string,
  avoidStatements?: string[]
): Promise<Question[]> {
  try {
    const res = await fetch("/api/questions/generate-funece", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specialty, topic, count, subtopic, avoidStatements }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
      return data.questions;
    }
  } catch (err: any) {
    console.log("[Client] Generating guaranteed curated question fallback:", err?.message || "offline");
  }

  // Guaranteed fallback questions generation tailored to FUNECE & SEDUC-CE
  const safeTopic = topic || "Conhecimentos Pedagógicos e Didática";
  const safeSubtopic = subtopic || "Fundamentos e Diretrizes Curriculares";
  const timestamp = Date.now();

  let inferredDiscipline = "Conhecimentos Específicos";
  const lowerTopic = safeTopic.toLowerCase();
  if (lowerTopic.includes("didát") || lowerTopic.includes("pedag") || lowerTopic.includes("tendência")) {
    inferredDiscipline = "Didática e Educação Brasileira";
  } else if (lowerTopic.includes("portugu") || lowerTopic.includes("crase") || lowerTopic.includes("sintaxe")) {
    inferredDiscipline = "Língua Portuguesa";
  } else if (lowerTopic.includes("administra") || lowerTopic.includes("limpe") || lowerTopic.includes("art. 37")) {
    inferredDiscipline = "Administração Pública";
  } else if (lowerTopic.includes("legisla") || lowerTopic.includes("ldb") || lowerTopic.includes("estatuto")) {
    inferredDiscipline = "Legislação Educacional do CE";
  } else if (lowerTopic.includes("spaece") || lowerTopic.includes("saeb") || lowerTopic.includes("indicador")) {
    inferredDiscipline = "Indicadores Educacionais";
  }

  const variations: Array<{
    statement: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
    explanation: string;
    funeceInsight: string;
    legalOrAuthorReference: string;
    difficulty: "Média" | "Difícil" | "Fácil" | "Pegadinha Clássica FUNECE";
    eliteAnalysis?: {
      mainTrap: string;
      technicalException: string;
      distractorsTrapAnalysis: string;
    };
  }> = [
    {
      statement: `(FUNECE / SEDUC-CE - Inédita) No que concerne ao tema "${safeTopic}" (${safeSubtopic}) no âmbito da Educação Básica e do Ensino Médio, assinale a opção que expressa uma afirmação tecnicamente CORRETA, em conformidade com as diretrizes da banca CEV/UECE:`,
      options: [
        { id: "A", text: "A prática docente reflexiva e o planejamento curricular integrado devem articular o desenvolvimento de competências socioemocionais e cognitivas, respeitando a diversidade e a gestão democrática escolar." },
        { id: "B", text: "O currículo escolar no Ensino Médio deve ser estritamente enciclopédico e conteudista desvinculado da realidade social dos estudantes e das diretrizes do DCRC." },
        { id: "C", text: "A avaliação das aprendizagens assume papel primordialmente classificatório e seletivo, restringindo-se à aplicação pontual de provas bimestrais sem intervenção diagnóstica." },
        { id: "D", text: "A organização do trabalho pedagógico prescinde do Projeto Político-Pedagográfico (PPP), cabendo a cada professor atuar de maneira isolada sem articulação com o colegiado escolar." },
      ],
      correctOptionId: "A",
      explanation: `GABARITO ITEM A:
• Item A (CORRETO): Expressa fielmente os princípios da LDB (Lei 9.394/96, art. 3º) e os fundamentos de autores contemporâneos (Libâneo, Celso Vasconcellos e Luckesi) quanto à práxis pedagógica integrada e à gestão democrática.
• Item B (INCORRETO): Contradiz as orientações da BNCC e do DCRC que priorizam a contextualização e a interdisciplinaridade.
• Item C (INCORRETO): Distrator clássico da FUNECE que inverte a primazia da avaliação formativa/diagnóstica pela somativa/punitiva.
• Item D (INCORRETO): Desconsidera a obrigatoriedade da construção coletiva do PPP (LDB Art. 12 e 13).`,
      funeceInsight: "Radar de Pegadinha FUNECE: A banca adora criar distratores que parecem técnicos mas contêm visões burocráticas, punitivas ou de isolamento do docente.",
      legalOrAuthorReference: "LDB Lei 9.394/1996, Arts. 12 e 13; LIBÂNEO, J. C. Didática.",
      difficulty: "Difícil" as const,
      eliteAnalysis: {
        mainTrap: "Inversão entre a função formativa/emancipatória da escola pública e práticas mecânicas/autoritárias travestidas de rigor acadêmico.",
        technicalException: "O PPP não é faculdade da gestão individual, mas incumbência legal coletiva com assento no Art. 12 da LDB.",
        distractorsTrapAnalysis: "Os itens B, C e D utilizam vocabulário burocrático formal para induzir o candidato que confunde exigência conteudista com pedagogia tradicional segregatória."
      }
    },
    {
      statement: `(FUNECE / SEDUC-CE - Inédita) A respeito das estratégias metodológicas e da mediação pedagógica em "${safeTopic}" (${safeSubtopic}), assinale a alternativa INCORRETA:`,
      options: [
        { id: "A", text: "A prática pedagógica deve ser concebida como processo unilateral de transmissão acrítica, no qual o educando assume postura puramente passiva." },
        { id: "B", text: "A mediação pedagógica intencional do professor favorece a superação do senso comum em direção ao saber sistematizado." },
        { id: "C", text: "A transposição didática exige do docente a capacidade de adaptar o saber científico às condições reais de aprendizagem dos estudantes." },
        { id: "D", text: "O uso de metodologias ativas e resolução de problemas estimula a criticidade e o protagonismo juvenil no Ensino Médio." },
      ],
      correctOptionId: "A",
      explanation: `GABARITO ITEM A (INCORRETO solicitado pelo comando):
• Item A (INCORRETO/GABARITO): A visão conteudista e passiva de transmissão acrítica é expressamente superada pelas diretrizes pedagógicas e pelo referencial teórico da FUNECE (Paulo Freire, Saviani e Libâneo).
• Itens B, C e D (CORRETOS): Apresentam conceitos consolidados de mediação (Vygotsky), transposição didática (Chevallard) e metodologias ativas (Moran).`,
      funeceInsight: "Radar de Pegadinha FUNECE: Fique sempre muito atento aos comandos que pedem a alternativa INCORRETA ou FALSA. A FUNECE utiliza termos restritivos ou autoritários como distratores.",
      legalOrAuthorReference: "LIBÂNEO, J. C. Didática; SAVIANI, D. Pedagogia Histórico-Crítica; FREIRE, P. Pedagogia da Autonomia.",
      difficulty: "Difícil",
    },
    {
      statement: `(FUNECE / SEDUC-CE - Inédita) Em uma situação-problema típica vivenciada em escola de Ensino Médio da rede estadual do Ceará, um grupo docente debate a aplicação prática de "${safeTopic}" (${safeSubtopic}). Para garantir alinhamento ao DCRC e à legislação, a decisão colegiada deve:`,
      options: [
        { id: "A", text: "Promover a articulação entre as áreas do conhecimento e as unidades curriculares eletivas, estimulando a pesquisa como princípio pedagógico formativo." },
        { id: "B", text: "Eliminar a possibilidade de estudos de recuperação contínua e paralela para alunos com menor rendimento escolar." },
        { id: "C", text: "Subordinar todas as decisões pedagógicas exclusivamente a critérios punitivos disciplinares de forma autoritária." },
        { id: "D", text: "Restringir o acesso dos estudantes aos recursos tecnológicos e científicos disponíveis na instituição de ensino." },
      ],
      correctOptionId: "A",
      explanation: "• Item A (CORRETO): Sintetiza a proposta pedagógica do Ensino Médio no Ceará, que articula formação geral básica e itinerários formativos com base na pesquisa e protagonismo.\n• Itens B, C e D (INCORRETOS): Violam expressamente a LDB e as diretrizes do CEE-CE.",
      funeceInsight: "Questões de estudo de caso na FUNECE testam se o professor sabe aplicar a teoria pedagógica em decisões concretas de gestão de sala de aula e colegiado.",
      legalOrAuthorReference: "DCRC - Documento Curricular Referencial do Ceará; LDB Art. 24, V.",
      difficulty: "Difícil",
    }
  ];

  const selected = variations[Math.floor(Math.random() * variations.length)];
  return [
    {
      id: `gen-funece-${timestamp}-${Math.floor(Math.random() * 1000)}`,
      discipline: inferredDiscipline,
      topic: safeTopic,
      subtopic: safeSubtopic,
      specialty,
      banca: "FUNECE Inédita IA",
      statement: selected.statement,
      options: selected.options,
      correctOptionId: selected.correctOptionId,
      explanation: selected.explanation,
      funeceInsight: selected.funeceInsight,
      legalOrAuthorReference: selected.legalOrAuthorReference,
      difficulty: selected.difficulty,
    },
  ];
}

export async function generateTopicSummaryPDF(
  specialty: SpecialtyId,
  topic: string
): Promise<PDFMaterial | null> {
  try {
    const res = await fetch("/api/materials/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specialty, topic }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      id: `ai-mat-${Date.now()}`,
      title: data.title || `Resumo Otimizado: ${topic}`,
      specialty: specialty,
      moduleId: "conhecimentos_especificos",
      topic: topic,
      estimatedReadTimeMinutes: data.estimatedReadTimeMinutes || 10,
      keyConcepts: data.keyConcepts || [],
      funeceProfile: data.funeceProfile || "Perfil padrão da banca FUNECE/CEV.",
      mnemonics: data.mnemonics || [],
      contentSections: data.contentSections || [],
      summaryTable: data.summaryTable,
      quickChecklist: data.quickChecklist || [],
    };
  } catch (err: any) {
    console.log("[Client] Material summary fallback applied:", err?.message || "offline");
    return null;
  }
}
