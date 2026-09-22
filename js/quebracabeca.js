/* =========================================================
   MUNDO DO ARTHUR
   QUEBRA-CABEÇA
========================================================= */

const STORAGE={
  stars:"mundoArthurStars",
  sound:"mundoArthurSound",
  progress:"mundoArthurProgress"
};


/* =========================================================
   GIRAFINHA
========================================================= */

const MASCOT={
  start:"assets/mascote/girafinha_inicio.png",
  happy:"assets/mascote/girafinha_feliz.png",
  thinking:"assets/mascote/girafinha_pensativa.png",
  celebrate:"assets/mascote/girafinha_comemorando.png"
};


/* =========================================================
   DIFICULDADES
========================================================= */

const LEVELS={

  easy:{
    rows:4,
    cols:4,
    pieces:16,
    reward:5
  },

  medium:{
    rows:5,
    cols:5,
    pieces:25,
    reward:8
  },

  hard:{
    rows:6,
    cols:6,
    pieces:36,
    reward:12
  }

};


/* =========================================================
   IMAGENS DO QUEBRA-CABEÇA
========================================================= */

const THEMES=[

  {
    name:"Espaço",
    image:"assets/puzzle/espaco.png"
  },

  {
    name:"Dinossauros",
    image:"assets/puzzle/dinossauros.png"
  },

  {
    name:"Fundo do Mar",
    image:"assets/puzzle/fundo_mar.png"
  },

  {
    name:"Safari",
    image:"assets/puzzle/safari.png"
  },

  {
    name:"Fazenda",
    image:"assets/puzzle/fazenda.png"
  },

  {
    name:"Carrinhos",
    image:"assets/puzzle/carrinhos.png"
  },

  {
    name:"Castelo",
    image:"assets/puzzle/castelo.png"
  },

  {
    name:"Girafinha",
    image:"assets/puzzle/girafinha.png"
  }

];


/* =========================================================
   ELEMENTOS
========================================================= */

const board=
  document.getElementById("puzzleBoard");

const correctPiecesEl=
  document.getElementById("correctPieces");

const totalPiecesEl=
  document.getElementById("totalPieces");

const movesEl=
  document.getElementById("moves");

const starCount=
  document.getElementById("starCount");

const soundButton=
  document.getElementById("soundButton");

const mascotImage=
  document.getElementById("mascotImage");

const mascotText=
  document.getElementById("mascotText");

const mascotBox=
  document.querySelector(".mascot-box");

const themeName=
  document.getElementById("themeName");

const previewModal=
  document.getElementById("previewModal");

const previewImage=
  document.getElementById("previewImage");

const previewTitle=
  document.getElementById("previewTitle");

const victoryModal=
  document.getElementById("victoryModal");

const confetti=
  document.getElementById("confettiContainer");


/* =========================================================
   ESTADO
========================================================= */

let level="easy";

let currentTheme=THEMES[0];

let pieces=[];

let pieceShapes=[];

let selectedPosition=null;

let draggedPosition=null;

let moves=0;

let finished=false;

let rewardGiven=false;

let puzzleImage="";

let lastCorrectPieces=new Set();

let soundEnabled=
  localStorage.getItem(STORAGE.sound)!=="off";


/* =========================================================
   UTILIDADES
========================================================= */

function shuffle(array){

  const a=[...array];

  for(
    let i=a.length-1;
    i>0;
    i--
  ){

    const j=
      Math.floor(
        Math.random()*(i+1)
      );

    [
      a[i],
      a[j]
    ]=[
      a[j],
      a[i]
    ];

  }

  return a;

}


/* =========================================================
   ESTRELAS
========================================================= */

function stars(){

  return Number(
    localStorage.getItem(
      STORAGE.stars
    )||0
  );

}


function updateStars(){

  starCount.textContent=
    stars();

}


/* =========================================================
   SOM
========================================================= */

function updateSound(){

  soundButton.textContent=
    soundEnabled
      ?"🔊"
      :"🔇";

}


/* =========================================================
   PROGRESSO
========================================================= */

