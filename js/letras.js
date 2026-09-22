const STORAGE = {
  stars: "mundoArthurStars",
  sound: "mundoArthurSound",
  progress: "mundoArthurProgress"
};


/* =========================================================
   BANCO DE PALAVRAS
========================================================= */

const WORDS = [

  {
    word: "ABELHA",
    display: "Abelha",
    icon: "🐝",
    letter: "A"
  },

  {
    word: "BOLA",
    display: "Bola",
    icon: "⚽",
    letter: "B"
  },

  {
    word: "CACHORRO",
    display: "Cachorro",
    icon: "🐶",
    letter: "C"
  },

  {
    word: "DADO",
    display: "Dado",
    icon: "🎲",
    letter: "D"
  },

  {
    word: "ELEFANTE",
    display: "Elefante",
    icon: "🐘",
    letter: "E"
  },

  {
    word: "FLOR",
    display: "Flor",
    icon: "🌻",
    letter: "F"
  },

  {
    word: "GATO",
    display: "Gato",
    icon: "🐱",
    letter: "G"
  },

  {
    word: "HELICÓPTERO",
    display: "Helicóptero",
    icon: "🚁",
    letter: "H"
  },

  {
    word: "IGREJA",
    display: "Igreja",
    icon: "⛪",
    letter: "I"
  },

  {
    word: "JACARÉ",
    display: "Jacaré",
    icon: "🐊",
    letter: "J"
  },

  {
    word: "LEÃO",
    display: "Leão",
    icon: "🦁",
    letter: "L"
  },

  {
    word: "MACACO",
    display: "Macaco",
    icon: "🐵",
    letter: "M"
  },

  {
    word: "NAVIO",
    display: "Navio",
    icon: "🚢",
    letter: "N"
  },

  {
    word: "OVELHA",
    display: "Ovelha",
    icon: "🐑",
    letter: "O"
  },

  {
    word: "PATO",
    display: "Pato",
    icon: "🦆",
    letter: "P"
  },

  {
    word: "QUEIJO",
    display: "Queijo",
    icon: "🧀",
    letter: "Q"
  },

  {
    word: "RATO",
    display: "Rato",
    icon: "🐭",
    letter: "R"
  },

  {
    word: "SAPO",
    display: "Sapo",
    icon: "🐸",
    letter: "S"
  },

  {
    word: "TARTARUGA",
    display: "Tartaruga",
    icon: "🐢",
    letter: "T"
  },

  {
    word: "UVA",
    display: "Uva",
    icon: "🍇",
    letter: "U"
  },

  {
    word: "VACA",
    display: "Vaca",
    icon: "🐄",
    letter: "V"
  },

  {
    word: "XÍCARA",
    display: "Xícara",
    icon: "☕",
    letter: "X"
  },

  {
    word: "ZEBRA",
    display: "Zebra",
    icon: "🦓",
    letter: "Z"
  }

];


/* =========================================================
   ELEMENTOS
========================================================= */

const backButton =
  document.getElementById("backButton");

const soundButton =
  document.getElementById("soundButton");

const starCount =
  document.getElementById("starCount");

const roundText =
  document.getElementById("roundText");

const scoreText =
  document.getElementById("scoreText");

const progressBar =
  document.getElementById("progressBar");

const objectPicture =
  document.getElementById("objectPicture");

const objectName =
  document.getElementById("objectName");

const questionText =
  document.getElementById("questionText");

const listenButton =
  document.getElementById("listenButton");

const answers =
  document.getElementById("answers");

const feedback =
  document.getElementById("feedback");

const nextButton =
  document.getElementById("nextButton");

const mascotImage =
  document.getElementById("mascotImage");

const mascotSpeech =
  document.getElementById("mascotSpeech");

const resultModal =
  document.getElementById("resultModal");

const finalScore =
  document.getElementById("finalScore");

const rewardStars =
  document.getElementById("rewardStars");

const resultMessage =
  document.getElementById("resultMessage");

const resultMascot =
  document.getElementById("resultMascot");

const playAgainButton =
  document.getElementById("playAgainButton");

const homeButton =
  document.getElementById("homeButton");


/* =========================================================
   ESTADO
========================================================= */

