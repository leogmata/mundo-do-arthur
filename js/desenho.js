const STORAGE = {
  stars: "mundoArthurStars",
  sound: "mundoArthurSound",
  progress: "mundoArthurProgress"
};


/* =========================================================
   CORES
========================================================= */

const COLORS = [

  "#000000",
  "#FFFFFF",
  "#808080",
  "#8B4513",
  "#F4C7A1",

  "#FF3B30",
  "#FF9500",
  "#FFD60A",
  "#FF69B4",
  "#FF2D87",

  "#AF52DE",
  "#7C4DFF",
  "#5856D6",
  "#007AFF",
  "#5AC8FA",

  "#00C7BE",
  "#34C759",
  "#8BC34A",
  "#006B3C",
  "#AEEA00"

];


/* =========================================================
   MISSÕES
========================================================= */

const MISSIONS = [

  "Desenhe algo que deixa você feliz!",

  "Desenhe sua família!",

  "Desenhe um animal bem divertido!",

  "Desenhe uma casa colorida!",

  "Desenhe um dia de sol!",

  "Desenhe um foguete viajando pelo espaço!",

  "Desenhe a Girafinha em uma aventura!",

  "Desenhe um jardim cheio de flores!",

  "Desenhe seu brinquedo favorito!",

  "Desenhe um monstro engraçado!",

  "Desenhe um carro bem diferente!",

  "Desenhe um castelo mágico!",

  "Desenhe o fundo do mar!",

  "Desenhe uma floresta cheia de animais!"

];


/* =========================================================
   ELEMENTOS
========================================================= */

const canvas =
  document.getElementById(
    "drawingCanvas"
  );

const ctx =
  canvas.getContext(
    "2d",
    {
      willReadFrequently:true
    }
  );

const canvasContainer =
  document.getElementById(
    "canvasContainer"
  );

const colorPalette =
  document.getElementById(
    "colorPalette"
  );

const sizeGroup =
  document.getElementById(
    "sizeGroup"
  );

const toolStatusIcon =
  document.getElementById(
    "toolStatusIcon"
  );

const toolStatusText =
  document.getElementById(
    "toolStatusText"
  );

const mascotImage =
  document.getElementById(
    "mascotImage"
  );

const mascotSpeech =
  document.getElementById(
    "mascotSpeech"
  );

const missionText =
  document.getElementById(
    "missionText"
  );

const starCount =
  document.getElementById(
    "starCount"
  );

const soundButton =
  document.getElementById(
    "soundButton"
  );

const finishModal =
  document.getElementById(
    "finishModal"
  );

const clearModal =
  document.getElementById(
    "clearModal"
  );

const toast =
  document.getElementById(
    "toast"
  );


/* =========================================================
   ESTADO
========================================================= */

let currentTool =
  "brush";

let currentColor =
  COLORS[0];

let brushSize =
  12;

let drawing =
  false;

let lastX =
  0;

let lastY =
  0;

let history =
  [];

let historyLimit =
  25;

let finishedCurrentDrawing =
  false;

let soundEnabled =
  localStorage.getItem(
    STORAGE.sound
  ) !== "off";

let preferredVoice =
  null;


/* =========================================================
   VOZ
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
    speechSynthesis
      .getVoices();


  if(
    !voices.length
  ){
    return;
  }


  const ptBR =
    voices.filter(
      voice =>
        String(
          voice.lang
        )
        .toLowerCase()
        .startsWith(
          "pt-br"
        )
    );


  const pt =
    voices.filter(
      voice =>
        String(
          voice.lang
        )
        .toLowerCase()
        .startsWith(
          "pt"
        )
    );


  const candidates =
    ptBR.length
      ? ptBR
      : pt;


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


function speak(text){

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


  utterance.rate =
    .88;

  utterance.pitch =
    1.25;

  utterance.volume =
    1;


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
   ESTRELAS
========================================================= */

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
   TOAST
========================================================= */

function showToast(message){

  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    showToast.timer
  );


  showToast.timer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      1800
    );

}


/* =========================================================
   CANVAS
========================================================= */