function getProgress(){

  const p=
    JSON.parse(
      localStorage.getItem(
        STORAGE.progress
      )||"{}"
    );


  return{

    games:
      Number(p.games||0),

    pairs:
      Number(p.pairs||0),

    wins:
      Number(p.wins||0),

    hardWins:
      Number(p.hardWins||0),

    animalGames:
      Number(p.animalGames||0),

    animalCorrect:
      Number(p.animalCorrect||0),

    animalPerfect:
      Number(p.animalPerfect||0),

    colorGames:
      Number(p.colorGames||0),

    colorCorrect:
      Number(p.colorCorrect||0),

    colorPerfect:
      Number(p.colorPerfect||0),

    drawings:
      Number(p.drawings||0),

    puzzleGames:
      Number(p.puzzleGames||0),

    puzzleEasyWins:
      Number(p.puzzleEasyWins||0),

    puzzleMediumWins:
      Number(p.puzzleMediumWins||0),

    puzzleHardWins:
      Number(p.puzzleHardWins||0),

    lettersGames:
      Number(p.lettersGames||0),

    lettersCorrect:
      Number(p.lettersCorrect||0),

    lettersPerfect:
      Number(p.lettersPerfect||0),

    numbersGames:
      Number(p.numbersGames||0),

    numbersCorrect:
      Number(p.numbersCorrect||0),

    numbersPerfect:
      Number(p.numbersPerfect||0)

  };

}


function saveProgress(p){

  localStorage.setItem(
    STORAGE.progress,
    JSON.stringify(p)
  );

}


/* =========================================================
   EFEITOS SONOROS
========================================================= */

function tone(
  freq,
  duration=.12,
  type="sine",
  volume=.05
){

  if(!soundEnabled){
    return;
  }


  const AC=
    window.AudioContext||
    window.webkitAudioContext;


  if(!AC){
    return;
  }


  const c=
    new AC();

  const o=
    c.createOscillator();

  const g=
    c.createGain();


  o.type=type;

  o.frequency.value=freq;

  g.gain.value=volume;


  o.connect(g);

  g.connect(
    c.destination
  );


  o.start();


  g.gain
    .exponentialRampToValueAtTime(
      .001,
      c.currentTime+duration
    );


  o.stop(
    c.currentTime+duration
  );

}


function moveSound(){

  tone(
    420,
    .07,
    "sine",
    .035
  );

}


function correctSound(){

  tone(
    610,
    .1
  );

}


function victorySound(){

  [
    523,
    659,
    784,
    1046
  ].forEach(
    (n,i)=>{

      setTimeout(
        ()=>tone(n,.25),
        i*140
      );

    }
  );

}


/* =========================================================
   GIRAFINHA
========================================================= */

function setMascot(
  image,
  message,
  success=false
){

  mascotBox
    .classList
    .toggle(
      "success",
      success
    );


  mascotText.textContent=
    message;


  mascotImage
    .classList
    .add(
      "changing"
    );


  const finish=()=>{

    mascotImage
      .classList
      .remove(
        "changing"
      );

  };


  mascotImage.onload=
    finish;


  mascotImage.src=
    image;


  setTimeout(
    finish,
    350
  );

}


/* =========================================================
   FORMATO DAS PEÇAS
========================================================= */

/*
   0  = lado reto
   1  = saliência
  -1  = reentrância
*/

function generatePieceShapes(){

  const settings=
    LEVELS[level];

  const rows=
    settings.rows;

  const cols=
    settings.cols;


  pieceShapes=
    Array.from(
      {
        length:
          settings.pieces
      },
      ()=>({
        top:0,
        right:0,
        bottom:0,
        left:0
      })
    );


  for(
    let row=0;
    row<rows;
    row++
  ){

    for(
      let col=0;
      col<cols;
      col++
    ){

      const index=
        row*cols+col;

      const shape=
        pieceShapes[index];


      /* TOPO */

      if(row===0){

        shape.top=0;

      }else{

        const above=
          pieceShapes[
            (row-1)*cols+col
          ];

        shape.top=
          -above.bottom;

      }


      /* ESQUERDA */

      if(col===0){

        shape.left=0;

      }else{

        const previous=
          pieceShapes[
            row*cols+(col-1)
          ];

        shape.left=
          -previous.right;

      }


      /* DIREITA */

      if(col===cols-1){

        shape.right=0;

      }else{

        shape.right=
          Math.random()<.5
            ?1
            :-1;

      }


      /* BAIXO */

      if(row===rows-1){

        shape.bottom=0;

      }else{

        shape.bottom=
          Math.random()<.5
            ?1
            :-1;

      }

    }

  }

}


/* =========================================================
   RECORTE VISUAL DA PEÇA
========================================================= */