const TOTAL_ROUNDS = 10;

let round = 0;

let score = 0;

let answered = false;

let questions = [];

let currentQuestion = null;

let soundEnabled =
  localStorage.getItem(STORAGE.sound) !== "off";

let preferredVoice = null;


/* =========================================================
   UTILIDADES
========================================================= */

function shuffle(array){

  return [...array]
    .sort(
      () => Math.random() - .5
    );

}


function getStars(){

  return Number(
    localStorage.getItem(
      STORAGE.stars
    ) || 0
  );

}


function updateStars(){

  starCount.textContent =
    getStars();

}


/* =========================================================
   VOZ INFANTIL
========================================================= */

function normalizeText(text){

  return text
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase();

}


function chooseVoice(){

  if(
    !("speechSynthesis" in window)
  ){
    return;
  }


  const voices =
    speechSynthesis.getVoices();


  if(
    !voices.length
  ){
    return;
  }


  const ptBR =
    voices.filter(
      voice =>
        String(voice.lang)
          .toLowerCase()
          .startsWith("pt-br")
    );


  const portuguese =
    voices.filter(
      voice =>
        String(voice.lang)
          .toLowerCase()
          .startsWith("pt")
    );


  const candidates =
    ptBR.length
      ? ptBR
      : portuguese;


  if(
    !candidates.length
  ){

    preferredVoice =
      voices[0];

    return;

  }


  const preferredNames = [
    "francisca",
    "maria",
    "luciana",
    "fernanda",
    "camila",
    "vitoria",
    "vitória",
    "female",
    "feminina",
    "google português do brasil",
    "microsoft francisca"
  ];


  preferredVoice =
    candidates.find(
      voice => {

        const name =
          normalizeText(
            voice.name
          );


        return preferredNames
          .some(
            preferred =>
              name.includes(
                normalizeText(
                  preferred
                )
              )
          );

      }
    )
    ||
    candidates[0];

}


function speak(
  text,
  options = {}
){

  if(
    !soundEnabled ||
    !("speechSynthesis" in window)
  ){
    return;
  }


  speechSynthesis.cancel();


  chooseVoice();


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "pt-BR";


  if(
    preferredVoice
  ){

    utterance.voice =
      preferredVoice;

  }


  /*
    Combinação pensada para ficar:
    - clara;
    - um pouco mais lenta;
    - alegre;
    - levemente infantil.
  */

  utterance.rate =
    options.rate ?? .88;

  utterance.pitch =
    options.pitch ?? 1.25;

  utterance.volume =
    options.volume ?? 1;


  speechSynthesis.speak(
    utterance
  );

}


if(
  "speechSynthesis" in window
){

  speechSynthesis.onvoiceschanged =
    chooseVoice;


  chooseVoice();

}


/* =========================================================
   FRASES
========================================================= */

function speakQuestion(){

  if(
    !currentQuestion
  ){
    return;
  }


  speak(
    `${currentQuestion.display}. 
    ${currentQuestion.display} começa com qual letra?`
  );

}


function speakCorrect(){

  speak(
    `Muito bem, Arthur! 
    ${currentQuestion.display} começa com a letra ${currentQuestion.letter}!`,
    {
      rate:.9,
      pitch:1.28
    }
  );

}


function speakWrong(){

  speak(
    `Quase, Arthur! 
    ${currentQuestion.display} começa com a letra ${currentQuestion.letter}. 
    Vamos tentar a próxima!`,
    {
      rate:.86,
      pitch:1.22
    }
  );

}


/* =========================================================
   ALTERNATIVAS
========================================================= */

function createOptions(question){

  const allLetters =
    WORDS
      .map(
        item => item.letter
      )
      .filter(
        (letter,index,array) =>
          array.indexOf(letter) ===
          index
      );


  const wrong =
    shuffle(
      allLetters.filter(
        letter =>
          letter !==
          question.letter
      )
    )
    .slice(0,3);


  return shuffle(
    [
      question.letter,
      ...wrong
    ]
  );

}


/* =========================================================
   INICIAR JOGO
========================================================= */

