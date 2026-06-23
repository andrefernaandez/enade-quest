const state = {
  audio: {
    backgroundAudio: false,
  },
  score: {
    lifePoints: 10,
    winScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  // Estrutura do histórico com persistência via localStorage
  history: JSON.parse(localStorage.getItem("game_history")) || {
    "Data Science": { attempts: 0, corrects: 0 },
    "IT Infrastructure": { attempts: 0, corrects: 0 },
    "Software Development": { attempts: 0, corrects: 0 },
    "Information Technology": { attempts: 0, corrects: 0 }
  },
  currentCategory: "",
  currentCardId: null,
  answeredQuestions: [],
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
    quizContainer: document.getElementById("quiz-container"),
    questionText: document.getElementById("question-text"),
    questionImage: document.getElementById("question-image"),
    optionsBox: document.getElementById("options-box"),
    audioPlayerIcon: document.getElementById("audio-player"),
    startMenu: document.getElementById("start-menu"),
    modalInstructions: document.getElementById("modal-instructions"),
    modalHistory: document.getElementById("modal-history"),
    historyContent: document.getElementById("history-content")
  }
};

// Função para salvar alterações no histórico
function saveHistory() {
  localStorage.setItem("game_history", JSON.stringify(state.history));
}

// --- CONTROLE DE MENUS E TELAS ---

document.getElementById("btn-play").addEventListener("click", () => {
  state.actions.startMenu.style.display = "none";
  const gameContainer = document.querySelector(".container");
  if (gameContainer) {
    gameContainer.classList.remove("game-hidden");
  }
  
  const bgm = document.getElementById("bgm");
  if (!state.audio.backgroundAudio) {
    state.audio.backgroundAudio = true;
    state.actions.audioPlayerIcon.classList.add("active");
    state.actions.audioPlayerIcon.classList.remove("inactive");
    bgm.play().catch(() => {
      state.audio.backgroundAudio = false;
      state.actions.audioPlayerIcon.classList.add("inactive");
    });
  }
});

document.getElementById("btn-back-menu").addEventListener("click", () => {
  const gameContainer = document.querySelector(".container");
  if (gameContainer) {
    gameContainer.classList.add("game-hidden");
  }
  state.actions.startMenu.style.display = "flex";
  
  state.answeredQuestions = [];
  init();
});

document.getElementById("btn-instructions").addEventListener("click", () => {
  state.actions.modalInstructions.style.display = "block";
});
document.getElementById("btn-close-instructions").addEventListener("click", () => {
  state.actions.modalInstructions.style.display = "none";
});

document.getElementById("btn-history").addEventListener("click", () => {
  renderHistory();
  state.actions.modalHistory.style.display = "block";
});
document.getElementById("btn-close-history").addEventListener("click", () => {
  state.actions.modalHistory.style.display = "none";
});

// Botão Zerar Histórico
document.getElementById("btn-reset-history").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja apagar todo o seu histórico de desempenho?")) {
    state.history = {
        "Data Science": { attempts: 0, corrects: 0 },
        "IT Infrastructure": { attempts: 0, corrects: 0 },
        "Software Development": { attempts: 0, corrects: 0 },
        "Information Technology": { attempts: 0, corrects: 0 }
    };
    localStorage.removeItem("game_history");
    renderHistory();
  }
});

function renderHistory() {
  state.actions.historyContent.innerHTML = "";
  for (const area in state.history) {
    const data = state.history[area];
    const percentage = data.attempts === 0 ? 0 : Math.round((data.corrects / data.attempts) * 100);
    
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.innerHTML = `<span>${area}:</span> <span>${data.corrects}/${data.attempts} (${percentage}%)</span>`;
    state.actions.historyContent.appendChild(div);
  }
}

// --- LÓGICA DO ÁUDIO ---
state.actions.audioPlayerIcon.addEventListener("click", () => {
  const bgm = document.getElementById("bgm");
  state.audio.backgroundAudio = !state.audio.backgroundAudio;

  if (state.audio.backgroundAudio) {
    state.actions.audioPlayerIcon.classList.add("active");
    state.actions.audioPlayerIcon.classList.remove("inactive");
    bgm.play();
  } else {
    state.actions.audioPlayerIcon.classList.add("inactive");
    state.actions.audioPlayerIcon.classList.remove("active");
    bgm.pause();
  }
});

const pathImages = "./src/assets/icons/";
const pathEnade2014 = "./src/assets/enade2014/";
const pathEnade2017 = "./src/assets/enade2017/";
const pathEnade2021 = "./src/assets/enade2021/";

const defaultITImage = `${pathImages}information_technology.png`;

