
// Variáveis globais
let currentModule = 0;
let currentQuestion = 0;
let wrongAnswersCount = 0;
let correctAnswersCount = 0;
let totalQuestions = 0;

// Elementos DOM
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const continueBtn = document.getElementById("continueBtn");
const finishBtn = document.getElementById("finishBtn");
const skipBtn = document.getElementById("skipBtn");
const moduleInfo = document.getElementById("moduleInfo");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const levelUpSound = document.getElementById("levelUpSound");
const quizPage = document.getElementById("quizPage");
const certificatePage = document.getElementById("certificatePage");
const userNameInput = document.getElementById("userName");
const generateCertificateBtn = document.getElementById("generateCertificateBtn");
const certificateName = document.getElementById("certificateName");

// Módulos e perguntas
const modules = [
    // Cole aqui todos os módulos e perguntas (o array `modules` completo)
];

// Conta o total de perguntas
modules.forEach(mod => totalQuestions += mod.questions.length);

// Função para exibir perguntas
function showQuestion() {
    const mod = modules[currentModule];
    moduleInfo.textContent = `Módulo ${currentModule + 1} de ${modules.length} — ${mod.title}`;
    const q = mod.questions[currentQuestion];
    questionText.style.opacity = 0;
    setTimeout(() => {
        questionText.textContent = q.q;
        questionText.style.opacity = 1;
    }, 200);
    optionsDiv.innerHTML = "";
    nextBtn.style.display = "none";
    finishBtn.style.display = "none";
    q.a.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(btn);
    });
}

// Função para verificar resposta
function checkAnswer(selected) {
    const q = modules[currentModule].questions[currentQuestion];
    if (selected === q.correct) {
        optionsDiv.querySelectorAll("button")[selected].style.background = "rgba(0,255,100,0.5)";
        correctSound.play();
        correctAnswersCount++;
    } else {
        optionsDiv.querySelectorAll("button")[selected].style.background = "rgba(255,0,0,0.5)";
        optionsDiv.querySelectorAll("button")[q.correct].style.background = "rgba(0,255,100,0.5)";
        wrongSound.play();
        wrongAnswersCount++;
    }
    nextBtn.style.display = "block";
}

// Próxima pergunta ou módulo
nextBtn.onclick = () => {
    currentQuestion++;
    const mod = modules[currentModule];
    if (currentQuestion >= mod.questions.length) {
        currentModule++;
        currentQuestion = 0;
        if (currentModule < modules.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    } else {
        showQuestion();
    }
};

// Finaliza o quiz
function finishQuiz() {
    const score = Math.round((correctAnswersCount / totalQuestions) * 100);
    if (score >= 1) {
        quizPage.style.display = "none";
        certificatePage.style.display = "flex";
    } else {
        questionText.textContent = `Parabéns por concluir o quiz! Você acertou ${correctAnswersCount} de ${totalQuestions} perguntas (${score}%).`;
        optionsDiv.innerHTML = `
            <p>Incentivamos você a pesquisar as respostas corretas na Bíblia ou na internet e tentar novamente!</p>
            <p>Que Deus abençoe seus estudos!</p>
        `;
        continueBtn.style.display = "block";
    }
}

// Reinicia o quiz
continueBtn.onclick = () => {
    currentModule = 0;
    currentQuestion = 0;
    wrongAnswersCount = 0;
    correctAnswersCount = 0;
    showQuestion();
    continueBtn.style.display = "none";
};

// Pula para o último módulo
skipBtn.onclick = () => {
    currentModule = modules.length - 1;
    currentQuestion = 0;
    showQuestion();
};

// Gera o certificado
generateCertificateBtn.onclick = () => {
    const userName = userNameInput.value.trim();
    if (!userName) {
        alert("Por favor, digite seu nome completo.");
        return;
    }
    certificateName.textContent = userName;
    generatePDF();
};

// Função para gerar PDF do certificado
function generatePDF() {
    const userName = certificateName.textContent;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    // Configurações de estilo e conteúdo do PDF
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 7;
    const titleFontSize = 22;
    const textFontSize = 14;
    const signatureFontSize = 18;
    const goldColor = [212, 175, 55];
    const brownColor = [139, 69, 19];
    // Desenha a borda dourada
    doc.setDrawColor(...goldColor);
    doc.setLineWidth(1.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    // Cabeçalho dourado
    doc.setFillColor(...goldColor);
    doc.rect(margin, margin, pageWidth - 2 * margin, 10, 'F');
    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(titleFontSize);
    doc.setTextColor(...brownColor);
    doc.text("CERTIFICADO DE CONHECIMENTO BÍBLICO-TEOLÓGICO", pageWidth / 2, 40, { align: "center" });
    // Linha decorativa
    doc.setDrawColor(...goldColor);
    doc.line(pageWidth / 2 - 40, 45, pageWidth / 2 + 40, 45);
    // Texto principal
    doc.setFont("times", "normal");
    doc.setFontSize(textFontSize);
    doc.setTextColor(50, 50, 50);
    const textLines = [
        `Certificamos que ${userName}`,
        `demonstrou conhecimento bíblico-teológico ao concluir o Bíblia Quiz,`,
        `alcançando 70% ou mais de acertos no questionário,`,
        `evidenciando dedicação ao estudo das Escrituras Sagradas e doutrinas cristãs.`,
        ``,
        `Este certificado reconhece seu empenho no aprofundamento do`,
        `conhecimento da Palavra de Deus, abrangendo temas do Antigo e Novo`,
        `Testamento, doutrinas, hermenêutica e aplicação prática.`
    ];
    textLines.forEach((line, i) => {
        doc.text(line, pageWidth / 2, 60 + i * lineHeight, { align: "center" });
    });
    // Assinatura (ajustada)
    const assinaturaY = 120; // linha base da assinatura
    doc.setFont("helvetica", "italic");
    doc.setFontSize(signatureFontSize);
    doc.setTextColor(...brownColor);
    doc.text("Evangelista Wellington A.R Cardoso", pageWidth / 2, assinaturaY, { align: "center" });
    // Subtítulo da assinatura com espaçamento extra
    doc.setFontSize(textFontSize - 2);
    doc.text("Autor e Criador do Bíblia Quiz", pageWidth / 2, assinaturaY + 8, { align: "center" });
    // Versículo bíblico
    doc.setFont("times", "italic");
    doc.setFontSize(textFontSize - 2);
    doc.setTextColor(100, 100, 100);
    doc.text(`"Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar,`, pageWidth / 2, 140, { align: "center" });
    doc.text(`que maneja bem a palavra da verdade."`, pageWidth / 2, 147, { align: "center" });
    doc.text(`2 Timóteo 2:15`, pageWidth / 2, 154, { align: "center" });
    // Data
    doc.setFontSize(textFontSize - 4);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificado gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, pageHeight - 20, { align: "center" });
    // Abre o PDF em uma nova aba
    const pdfData = doc.output('bloburl');
    window.open(pdfData, '_blank');
}

// Inicia o quiz
showQuestion();