function startGame(){

  round = 0;

  score = 0;

  answered = false;


  questions =
    shuffle(WORDS)
      .slice(
        0,
        TOTAL_ROUNDS
      );


  resultModal
    .classList
    .remove("show");


  resultModal
    .setAttribute(
      "aria-hidden",
      "true"
    );


  mascotImage.src =
    "assets/mascote/girafinha_ensinando.png";


  loadQuestion();

}


/* =========================================================
   MOSTRAR PERGUNTA
========================================================= */

function loadQuestion(){

  answered = false;


  feedback.textContent =
    "";

  feedback.className =
    "feedback";


  nextButton.classList.add(
    "hidden"
  );


  currentQuestion =
    questions[round];


  roundText.textContent =
    `Pergunta ${round + 1} de ${TOTAL_ROUNDS}`;


  scoreText.textContent =
    `${score} ${
      score === 1
        ? "acerto"
        : "acertos"
    }`;


  progressBar.style.width =
    `${
      ((round + 1) /
      TOTAL_ROUNDS) *
      100
    }%`;


  objectPicture.textContent =
    currentQuestion.icon;


  /*
    Reinicia a animação
  */

  objectPicture.style.animation =
    "none";


  requestAnimationFrame(
    () => {

      objectPicture.style.animation =
        "";

    }
  );


  objectName.textContent =
    currentQuestion.word;


  questionText.textContent =
    `${currentQuestion.display} começa com qual letra?`;


  mascotSpeech.textContent =
    `Olhe a figura e fale: ${currentQuestion.display}!`;


  const options =
    createOptions(
      currentQuestion
    );


  answers.innerHTML =
    options
      .map(
        letter => `
        <button
        class="answer-button"
        data-letter="${letter}"
        >
        ${letter}
        </button>
        `
      )
      .join("");


  document
    .querySelectorAll(
      ".answer-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () =>
            answerQuestion(
              button
            )
        );

      }
    );


  setTimeout(
    speakQuestion,
    350
  );

}


/* =========================================================
   RESPONDER
========================================================= */

function answerQuestion(
  selectedButton
){

  if(
    answered
  ){
    return;
  }


  answered = true;


  const selected =
    selectedButton.dataset.letter;


  const buttons =
    document.querySelectorAll(
      ".answer-button"
    );


  buttons.forEach(
    button => {

      button.disabled =
        true;


      if(
        button.dataset.letter ===
        currentQuestion.letter
      ){

        button.classList.add(
          "correct"
        );

      }

    }
  );


  if(
    selected ===
    currentQuestion.letter
  ){

    score++;


    feedback.textContent =
      `🌟 Muito bem! ${currentQuestion.display} começa com ${currentQuestion.letter}!`;


    feedback.className =
      "feedback correct";


    mascotSpeech.textContent =
      "Você acertou! Muito bem! ⭐";


    mascotImage.src =
      "assets/mascote/girafinha_feliz.png";


    speakCorrect();

  }
  else{

    selectedButton
      .classList
      .add(
        "wrong"
      );


    feedback.textContent =
      `💜 Quase! ${currentQuestion.display} começa com ${currentQuestion.letter}.`;


    feedback.className =
      "feedback wrong";


    mascotSpeech.textContent =
      "Quase! Vamos aprender juntos!";


    mascotImage.src =
      "assets/mascote/girafinha_pensativa.png";


    speakWrong();

  }


  scoreText.textContent =
    `${score} ${
      score === 1
        ? "acerto"
        : "acertos"
    }`;


  nextButton.textContent =
    round ===
    TOTAL_ROUNDS - 1
      ? "Ver resultado ⭐"
      : "Próxima pergunta →";


  nextButton.classList.remove(
    "hidden"
  );

}


/* =========================================================
   PRÓXIMA
========================================================= */

function nextQuestion(){

  if(
    !answered
  ){
    return;
  }


  if(
    round <
    TOTAL_ROUNDS - 1
  ){

    round++;


    mascotImage.src =
      "assets/mascote/girafinha_ensinando.png";


    loadQuestion();

  }
  else{

    finishGame();

  }

}


/* =========================================================
   RECOMPENSA
========================================================= */