const cardData = [
  {
    id: 0,
    name: "Data Science",
    type: "Ciência de Dados",
    img: `${pathImages}data_science.png`, 
    questions: [
      { imgSrc: `${pathEnade2014}q1_data.jpg`, options: ["A", "B", "C", "D", "E"], correct: 0 },
      { imgSrc: `${pathEnade2014}q2_data.jpg`, options: ["A", "B", "C", "D", "E"], correct: 2 },
      { imgSrc: `${pathEnade2014}q3_data.jpg`, options: ["A", "B", "C", "D", "E"], correct: 4 },
      { imgSrc: `${pathEnade2014}q4_data.jpg`, options: ["A", "B", "C", "D", "E"], correct: 0 },
      { imgSrc: `${pathEnade2017}q1_data.jpg`, options: ["A", "B", "C", "D", "E"], correct: 3 }
    ]
  },
  {
    id: 1,
    name: "IT Infrastructure",
    type: "Infraestrutura de TI",
    img: `${pathImages}it_infrastructure.jpeg`, 
    questions: [
      { imgSrc: `${pathEnade2014}q1_it_infra.jpg`, options: ["A", "B", "C", "D", "E"], correct: 0 },
      { imgSrc: `${pathEnade2014}q2_it_infra.jpg`, options: ["A", "B", "C", "D", "E"], correct: 2 },
      { imgSrc: `${pathEnade2017}q1_it_infra.jpg`, options: ["A", "B", "C", "D", "E"], correct: 1 },
      { imgSrc: `${pathEnade2021}q1_it_infra.jpg`, options: ["A", "B", "C", "D", "E"], correct: 0 },
      { imgSrc: `${pathEnade2021}q2_it_infra.jpg`, options: ["A", "B", "C", "D", "E"], correct: 2 }
    ]
  },
  {
    id: 2,
    name: "Software Development",
    type: "Desenvolvimento de Software",
    img: `${pathImages}software_development.png`, 
    questions: [
      { imgSrc: `${pathEnade2014}q1_development.jpg`, options: ["A", "B", "C", "D", "E"], correct: 0 },
      { imgSrc: `${pathEnade2014}q2_development.jpg`, options: ["A", "B", "C", "D", "E"], correct: 1 },
      { imgSrc: `${pathEnade2017}q1_development.jpg`, options: ["A", "B", "C", "D", "E"], correct: 0 },
      { imgSrc: `${pathEnade2021}q1_development.jpg`, options: ["A", "B", "C", "D", "E"], correct: 2 },
      { imgSrc: `${pathEnade2021}q2_development.jpg`, options: ["A", "B", "C", "D", "E"], correct: 4 }
    ]
  },
  {
    id: 3,
    name: "Information Technology",
    type: "Geral",
    img: defaultITImage,
    questions: []
  }
];

function init() {
  state.fieldCards.player.parentElement.classList.remove("card-glow");
  state.fieldCards.computer.parentElement.classList.remove("card-glow");

  state.fieldCards.player.style.opacity = "1";
  state.fieldCards.computer.style.opacity = "1";

  state.fieldCards.player.style.display = "block";
  state.fieldCards.player.src = defaultITImage;
  
  state.fieldCards.computer.style.display = "block";
  state.fieldCards.computer.src = defaultITImage;
  
  state.actions.quizContainer.style.display = "none";

  updateScore();
  buildFixedTopBar(); 
  
  state.cardSprites.name.innerText = "Escolha uma Área";
  state.cardSprites.type.innerText = "Para Iniciar o Teste";
}

function buildFixedTopBar() {
  const container = document.querySelector("#computer-cards");
  container.innerHTML = ""; 

  const fixedSelection = [0, 1, 2, 3, 3];

  fixedSelection.forEach((id) => {
    const currentCard = cardData[id];
    const cardImage = document.createElement("img");
    
    cardImage.setAttribute("src", currentCard.img);
    cardImage.setAttribute("data-id", currentCard.id);
    cardImage.classList.add("card");
    
    cardImage.style.height = "90px";
    cardImage.style.width = "65px";
    cardImage.style.objectFit = "contain";
    cardImage.style.margin = "0 4px";
    cardImage.style.cursor = "pointer";

    cardImage.addEventListener("click", () => {
      if (currentCard.id === 3) {
        return;
      }
      setDuelField(currentCard.id);
    });

    cardImage.addEventListener("mouseover", () => {
        state.cardSprites.avatar.src = currentCard.img;
        state.cardSprites.name.innerText = currentCard.name;
        state.cardSprites.type.innerText = currentCard.type;
    });

    container.appendChild(cardImage);
  });
}