function createPieceClipPath(shape){

  const pad=18;

  const min=pad;

  const max=100-pad;

  const mid=50;

  const neck=9;

  const knob=14;


  let path=
    `M ${min} ${min}`;


  /* TOPO */

  if(shape.top===0){

    path+=
      ` L ${max} ${min}`;

  }else{

    path+=
      ` L ${mid-neck} ${min}`;


    if(shape.top===1){

      path+=
        ` C ${mid-neck} ${min-knob},
            ${mid+neck} ${min-knob},
            ${mid+neck} ${min}`;

    }else{

      path+=
        ` C ${mid-neck} ${min+knob},
            ${mid+neck} ${min+knob},
            ${mid+neck} ${min}`;

    }


    path+=
      ` L ${max} ${min}`;

  }


  /* DIREITA */

  if(shape.right===0){

    path+=
      ` L ${max} ${max}`;

  }else{

    path+=
      ` L ${max} ${mid-neck}`;


    if(shape.right===1){

      path+=
        ` C ${max+knob} ${mid-neck},
            ${max+knob} ${mid+neck},
            ${max} ${mid+neck}`;

    }else{

      path+=
        ` C ${max-knob} ${mid-neck},
            ${max-knob} ${mid+neck},
            ${max} ${mid+neck}`;

    }


    path+=
      ` L ${max} ${max}`;

  }


  /* BAIXO */

  if(shape.bottom===0){

    path+=
      ` L ${min} ${max}`;

  }else{

    path+=
      ` L ${mid+neck} ${max}`;


    if(shape.bottom===1){

      path+=
        ` C ${mid+neck} ${max+knob},
            ${mid-neck} ${max+knob},
            ${mid-neck} ${max}`;

    }else{

      path+=
        ` C ${mid+neck} ${max-knob},
            ${mid-neck} ${max-knob},
            ${mid-neck} ${max}`;

    }


    path+=
      ` L ${min} ${max}`;

  }


  /* ESQUERDA */

  if(shape.left===0){

    path+=
      ` L ${min} ${min}`;

  }else{

    path+=
      ` L ${min} ${mid+neck}`;


    if(shape.left===1){

      path+=
        ` C ${min-knob} ${mid+neck},
            ${min-knob} ${mid-neck},
            ${min} ${mid-neck}`;

    }else{

      path+=
        ` C ${min+knob} ${mid+neck},
            ${min+knob} ${mid-neck},
            ${min} ${mid-neck}`;

    }


    path+=
      ` L ${min} ${min}`;

  }


  path+=" Z";


  const svg=
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="${path}" fill="black"/>
    </svg>`;


  return(
    `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  );

}


/* =========================================================
   POSIÇÃO ORIGINAL DA PEÇA
========================================================= */

function piecePosition(index){

  const cols=
    LEVELS[level].cols;


  return{

    row:
      Math.floor(
        index/cols
      ),

    col:
      index%cols

  };

}


/* =========================================================
   CRIAÇÃO DAS PEÇAS
========================================================= */

function createPieces(){

  pieces=
    Array.from(
      {
        length:
          LEVELS[level].pieces
      },
      (_,i)=>i
    );


  do{

    pieces=
      shuffle(pieces);

  }while(
    pieces.every(
      (piece,index)=>
        piece===index
    )
  );


  lastCorrectPieces=
    new Set();

}


/* =========================================================
   CONTAGEM DAS PEÇAS CERTAS
========================================================= */

function correctCount(){

  return pieces.reduce(
    (
      sum,
      piece,
      index
    )=>
      sum+
      (
        piece===index
          ?1
          :0
      ),
    0
  );

}


/* =========================================================
   TABULEIRO
========================================================= */