function resizeCanvas(){

  /*
    Preserva o desenho durante resize.
  */

  let backup = null;


  if(
    canvas.width > 0 &&
    canvas.height > 0
  ){

    backup =
      document.createElement(
        "canvas"
      );


    backup.width =
      canvas.width;


    backup.height =
      canvas.height;


    backup
      .getContext("2d")
      .drawImage(
        canvas,
        0,
        0
      );

  }


  const rect =
    canvasContainer
      .getBoundingClientRect();


  const ratio =
    window.devicePixelRatio ||
    1;


  canvas.width =
    Math.floor(
      rect.width *
      ratio
    );


  canvas.height =
    Math.floor(
      rect.height *
      ratio
    );


  canvas.style.width =
    `${rect.width}px`;


  canvas.style.height =
    `${rect.height}px`;


  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  ctx.lineCap =
    "round";


  ctx.lineJoin =
    "round";


  ctx.fillStyle =
    "#FFFFFF";


  ctx.fillRect(
    0,
    0,
    rect.width,
    rect.height
  );


  if(
    backup
  ){

    ctx.drawImage(
      backup,
      0,
      0,
      backup.width,
      backup.height,
      0,
      0,
      rect.width,
      rect.height
    );

  }

}


/* =========================================================
   HISTÓRICO
========================================================= */

function saveState(){

  try{

    const image =
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );


    history.push(
      image
    );


    if(
      history.length >
      historyLimit
    ){

      history.shift();

    }

  }
  catch(error){

    console.warn(
      "Não foi possível salvar o estado do desenho.",
      error
    );

  }

}


function undo(){

  if(
    history.length <= 1
  ){

    showToast(
      "Não há mais nada para desfazer."
    );


    return;

  }


  history.pop();


  const previous =
    history[
      history.length - 1
    ];


  ctx.putImageData(
    previous,
    0,
    0
  );


  showToast(
    "Última ação desfeita ↶"
  );

}


/* =========================================================
   POSIÇÃO
========================================================= */

function getPointerPosition(
  event
){

  const rect =
    canvas
      .getBoundingClientRect();


  const clientX =
    event.clientX;


  const clientY =
    event.clientY;


  return{

    x:
      (
        clientX -
        rect.left
      )
      *
      (
        canvas.width /
        rect.width
      ),

    y:
      (
        clientY -
        rect.top
      )
      *
      (
        canvas.height /
        rect.height
      )

  };

}


/* =========================================================
   DESENHAR
========================================================= */

function startDrawing(event){

  event.preventDefault();


  const point =
    getPointerPosition(
      event
    );


  /*
    BALDE
  */

  if(
    currentTool ===
    "bucket"
  ){

    saveState();


    floodFill(
      Math.floor(
        point.x
      ),
      Math.floor(
        point.y
      ),
      currentColor
    );


    saveState();


    mascotSpeech.textContent =
      "Uau! Que cor bonita!";


    return;

  }


  drawing =
    true;


  lastX =
    point.x;

  lastY =
    point.y;


  saveState();


  /*
    Faz um ponto mesmo sem mover.
  */

  drawPoint(
    point.x,
    point.y
  );

}


function draw(event){

  if(
    !drawing
  ){
    return;
  }


  event.preventDefault();


  const point =
    getPointerPosition(
      event
    );


  ctx.beginPath();


  ctx.moveTo(
    lastX,
    lastY
  );


  ctx.lineTo(
    point.x,
    point.y
  );


  ctx.lineWidth =
    brushSize *
    (
      window.devicePixelRatio ||
      1
    );


  if(
    currentTool ===
    "eraser"
  ){

    ctx.strokeStyle =
      "#FFFFFF";

  }
  else{

    ctx.strokeStyle =
      currentColor;

  }


  ctx.lineCap =
    "round";


  ctx.lineJoin =
    "round";


  ctx.stroke();


  lastX =
    point.x;

  lastY =
    point.y;

}


function drawPoint(
  x,
  y
){

  ctx.beginPath();


  ctx.arc(
    x,
    y,
    (
      brushSize *
      (
        window.devicePixelRatio ||
        1
      )
    ) / 2,
    0,
    Math.PI * 2
  );


  ctx.fillStyle =
    currentTool ===
    "eraser"
      ? "#FFFFFF"
      : currentColor;


  ctx.fill();

}