function calculateReward(){

  if(
    score === 10
  ){
    return 8;
  }


  if(
    score >= 8
  ){
    return 5;
  }


  if(
    score >= 5
  ){
    return 3;
  }


  return 1;

}


/* =========================================================
   SALVAR PROGRESSO
========================================================= */

function saveProgress(
  reward
){

  const stars =
    getStars() +
    reward;


  localStorage.setItem(
    STORAGE.stars,
    String(stars)
  );


  let progress = {};


  try{

    progress =
      JSON.parse(
        localStorage.getItem(
          STORAGE.progress
        ) || "{}"
      );

  }
  catch{

    progress = {};

  }


  progress.games =
    Number(
      progress.games || 0
    ) + 1;


  progress.lettersGames =
    Number(
      progress.lettersGames || 0
    ) + 1;


  progress.lettersCorrect =
    Number(
      progress.lettersCorrect || 0
    ) + score;


  if(
    score ===
    TOTAL_ROUNDS
  ){

    progress.lettersPerfect =
      Number(
        progress.lettersPerfect || 0
      ) + 1;


    progress.wins =
      Number(
        progress.wins || 0
      ) + 1;

  }


  localStorage.setItem(
    STORAGE.progress,
    JSON.stringify(
      progress
    )
  );


  updateStars();

}


/* =========================================================
   FINAL
========================================================= */

function finishGame(){

  const reward =
    calculateReward();


  saveProgress(
    reward
  );


  finalScore.textContent =
    score;


  rewardStars.textContent =
    reward;


  if(
    score === 10
  ){

    resultMessage.textContent =
      "Perfeito! Você descobriu todas as letras iniciais!";


    resultMascot.src =
      "assets/mascote/girafinha_conquista.png";


    speak(
      `Parabéns, Arthur! Você acertou todas! Você é incrível!`,
      {
        rate:.88,
        pitch:1.28
      }
    );

  }
  else if(
    score >= 8
  ){

    resultMessage.textContent =
      "Uau! Você conhece muitas letras!";


    resultMascot.src =
      "assets/mascote/girafinha_comemorando.png";


    speak(
      `Muito bem, Arthur! Você conhece muitas letras!`,
      {
        rate:.88,
        pitch:1.27
      }
    );

  }
  else if(
    score >= 5
  ){

    resultMessage.textContent =
      "Muito bem! Continue brincando e aprendendo!";


    resultMascot.src =
      "assets/mascote/girafinha_feliz.png";


    speak(
      `Muito bem, Arthur! Continue brincando e aprendendo!`
    );

  }
  else{

    resultMessage.textContent =
      "Você está aprendendo! Vamos brincar mais uma vez?";


    resultMascot.src =
      "assets/mascote/girafinha_recebendo.png";


    speak(
      `Você está aprendendo, Arthur! Vamos brincar mais uma vez?`
    );

  }


  resultModal
    .classList
    .add(
      "show"
    );


  resultModal
    .setAttribute(
      "aria-hidden",
      "false"
    );

}


/* =========================================================
   EVENTOS
========================================================= */

nextButton.addEventListener(
  "click",
  nextQuestion
);


listenButton.addEventListener(
  "click",
  speakQuestion
);


backButton.addEventListener(
  "click",
  () => {

    speechSynthesis?.cancel();

    window.location.href =
      "index.html";

  }
);


homeButton.addEventListener(
  "click",
  () => {

    speechSynthesis?.cancel();

    window.location.href =
      "index.html";

  }
);


playAgainButton.addEventListener(
  "click",
  startGame
);


soundButton.addEventListener(
  "click",
  () => {

    soundEnabled =
      !soundEnabled;


    localStorage.setItem(
      STORAGE.sound,
      soundEnabled
        ? "on"
        : "off"
    );


    soundButton.textContent =
      soundEnabled
        ? "🔊"
        : "🔇";


    if(
      !soundEnabled
    ){

      speechSynthesis?.cancel();

    }
    else{

      speak(
        "Oba! Agora eu posso falar com você!"
      );

    }

  }
);


/* =========================================================
   INICIAR
========================================================= */

soundButton.textContent =
  soundEnabled
    ? "🔊"
    : "🔇";


updateStars();

startGame();