function renderBoard(){

  const settings=
    LEVELS[level];


  board.style.setProperty(
    "--cols",
    settings.cols
  );


  board.style.setProperty(
    "--rows",
    settings.rows
  );


  board.style.gridTemplateColumns=
    `repeat(${settings.cols},1fr)`;


  board.style.gridTemplateRows=
    `repeat(${settings.rows},1fr)`;


  board.innerHTML="";


  const currentCorrect=
    new Set();


  pieces.forEach(
    (
      piece,
      index
    )=>{

      const pos=
        piecePosition(piece);


      const button=
        document.createElement(
          "button"
        );


      button.className=
        "puzzle-piece";


      /* FORMATO */

      const shape=
        pieceShapes[piece];


      button.style.setProperty(
        "--piece-shape",
        createPieceClipPath(
          shape
        )
      );


      /* PEÇA CORRETA */

      if(piece===index){

        button
          .classList
          .add(
            "correct"
          );


        currentCorrect.add(
          piece
        );


        if(
          !lastCorrectPieces.has(
            piece
          )
        ){

          button
            .classList
            .add(
              "just-correct"
            );

        }


        if(level==="easy"){

          button
            .classList
            .add(
              "easy-help"
            );

        }

      }


      /* PEÇA SELECIONADA */

      if(
        selectedPosition===
        index
      ){

        button
          .classList
          .add(
            "selected"
          );

      }


      button.dataset.position=
        index;


      button.draggable=true;


      /* =================================================
         PARTE DA IMAGEM QUE A PEÇA DEVE MOSTRAR
      ================================================= */

      const x=
        settings.cols===1
          ?0
          :(pos.col/(settings.cols-1))*100;


      const y=
        settings.rows===1
          ?0
          :(pos.row/(settings.rows-1))*100;


      button.style.backgroundImage=
        `url("${puzzleImage}")`;


      button.style.backgroundSize=
        `${settings.cols*100}% ${settings.rows*100}%`;


      button.style.backgroundPosition=
        `${x}% ${y}%`;


      /* =================================================
         CLIQUE
      ================================================= */

      button.addEventListener(
        "click",
        ()=>selectPiece(index)
      );


      /* =================================================
         ARRASTAR
      ================================================= */

      button.addEventListener(
        "dragstart",
        event=>{

          draggedPosition=
            index;


          button
            .classList
            .add(
              "dragging"
            );


          if(
            event.dataTransfer
          ){

            event
              .dataTransfer
              .effectAllowed=
                "move";


            event
              .dataTransfer
              .setData(
                "text/plain",
                String(index)
              );

          }

        }
      );


      button.addEventListener(
        "dragend",
        ()=>{

          draggedPosition=
            null;


          document
            .querySelectorAll(
              ".puzzle-piece"
            )
            .forEach(
              p=>{

                p.classList.remove(
                  "dragging",
                  "drag-target"
                );

              }
            );

        }
      );


      button.addEventListener(
        "dragover",
        event=>{

          event.preventDefault();


          button
            .classList
            .add(
              "drag-target"
            );

        }
      );


      button.addEventListener(
        "dragleave",
        ()=>{

          button
            .classList
            .remove(
              "drag-target"
            );

        }
      );


      button.addEventListener(
        "drop",
        event=>{

          event.preventDefault();


          button
            .classList
            .remove(
              "drag-target"
            );


          let from=
            draggedPosition;


          if(
            event.dataTransfer
          ){

            const transferred=
              Number(
                event
                  .dataTransfer
                  .getData(
                    "text/plain"
                  )
              );


            if(
              Number.isInteger(
                transferred
              )
            ){

              from=
                transferred;

            }

          }


          if(
            from!==null &&
            from!==index
          ){

            swapPieces(
              from,
              index
            );

          }

        }
      );


      board.appendChild(
        button
      );

    }
  );


  lastCorrectPieces=
    currentCorrect;


  updateStatus();

}


/* =========================================================
   SELEÇÃO
========================================================= */

function selectPiece(position){

  if(finished){
    return;
  }


  if(
    selectedPosition===
    null
  ){

    selectedPosition=
      position;


    renderBoard();


    moveSound();


    return;

  }


  if(
    selectedPosition===
    position
  ){

    selectedPosition=
      null;


    renderBoard();


    return;

  }


  const first=
    selectedPosition;


  selectedPosition=
    null;


  swapPieces(
    first,
    position
  );

}


/* =========================================================
   TROCAR PEÇAS
========================================================= */

function swapPieces(a,b){

  if(finished){
    return;
  }


  const before=
    correctCount();


  [
    pieces[a],
    pieces[b]
  ]=[
    pieces[b],
    pieces[a]
  ];


  moves++;


  const after=
    correctCount();


  movesEl.textContent=
    moves;


  if(after>before){

    correctSound();


    if(
      after%5===0 ||
      after===
      LEVELS[level].pieces
    ){

      setMascot(
        MASCOT.happy,
        `Muito bem! Já temos ${after} peças no lugar certo!`,
        true
      );

    }

  }else{

    moveSound();

  }


  renderBoard();

  checkVictory();

}


/* =========================================================
   STATUS
========================================================= */

function updateStatus(){

  correctPiecesEl.textContent=
    correctCount();


  totalPiecesEl.textContent=
    LEVELS[level].pieces;


  movesEl.textContent=
    moves;

}