function stopDrawing(){

  if(
    !drawing
  ){
    return;
  }


  drawing =
    false;


  saveState();

}


/* =========================================================
   BALDE DE TINTA
========================================================= */

function hexToRgb(hex){

  let clean =
    hex.replace(
      "#",
      ""
    );


  if(
    clean.length === 3
  ){

    clean =
      clean
        .split("")
        .map(
          c => c + c
        )
        .join("");

  }


  return{

    r:
      parseInt(
        clean.substring(
          0,
          2
        ),
        16
      ),

    g:
      parseInt(
        clean.substring(
          2,
          4
        ),
        16
      ),

    b:
      parseInt(
        clean.substring(
          4,
          6
        ),
        16
      ),

    a:255

  };

}


function colorDistance(
  data,
  index,
  color
){

  return(
    Math.abs(
      data[index] -
      color.r
    )
    +
    Math.abs(
      data[index + 1] -
      color.g
    )
    +
    Math.abs(
      data[index + 2] -
      color.b
    )
    +
    Math.abs(
      data[index + 3] -
      color.a
    )
  );

}


function floodFill(
  startX,
  startY,
  fillHex
){

  const width =
    canvas.width;


  const height =
    canvas.height;


  if(
    startX < 0 ||
    startX >= width ||
    startY < 0 ||
    startY >= height
  ){
    return;
  }


  const imageData =
    ctx.getImageData(
      0,
      0,
      width,
      height
    );


  const data =
    imageData.data;


  const startIndex =
    (
      startY *
      width +
      startX
    ) * 4;


  const targetColor = {

    r:
      data[
        startIndex
      ],

    g:
      data[
        startIndex + 1
      ],

    b:
      data[
        startIndex + 2
      ],

    a:
      data[
        startIndex + 3
      ]

  };


  const fillColor =
    hexToRgb(
      fillHex
    );


  /*
    Se já for praticamente
    a mesma cor, não faz nada.
  */

  if(
    Math.abs(
      targetColor.r -
      fillColor.r
    ) < 4
    &&
    Math.abs(
      targetColor.g -
      fillColor.g
    ) < 4
    &&
    Math.abs(
      targetColor.b -
      fillColor.b
    ) < 4
  ){

    return;

  }


  /*
    Pequena tolerância ajuda
    em regiões com antialiasing.
  */

  const tolerance =
    55;


  const visited =
    new Uint8Array(
      width *
      height
    );


  const stackX =
    new Int32Array(
      width *
      height
    );


  const stackY =
    new Int32Array(
      width *
      height
    );


  let stackSize =
    0;


  stackX[
    stackSize
  ] =
    startX;


  stackY[
    stackSize
  ] =
    startY;


  stackSize++;


  while(
    stackSize > 0
  ){

    stackSize--;


    const x =
      stackX[
        stackSize
      ];


    const y =
      stackY[
        stackSize
      ];


    if(
      x < 0 ||
      x >= width ||
      y < 0 ||
      y >= height
    ){
      continue;
    }


    const pixelPosition =
      y *
      width +
      x;


    if(
      visited[
        pixelPosition
      ]
    ){
      continue;
    }


    visited[
      pixelPosition
    ] =
      1;


    const index =
      pixelPosition * 4;


    if(
      colorDistance(
        data,
        index,
        targetColor
      ) >
      tolerance
    ){

      continue;

    }


    data[
      index
    ] =
      fillColor.r;


    data[
      index + 1
    ] =
      fillColor.g;


    data[
      index + 2
    ] =
      fillColor.b;


    data[
      index + 3
    ] =
      255;


    if(
      stackSize <
      stackX.length - 4
    ){

      stackX[
        stackSize
      ] =
        x + 1;

      stackY[
        stackSize
      ] =
        y;

      stackSize++;


      stackX[
        stackSize
      ] =
        x - 1;

      stackY[
        stackSize
      ] =
        y;

      stackSize++;


      stackX[
        stackSize
      ] =
        x;

      stackY[
        stackSize
      ] =
        y + 1;

      stackSize++;


      stackX[
        stackSize
      ] =
        x;

      stackY[
        stackSize
      ] =
        y - 1;

      stackSize++;

    }

  }


  ctx.putImageData(
    imageData,
    0,
    0
  );

}


