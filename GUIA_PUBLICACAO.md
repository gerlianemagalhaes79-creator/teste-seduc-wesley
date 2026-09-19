# Guia Completo de Publicação no Vercel & Configuração do Gemini AI

Este guia passo a passo foi preparado para você publicar seu aplicativo no Vercel com **sucesso absoluto**, garantindo que as questões de concurso e o Mentor FUNECE funcionem com inteligência artificial real, rigor e profundidade máxima (sem cair em respostas simples ou genéricas).

---

## ⚠️ A Causa do Problema que Ocorria

No ambiente de teste da plataforma, a chave de inteligência artificial (`GEMINI_API_KEY`) já estava configurada nos bastidores. 

Porém, ao enviar o projeto para o **GitHub** e de lá para o **Vercel**:
1. Por segurança, chaves secretas **nunca** vão para o GitHub.
2. Sem a chave configurada no painel do Vercel, o servidor não conseguia chamar a IA do Google Gemini.
3. Para o aplicativo não travar com tela branca para o usuário, o sistema ativava um gerador offline de emergência com perguntas pré-definidas simplificadas.

Ao seguir as instruções abaixo para adicionar a sua chave no painel do Vercel, a inteligência artificial do Google Gemini responderá em tempo real com as diretrizes da banca examinadora FUNECE/CEV-UECE!

---

## 🔑 Passo 1: Obter sua Chave Gratuita do Google Gemini

1. Acesse o site do [Google AI Studio](https://aistudio.google.com/).
2. Faça login com sua conta do Google.
3. No menu lateral ou no topo, clique no botão azul **"Get API key"** (Obter chave de API).
4. Clique em **"Create API key"** (Criar chave de API) e selecione ou crie um projeto padrão.
5. Copie o código longo gerado (sua chave começa geralmente com letras como `AIzaSy...`). Guarde-a em um bloco de notas seguro.

---

## ⚙️ Passo 2: Configurar a Chave no Vercel (Passo Mais Importante!)

1. Acesse o site da [Vercel](https://vercel.com/) e faça login.
2. Na página inicial do seu painel (Dashboard), clique sobre o seu projeto do concurso SEDUC-CE.
3. No menu superior da página do projeto, clique na aba **Settings** (Configurações).
4. No menu lateral esquerdo, clique em **Environment Variables** (Variáveis de Ambiente).
5. No formulário que abrir:
   - No campo **Key** (Chave), digite exatamente:
     ```text
     GEMINI_API_KEY
     ```
   - No campo **Value** (Valor), cole a chave que você copiou no Passo 1 (ex.: `AIzaSy...`).
   - Verifique se as 3 caixas de seleção estão marcadas: **Production**, **Preview** e **Development**.
   - Clique no botão azul **Save** (Salvar).

---

## 🚀 Passo 3: Fazer um Novo Deploy (Redeploy)

Para que a Vercel passe a usar a nova chave de inteligência artificial:

1. No menu superior do seu projeto no Vercel, clique na aba **Deployments**.
2. Localize o primeiro deploy do topo da lista (o mais recente).
3. Clique nos **três pontinhos (...)** no lado direito desse deploy.
4. Selecione a opção **Redeploy**.
5. Na janelinha de confirmação, clique em **Redeploy**.
6. Aguarde cerca de 1 a 2 minutos até aparecer o status **Ready** com uma bolinha verde.
7. Pronto! Clique no link do seu site.

---

## 🧪 Passo 4: Como Testar e Comprovar a IA Real Funcionando

Agora faça o teste no seu aplicativo publicado:

1. **Nos Simulados FUNECE:**
   - Acesse a aba **Simulados FUNECE**.
   - Clique no botão **"Elaborar Questão Inédita de Alto Nível (IA)"** ou selecione um tópico/subtópico.
   - A IA oficial gerará uma questão inédita com enunciado denso, 4 alternativas técnicas, Radar de Pegadinhas FUNECE e justificativa ponto a ponto com fundamentação legal e bibliográfica real.

2. **No Mentor FUNECE IA:**
   - Acesse a aba **Mentor FUNECE IA**.
   - Clique no modo **"Banca Examinadora (Criar & Aplicar Questões)"**.
   - Clique na sugestão rápida: *"📝 Iniciar modo Banca Examinadora: aplique a primeira questão inédita!"*
   - O mentor passará a atuar estritamente como a banca examinadora, aplicando questões de alto nível e avaliando suas respostas!

---

## 📋 Resumo das Variáveis de Ambiente no Vercel

| Nome da Variável | Valor | Obrigatória? |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Sua chave obtida no Google AI Studio (`AIzaSy...`) | **SIM (Indispensável)** |

Se precisar trocar de chave no futuro ou se tiver qualquer dúvida, basta voltar na aba **Settings > Environment Variables** do Vercel e editar o valor.