/* =========================================================
   VERIFICAR VITÓRIA
========================================================= */

function checkVictory(){

  if(
    correctCount()!==
    LEVELS[level].pieces
  ){

    return;

  }


  finished=true;


  setTimeout(
    showVictory,
    500
  );

}


/* =========================================================
   PRÉVIA DA IMAGEM
========================================================= */

function showPreview(){

  previewImage.src=
    puzzleImage;


  previewTitle.textContent=
    currentTheme.name;


  previewModal
    .classList
    .add(
      "show"
    );


  document.body.style.overflow=
    "hidden";


  previewModal.scrollTop=0;


  setMascot(
    MASCOT.thinking,
    "Observe bem a imagem. Depois tente lembrar onde fica cada parte!"
  );

}


/* =========================================================
   FECHAR PRÉVIA
========================================================= */

function closePreview(){

  previewModal
    .classList
    .remove(
      "show"
    );


  document.body.style.overflow=
    "";


  if(!finished){

    setMascot(
      MASCOT.start,
      "Agora vamos montar! Estou torcendo por você!"
    );

  }

}


/* =========================================================
   NOVA IMAGEM
========================================================= */

function selectNewTheme(){

  const choices=
    THEMES.filter(
      theme=>
        theme.name!==
        currentTheme.name
    );


  currentTheme=
    choices[
      Math.floor(
        Math.random()*
        choices.length
      )
    ];


  startPuzzle(true);

}


/* =========================================================
   CARREGAR IMAGEM
========================================================= */

/*
   Fazemos uma pré-carga antes de montar o tabuleiro.

   Assim evitamos que as peças apareçam vazias por alguns
   instantes enquanto o navegador carrega a imagem.
*/

function preloadPuzzleImage(src){

  return new Promise(
    resolve=>{

      const img=
        new Image();


      img.onload=
        ()=>resolve(true);


      img.onerror=
        ()=>{

          console.error(
            "Não foi possível carregar a imagem:",
            src
          );


          resolve(false);

        };


      img.src=
        src;

    }
  );

}


/* =========================================================
   INICIAR QUEBRA-CABEÇA
========================================================= */

async function startPuzzle(
  showReference=true
){

  finished=false;

  rewardGiven=false;

  selectedPosition=null;

  draggedPosition=null;

  moves=0;


  themeName.textContent=
    currentTheme.name;


  /*
     AGORA USAMOS A IMAGEM REAL.
  */

  puzzleImage=
    currentTheme.image;


  const imageLoaded=
    await preloadPuzzleImage(
      puzzleImage
    );


  if(!imageLoaded){

    setMascot(
      MASCOT.thinking,
      "Ops! Não consegui encontrar essa imagem."
    );


    return;

  }


  /*
     Gera um novo desenho de encaixes.
  */

  generatePieceShapes();


  /*
     Embaralha as peças.
  */

  createPieces();


  /*
     Desenha o tabuleiro.
  */

  renderBoard();


  victoryModal
    .classList
    .remove(
      "show"
    );


  document.body.style.overflow=
    "";


  confetti.innerHTML="";


  setMascot(
    MASCOT.start,
    `Vamos montar a imagem de ${currentTheme.name.toLowerCase()}?`
  );


  /*
     Mostra a imagem completa antes de começar.
  */

  if(showReference){

    setTimeout(
      showPreview,
      300
    );

  }

}


/* =========================================================
   EMBARALHAR NOVAMENTE
========================================================= */

function restartPuzzle(){

  finished=false;

  selectedPosition=null;

  moves=0;


  createPieces();


  renderBoard();


  setMascot(
    MASCOT.start,
    "Embaralhei tudo novamente. Vamos tentar!"
  );

}


/* =========================================================
   ALTERAR DIFICULDADE
========================================================= */

function changeLevel(newLevel){

  level=
    newLevel;


  document
    .querySelectorAll(
      ".difficulty-button"
    )
    .forEach(
      button=>{

        button
          .classList
          .toggle(
            "active",
            button.dataset.level===
            level
          );

      }
    );


  startPuzzle(true);

}


/* =========================================================
   VITÓRIA
========================================================= */