/* =========================================================
   PALETA
========================================================= */

function renderColors(){

  colorPalette.innerHTML =
    COLORS
      .map(
        (color,index) => `
        <button
        class="
          color-button
          ${
            index === 0
              ? "active"
              : ""
          }
        "
        data-color="${color}"
        style="background:${color}"
        title="${color}"
        aria-label="Escolher cor ${color}"
        ></button>
        `
      )
      .join("");


  document
    .querySelectorAll(
      ".color-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            currentColor =
              button.dataset.color;


            document
              .querySelectorAll(
                ".color-button"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );


            button
              .classList
              .add(
                "active"
              );


            if(
              currentTool ===
              "eraser"
            ){

              setTool(
                "brush"
              );

            }


            mascotSpeech.textContent =
              "Essa cor ficou linda!";

          }
        );

      }
    );

}


/* =========================================================
   FERRAMENTAS
========================================================= */

function setTool(tool){

  currentTool =
    tool;


  document
    .querySelectorAll(
      ".tool-button"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.tool ===
          tool
        );

      }
    );


  if(
    tool ===
    "brush"
  ){

    toolStatusIcon.textContent =
      "🖌️";


    toolStatusText.textContent =
      "Pincel selecionado";


    sizeGroup.style.opacity =
      "1";


    mascotSpeech.textContent =
      "Vamos desenhar!";

  }


  if(
    tool ===
    "bucket"
  ){

    toolStatusIcon.textContent =
      "🪣";


    toolStatusText.textContent =
      "Balde de tinta selecionado";


    sizeGroup.style.opacity =
      ".5";


    mascotSpeech.textContent =
      "Clique dentro de uma área para pintar!";


    speak(
      "Escolha uma cor e clique dentro de uma área fechada para pintar."
    );

  }


  if(
    tool ===
    "eraser"
  ){

    toolStatusIcon.textContent =
      "🧽";


    toolStatusText.textContent =
      "Borracha selecionada";


    sizeGroup.style.opacity =
      "1";


    mascotSpeech.textContent =
      "Tudo bem! Podemos apagar e tentar de novo.";

  }

}


/* =========================================================
   TAMANHO
========================================================= */

function setBrushSize(size){

  brushSize =
    Number(size);


  document
    .querySelectorAll(
      ".size-button"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          Number(
            button.dataset.size
          ) ===
          brushSize
        );

      }
    );

}


/* =========================================================
   LIMPAR
========================================================= */

function clearCanvas(){

  ctx.save();


  ctx.setTransform(
    1,
    0,
    0,
    1,
    0,
    0
  );


  ctx.fillStyle =
    "#FFFFFF";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.restore();


  history = [];


  saveState();


  finishedCurrentDrawing =
    false;


  mascotSpeech.textContent =
    "Uma folha novinha para criar!";

}


/* =========================================================
   SALVAR PNG
========================================================= */

function saveDrawing(){

  const link =
    document.createElement(
      "a"
    );


  const date =
    new Date();


  const dateText =
    [
      date.getFullYear(),
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )
    ].join("-");


  link.download =
    `desenho-do-arthur-${dateText}.png`;


  link.href =
    canvas.toDataURL(
      "image/png"
    );


  link.click();


  showToast(
    "Desenho salvo! 🎨"
  );


  speak(
    "Seu desenho foi salvo. Ficou lindo!"
  );

}


/* =========================================================
   MISSÕES
========================================================= */

function newMission(){

  const current =
    missionText.textContent;


  let options =
    MISSIONS.filter(
      mission =>
        mission !==
        current
    );


  const mission =
    options[
      Math.floor(
        Math.random() *
        options.length
      )
    ];


  missionText.textContent =
    mission;


  mascotSpeech.textContent =
    "Tenho uma nova ideia para você!";


  speak(
    mission
  );

}


/* =========================================================
   CONCLUIR
========================================================= */