async function setDuelField(cardId) {
  const playerCard = cardData[cardId];
  
  state.currentCategory = playerCard.name;
  state.currentCardId = cardId; 
  
  document.querySelector("#computer-cards").innerHTML = "<p style='color:#e1b12c; font-size:9px;'>Questão Ativa!</p>";
  
  state.cardSprites.name.innerText = "Iniciando...";
  state.cardSprites.type.innerText = "Carregando Dados";

  const playerBox = state.fieldCards.player.parentElement;
  const computerBox = state.fieldCards.computer.parentElement;

  playerBox.classList.add("card-glow");
  computerBox.classList.add("card-glow");

  state.fieldCards.player.style.opacity = "0.2";

  setTimeout(() => {
    state.fieldCards.player.src = playerCard.img;
    state.fieldCards.player.style.opacity = "1";
    
    state.fieldCards.computer.src = defaultITImage;
    state.fieldCards.computer.style.opacity = "1";

    state.cardSprites.name.innerText = "CARTA ATIVADA!";
    state.cardSprites.type.innerText = playerCard.name;
    
    playerBox.classList.remove("card-glow");
    computerBox.classList.remove("card-glow");

    const availableQuestions = playerCard.questions.filter(
      q => !state.answeredQuestions.includes(q.imgSrc)
    );

    if (availableQuestions.length === 0) {
      state.actions.quizContainer.style.display = "block";
      state.actions.questionImage.src = ""; 
      state.actions.questionText.innerHTML = "<span style='color:#e1b12c;'>Excelente! Você dominou todas as questões desta área!</span>";
      state.actions.optionsBox.innerHTML = "";
      
      const btnBack = document.createElement("button");
      btnBack.innerText = "MUDAR DE ÁREA";
      btnBack.classList.add("rpgui-button");
      btnBack.onclick = () => resetDuel();
      state.actions.optionsBox.appendChild(btnBack);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    showQuiz(availableQuestions[randomIndex]);
  }, 1000); 
}

function showQuiz(questionData) {
  state.actions.quizContainer.style.display = "block";
  state.actions.questionImage.src = questionData.imgSrc; 
  state.actions.questionText.innerHTML = "Selecione a alternativa correta:";
  state.actions.optionsBox.innerHTML = "";
  state.actions.optionsBox.classList.remove("options-game-over");

  questionData.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("rpgui-button");
    button.onclick = () => handleAnswer(index, questionData.correct, questionData.imgSrc);
    state.actions.optionsBox.appendChild(button);
  });
}

function handleAnswer(choice, correct, questionImgSrc) {
  let message = "";
  let sound = "";
  let feedbackColor = "";

  if (state.history.hasOwnProperty(state.currentCategory)) {
    state.history[state.currentCategory].attempts++;
  }

  if (choice === correct) {
    state.score.winScore++; 
    state.score.lifePoints += 5;
    message = "RESPOSTA CORRETA!<br>+5 Pontos";
    sound = "win";
    feedbackColor = "#2ecc71";
    
    if (state.history.hasOwnProperty(state.currentCategory)) {
      state.history[state.currentCategory].corrects++;
    }

    state.answeredQuestions.push(questionImgSrc);
  } else {
    state.score.lifePoints -= 5;
    message = "RESPOSTA INCORRETA!<br>-5 Pontos";
    sound = "lose";
    feedbackColor = "#e74c3c";
  }

  saveHistory();
  playAudio(sound);
  updateScore();
  showFeedbackWindow(message, feedbackColor);
}

function showFeedbackWindow(text, color) {
  state.actions.optionsBox.classList.add("options-game-over");
  
  state.actions.questionText.innerHTML = `<span style='color:${color};'>${text}</span>`;
  state.actions.optionsBox.innerHTML = "";

  const actionWrapper = document.createElement("div");
  actionWrapper.style.display = "flex";
  actionWrapper.style.justifyContent = "center";
  actionWrapper.style.gap = "15px";
  actionWrapper.style.marginTop = "12px";

  const btnContinue = document.createElement("button");
  btnContinue.innerText = "CONTINUAR";
  btnContinue.classList.add("rpgui-button");
  btnContinue.onclick = () => {
    if (state.score.lifePoints <= 0) {
      checkGameState();
    } else {
      setDuelField(state.currentCardId);
    }
  };

  const btnChangeArea = document.createElement("button");
  btnChangeArea.innerText = "MUDAR DE ÁREA";
  btnChangeArea.classList.add("rpgui-button");
  btnChangeArea.style.setProperty("width", "220px", "important");
  btnChangeArea.style.padding = "10px";
  btnChangeArea.style.backgroundColor = "#4e4e4e";
  btnChangeArea.onclick = () => {
    if (state.score.lifePoints <= 0) {
      checkGameState();
    } else {
      state.actions.quizContainer.style.display = "none";
      resetDuel();
    }
  };

  actionWrapper.appendChild(btnContinue);
  actionWrapper.appendChild(btnChangeArea);
  state.actions.optionsBox.appendChild(actionWrapper);
}

function checkGameState() {
  if (state.score.lifePoints <= 0) {
    playAudio("lose"); 
    state.actions.questionText.innerHTML = "<span style='color:#e74c3c;'>GAME OVER!<br>Pontuação zerada.</span>";
    state.actions.optionsBox.innerHTML = "";

    const btnReset = document.createElement("button");
    btnReset.innerText = "RECOMEÇAR";
    btnReset.classList.add("rpgui-button");
    btnReset.onclick = () => window.location.reload();
    state.actions.optionsBox.appendChild(btnReset);
  }
}

function updateScore() {
  state.score.scoreBox.innerText = `Pontos: ${state.score.lifePoints} | Acertos: ${state.score.winScore}`;
}

function resetDuel() {
  state.actions.button.style.display = "none";
  init();
}

function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

init();