function showVictory(){

  const settings=
    LEVELS[level];


  if(!rewardGiven){

    localStorage.setItem(
      STORAGE.stars,
      stars()+
      settings.reward
    );


    const p=
      getProgress();


    p.games++;

    p.wins++;

    p.puzzleGames++;


    if(level==="easy"){

      p.puzzleEasyWins++;

    }


    if(level==="medium"){

      p.puzzleMediumWins++;

    }


    if(level==="hard"){

      p.puzzleHardWins++;

    }


    saveProgress(p);


    rewardGiven=true;


    updateStars();

  }


  document
    .getElementById(
      "victoryPieces"
    )
    .textContent=
      settings.pieces;


  document
    .getElementById(
      "victoryMoves"
    )
    .textContent=
      moves;


  document
    .getElementById(
      "rewardText"
    )
    .textContent=
      `+${settings.reward} ⭐`;


  document
    .getElementById(
      "victoryMessage"
    )
    .textContent=
      `Você colocou todas as ${settings.pieces} peças no lugar certo!`;


  setMascot(
    MASCOT.celebrate,
    "Você conseguiu! Que quebra-cabeça incrível!",
    true
  );


  victorySound();


  createConfetti();


  victoryModal
    .classList
    .add(
      "show"
    );


  document.body.style.overflow=
    "hidden";

}


/* =========================================================
   CONFETE
========================================================= */

function createConfetti(){

  confetti.innerHTML="";


  const colors=[

    "#ffad54",
    "#7c4dff",
    "#ffd34e",
    "#58d68d",
    "#5dade2",
    "#ec6fa6"

  ];


  for(
    let i=0;
    i<90;
    i++
  ){

    const c=
      document.createElement(
        "div"
      );


    c.className=
      "confetti";


    c.style.left=
      `${Math.random()*100}%`;


    c.style.background=
      colors[
        Math.floor(
          Math.random()*
          colors.length
        )
      ];


    c.style.animationDuration=
      `${2.5+Math.random()*2}s`;


    c.style.animationDelay=
      `${Math.random()*.8}s`;


    confetti.appendChild(
      c
    );

  }


  setTimeout(
    ()=>{

      confetti.innerHTML="";

    },
    5200
  );

}


/* =========================================================
   BOTÃO DE SOM
========================================================= */

soundButton.addEventListener(
  "click",
  ()=>{

    soundEnabled=
      !soundEnabled;


    localStorage.setItem(
      STORAGE.sound,
      soundEnabled
        ?"on"
        :"off"
    );


    updateSound();


    if(soundEnabled){

      correctSound();

    }

  }
);


/* =========================================================
   DIFICULDADE
========================================================= */

document
  .querySelectorAll(
    ".difficulty-button"
  )
  .forEach(
    button=>{

      button.addEventListener(
        "click",
        ()=>{

          changeLevel(
            button.dataset.level
          );

        }
      );

    }
  );


/* =========================================================
   PRÉVIA
========================================================= */

document
  .getElementById(
    "previewButton"
  )
  .addEventListener(
    "click",
    showPreview
  );


document
  .getElementById(
    "closePreviewButton"
  )
  .addEventListener(
    "click",
    closePreview
  );


document
  .getElementById(
    "continueButton"
  )
  .addEventListener(
    "click",
    closePreview
  );


/* =========================================================
   NOVA IMAGEM
========================================================= */

document
  .getElementById(
    "newPuzzleButton"
  )
  .addEventListener(
    "click",
    selectNewTheme
  );


/* =========================================================
   EMBARALHAR
========================================================= */

document
  .getElementById(
    "restartButton"
  )
  .addEventListener(
    "click",
    restartPuzzle
  );


/* =========================================================
   JOGAR NOVAMENTE
========================================================= */

document
  .getElementById(
    "playAgainButton"
  )
  .addEventListener(
    "click",
    ()=>{

      victoryModal
        .classList
        .remove(
          "show"
        );


      document.body.style.overflow=
        "";


      selectNewTheme();

    }
  );


/* =========================================================
   CLICAR FORA DA PRÉVIA
========================================================= */

previewModal.addEventListener(
  "click",
  event=>{

    if(
      event.target===
      previewModal
    ){

      closePreview();

    }

  }
);


/* =========================================================
   ESC FECHA PRÉVIA
========================================================= */

document.addEventListener(
  "keydown",
  event=>{

    if(
      event.key==="Escape" &&
      previewModal
        .classList
        .contains(
          "show"
        )
    ){

      closePreview();

    }

  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

/*
   Começa com uma imagem aleatória.
*/

currentTheme=
  THEMES[
    Math.floor(
      Math.random()*
      THEMES.length
    )
  ];


updateStars();

updateSound();

startPuzzle(true);