function finishDrawing(){

  if(
    finishedCurrentDrawing
  ){

    finishModal
      .classList
      .add(
        "show"
      );


    return;

  }


  finishedCurrentDrawing =
    true;


  const reward =
    3;


  localStorage.setItem(
    STORAGE.stars,
    String(
      getStars() +
      reward
    )
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


  progress.drawings =
    Number(
      progress.drawings || 0
    ) + 1;


  localStorage.setItem(
    STORAGE.progress,
    JSON.stringify(
      progress
    )
  );


  updateStars();


  finishModal
    .classList
    .add(
      "show"
    );


  finishModal
    .setAttribute(
      "aria-hidden",
      "false"
    );


  speak(
    "Uau, Arthur! Que desenho incrível! Você ganhou três estrelas!"
  );

}


/* =========================================================
   NOVO DESENHO
========================================================= */

function startNewDrawing(){

  finishModal
    .classList
    .remove(
      "show"
    );


  finishModal
    .setAttribute(
      "aria-hidden",
      "true"
    );


  clearCanvas();


  newMission();


  setTool(
    "brush"
  );

}


/* =========================================================
   EVENTOS CANVAS
========================================================= */

canvas.addEventListener(
  "pointerdown",
  startDrawing
);


canvas.addEventListener(
  "pointermove",
  draw
);


canvas.addEventListener(
  "pointerup",
  stopDrawing
);


canvas.addEventListener(
  "pointerleave",
  stopDrawing
);


canvas.addEventListener(
  "pointercancel",
  stopDrawing
);


/* =========================================================
   EVENTOS DAS FERRAMENTAS
========================================================= */

document
  .querySelectorAll(
    ".tool-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          setTool(
            button.dataset.tool
          );

        }
      );

    }
  );


document
  .querySelectorAll(
    ".size-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          setBrushSize(
            button.dataset.size
          );

        }
      );

    }
  );


/* =========================================================
   BOTÕES
========================================================= */

document
  .getElementById(
    "undoButton"
  )
  .addEventListener(
    "click",
    undo
  );


document
  .getElementById(
    "clearButton"
  )
  .addEventListener(
    "click",
    () => {

      clearModal
        .classList
        .add(
          "show"
        );


      clearModal
        .setAttribute(
          "aria-hidden",
          "false"
        );

    }
  );


document
  .getElementById(
    "cancelClearButton"
  )
  .addEventListener(
    "click",
    () => {

      clearModal
        .classList
        .remove(
          "show"
        );

    }
  );


document
  .getElementById(
    "confirmClearButton"
  )
  .addEventListener(
    "click",
    () => {

      clearModal
        .classList
        .remove(
          "show"
        );


      clearCanvas();


      showToast(
        "Folha limpa! ✨"
      );

    }
  );


document
  .getElementById(
    "saveButton"
  )
  .addEventListener(
    "click",
    saveDrawing
  );


document
  .getElementById(
    "finishButton"
  )
  .addEventListener(
    "click",
    finishDrawing
  );


document
  .getElementById(
    "newMissionButton"
  )
  .addEventListener(
    "click",
    newMission
  );


document
  .getElementById(
    "drawAgainButton"
  )
  .addEventListener(
    "click",
    startNewDrawing
  );


document
  .getElementById(
    "finishHomeButton"
  )
  .addEventListener(
    "click",
    () => {

      speechSynthesis?.cancel();

      window.location.href =
        "index.html";

    }
  );


document
  .getElementById(
    "backButton"
  )
  .addEventListener(
    "click",
    () => {

      speechSynthesis?.cancel();

      window.location.href =
        "index.html";

    }
  );


/* =========================================================
   SOM
========================================================= */

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
        "Oba! Vamos desenhar juntos!"
      );

    }

  }
);


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        resizeCanvas,
        180
      );

  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

renderColors();


updateStars();


soundButton.textContent =
  soundEnabled
    ? "🔊"
    : "🔇";


resizeCanvas();


history = [];


saveState();


setTool(
  "brush"
);


missionText.textContent =
  MISSIONS[
    Math.floor(
      Math.random() *
      MISSIONS.length
    )
  ];