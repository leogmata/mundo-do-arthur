const STORAGE={
  stars:"mundoArthurStars",
  sound:"mundoArthurSound",
  progress:"mundoArthurProgress",
  achievements:"mundoArthurAchievements",
  achievementBaseline:"mundoArthurAchievementBaseline"
};


/* =========================================================
   NÍVEIS DA GIRAFINHA
========================================================= */

const LEVELS=[
  {
    name:"Amiguinha",
    min:0,
    max:10,
    image:"assets/mascote/girafinha_recebendo.png",
    message:"Cada estrelinha ajuda a Girafinha a viver novas aventuras com você!"
  },
  {
    name:"Exploradora",
    min:10,
    max:25,
    image:"assets/mascote/girafinha_piscando.png",
    message:"A Girafinha já está explorando o Mundo do Arthur com você!"
  },
  {
    name:"Aventureira",
    min:25,
    max:50,
    image:"assets/mascote/girafinha_ensinando.png",
    message:"Vocês estão aprendendo muitas coisas juntos. Que aventura!"
  },
  {
    name:"Super Girafinha",
    min:50,
    max:100,
    image:"assets/mascote/girafinha_comemorando.png",
    message:"Uau! A Girafinha virou uma super companheira de aventuras!"
  },
  {
    name:"Girafinha Estelar",
    min:100,
    max:null,
    image:"assets/mascote/girafinha_conquista.png",
    message:"Incrível, Arthur! Vocês chegaram ao nível estelar! Continue brilhando!"
  }
];


/* =========================================================
   CONQUISTAS
========================================================= */

const ACHIEVEMENTS=[
  {
    id:"firstStar",
    icon:"⭐",
    name:"Primeira Estrela",
    description:"Ganhe sua primeira estrelinha.",
    check:p=>p.stars>=1
  },
  {
    id:"firstGame",
    icon:"🏅",
    name:"Primeira Aventura",
    description:"Comece sua primeira partida.",
    check:p=>p.games>=1
  },
  {
    id:"tenStars",
    icon:"🌟",
    name:"Super Jogador",
    description:"Junte 10 estrelas.",
    check:p=>p.stars>=10
  },
  {
    id:"tenPairs",
    icon:"🧠",
    name:"Boa Memória",
    description:"Encontre 10 pares no Jogo da Memória.",
    check:p=>p.pairs>=10
  },
  {
    id:"explorer",
    icon:"🗺️",
    name:"Explorador",
    description:"Brinque em 4 tipos diferentes de jogos.",
    check:p=>countPlayedGameTypes(p)>=4
  },
  {
    id:"artist",
    icon:"🎨",
    name:"Pequeno Artista",
    description:"Termine 3 desenhos.",
    check:p=>p.drawings>=3
  },
  {
    id:"animalExpert",
    icon:"🦁",
    name:"Amigo dos Animais",
    description:"Acerte todas as perguntas de animais em uma partida.",
    check:p=>p.animalPerfect>=1
  },
  {
    id:"colorExpert",
    icon:"🌈",
    name:"Mestre das Cores",
    description:"Acerte todas as perguntas de cores em uma partida.",
    check:p=>p.colorPerfect>=1
  },
  {
    id:"puzzleMaster",
    icon:"🧩",
    name:"Mestre do Quebra-Cabeça",
    description:"Complete um quebra-cabeça difícil.",
    check:p=>p.puzzleHardWins>=1
  },
  {
    id:"lettersMaster",
    icon:"🔤",
    name:"Mestre das Letras",
    description:"Acerte todas as perguntas de letras em uma partida.",
    check:p=>p.lettersPerfect>=1
  },
  {
    id:"numbersMaster",
    icon:"🔢",
    name:"Mestre dos Números",
    description:"Acerte todas as perguntas de números em uma partida.",
    check:p=>p.numbersPerfect>=1
  },
  {
    id:"fiveWins",
    icon:"🏆",
    name:"Campeão",
    description:"Vença 5 partidas.",
    check:p=>p.wins>=5
  },
  {
    id:"fiftyStars",
    icon:"👑",
    name:"Colecionador de Estrelas",
    description:"Junte 50 estrelas.",
    check:p=>p.stars>=50
  },
  {
    id:"hundredStars",
    icon:"🚀",
    name:"Arthur Estelar",
    description:"Junte 100 estrelas.",
    check:p=>p.stars>=100
  }
];


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const starCount=
  document.getElementById("starCount");

const soundButton=
  document.getElementById("soundButton");

const toast=
  document.getElementById("toast");

const achievementGrid=
  document.getElementById("achievementGrid");

const achievementModal=
  document.getElementById("achievementModal");

const achievementModalButton=
  document.getElementById("achievementModalButton");


/* reset das conquistas */

const resetAchievementsButton=
  document.getElementById("resetAchievementsButton");

const resetAchievementsModal=
  document.getElementById("resetAchievementsModal");

const cancelResetAchievementsButton=
  document.getElementById("cancelResetAchievementsButton");

const confirmResetAchievementsButton=
  document.getElementById("confirmResetAchievementsButton");


let soundEnabled=
  localStorage.getItem(STORAGE.sound)!=="off";

let achievementQueue=[];


/* =========================================================
   PROGRESSO GERAL
========================================================= */

function getProgress(){

  let saved={};

  try{

    saved=JSON.parse(
      localStorage.getItem(STORAGE.progress)||"{}"
    );

  }catch{

    saved={};

  }


  return{
    ...saved,

    games:Number(saved.games||0),
    pairs:Number(saved.pairs||0),
    wins:Number(saved.wins||0),

    hardWins:Number(saved.hardWins||0),

    animalGames:Number(saved.animalGames||0),
    animalCorrect:Number(saved.animalCorrect||0),
    animalPerfect:Number(saved.animalPerfect||0),

    colorGames:Number(saved.colorGames||0),
    colorCorrect:Number(saved.colorCorrect||0),
    colorPerfect:Number(saved.colorPerfect||0),

    drawings:Number(saved.drawings||0),

    puzzleGames:Number(saved.puzzleGames||0),
    puzzleEasyWins:Number(saved.puzzleEasyWins||0),
    puzzleMediumWins:Number(saved.puzzleMediumWins||0),
    puzzleHardWins:Number(saved.puzzleHardWins||0),

    lettersGames:Number(saved.lettersGames||0),
    lettersCorrect:Number(saved.lettersCorrect||0),
    lettersPerfect:Number(saved.lettersPerfect||0),

    numbersGames:Number(saved.numbersGames||0),
    numbersCorrect:Number(saved.numbersCorrect||0),
    numbersPerfect:Number(saved.numbersPerfect||0),

    stars:Number(
      localStorage.getItem(STORAGE.stars)||0
    )
  };

}


/* =========================================================
   TIPOS DE JOGOS JÁ JOGADOS
========================================================= */

function countPlayedGameTypes(p){

  return[
    p.pairs>0||p.hardWins>0,
    p.animalGames>0,
    p.colorGames>0,
    p.drawings>0,
    p.puzzleGames>0,
    p.lettersGames>0,
    p.numbersGames>0
  ].filter(Boolean).length;

}


/* =========================================================
   CONQUISTAS SALVAS
========================================================= */

function getUnlocked(){

  try{

    const saved=
      JSON.parse(
        localStorage.getItem(
          STORAGE.achievements
        )||"[]"
      );

    return Array.isArray(saved)
      ?saved
      :[];

  }catch{

    return[];

  }

}


function saveUnlocked(ids){

  localStorage.setItem(
    STORAGE.achievements,
    JSON.stringify(ids)
  );

}


/* =========================================================
   LINHA DE BASE DAS CONQUISTAS

   Quando o álbum é resetado, guardamos aqui o progresso
   existente naquele momento.

   O progresso geral NÃO é apagado.
========================================================= */

function getAchievementBaseline(){

  try{

    const raw=
      localStorage.getItem(
        STORAGE.achievementBaseline
      );

    if(!raw){
      return null;
    }

    const baseline=
      JSON.parse(raw);

    if(
      !baseline||
      typeof baseline!=="object"
    ){
      return null;
    }

    return baseline;

  }catch{

    return null;

  }

}


/* =========================================================
   PROGRESSO VÁLIDO PARA O ÁLBUM

   Sem reset:
   usa todo o progresso.

   Depois do reset:
   usa somente o que Arthur conquistou a partir do reset.
========================================================= */

function getAchievementProgress(){

  const current=
    getProgress();

  const baseline=
    getAchievementBaseline();


  if(!baseline){

    return{
      ...current
    };

  }


  const baseProgress=
    baseline.progress||{};


  return{

    games:
      Math.max(
        0,
        current.games-
        Number(baseProgress.games||0)
      ),

    pairs:
      Math.max(
        0,
        current.pairs-
        Number(baseProgress.pairs||0)
      ),

    wins:
      Math.max(
        0,
        current.wins-
        Number(baseProgress.wins||0)
      ),

    hardWins:
      Math.max(
        0,
        current.hardWins-
        Number(baseProgress.hardWins||0)
      ),

    animalGames:
      Math.max(
        0,
        current.animalGames-
        Number(baseProgress.animalGames||0)
      ),

    animalCorrect:
      Math.max(
        0,
        current.animalCorrect-
        Number(baseProgress.animalCorrect||0)
      ),

    animalPerfect:
      Math.max(
        0,
        current.animalPerfect-
        Number(baseProgress.animalPerfect||0)
      ),

    colorGames:
      Math.max(
        0,
        current.colorGames-
        Number(baseProgress.colorGames||0)
      ),

    colorCorrect:
      Math.max(
        0,
        current.colorCorrect-
        Number(baseProgress.colorCorrect||0)
      ),

    colorPerfect:
      Math.max(
        0,
        current.colorPerfect-
        Number(baseProgress.colorPerfect||0)
      ),

    drawings:
      Math.max(
        0,
        current.drawings-
        Number(baseProgress.drawings||0)
      ),

    puzzleGames:
      Math.max(
        0,
        current.puzzleGames-
        Number(baseProgress.puzzleGames||0)
      ),

    puzzleEasyWins:
      Math.max(
        0,
        current.puzzleEasyWins-
        Number(baseProgress.puzzleEasyWins||0)
      ),

    puzzleMediumWins:
      Math.max(
        0,
        current.puzzleMediumWins-
        Number(baseProgress.puzzleMediumWins||0)
      ),

    puzzleHardWins:
      Math.max(
        0,
        current.puzzleHardWins-
        Number(baseProgress.puzzleHardWins||0)
      ),

    lettersGames:
      Math.max(
        0,
        current.lettersGames-
        Number(baseProgress.lettersGames||0)
      ),

    lettersCorrect:
      Math.max(
        0,
        current.lettersCorrect-
        Number(baseProgress.lettersCorrect||0)
      ),

    lettersPerfect:
      Math.max(
        0,
        current.lettersPerfect-
        Number(baseProgress.lettersPerfect||0)
      ),

    numbersGames:
      Math.max(
        0,
        current.numbersGames-
        Number(baseProgress.numbersGames||0)
      ),

    numbersCorrect:
      Math.max(
        0,
        current.numbersCorrect-
        Number(baseProgress.numbersCorrect||0)
      ),

    numbersPerfect:
      Math.max(
        0,
        current.numbersPerfect-
        Number(baseProgress.numbersPerfect||0)
      ),

    stars:
      Math.max(
        0,
        current.stars-
        Number(baseline.stars||0)
      )

  };

}


/* =========================================================
   VERIFICAÇÃO DAS CONQUISTAS
========================================================= */

function checkAchievements(){

  /*
     Importante:

     As conquistas usam getAchievementProgress().

     O restante da página continua usando getProgress(),
     portanto nível, estrelas e progresso geral continuam
     acumulados normalmente.
  */

  const p=
    getAchievementProgress();

  const unlocked=
    getUnlocked();

  const newlyUnlocked=[];


  ACHIEVEMENTS.forEach(
    achievement=>{

      if(
        achievement.check(p)&&
        !unlocked.includes(
          achievement.id
        )
      ){

        unlocked.push(
          achievement.id
        );

        newlyUnlocked.push(
          achievement
        );

      }

    }
  );


  saveUnlocked(
    unlocked
  );


  return{
    unlocked,
    newlyUnlocked
  };

}


/* =========================================================
   NÍVEL DA GIRAFINHA
========================================================= */

function getLevel(stars){

  for(
    let i=LEVELS.length-1;
    i>=0;
    i--
  ){

    if(
      stars>=LEVELS[i].min
    ){

      return{
        ...LEVELS[i],
        index:i
      };

    }

  }


  return{
    ...LEVELS[0],
    index:0
  };

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message){

  if(!toast){
    return;
  }

  toast.textContent=
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    showToast.timer
  );

  showToast.timer=
    setTimeout(
      ()=>{
        toast.classList.remove(
          "show"
        );
      },
      1800
    );

}


/* =========================================================
   SOM
========================================================= */

function updateSoundButton(){

  if(!soundButton){
    return;
  }

  soundButton.textContent=
    soundEnabled
      ?"🔊"
      :"🔇";

}


function playCelebrationSound(){

  if(!soundEnabled){
    return;
  }


  const AC=
    window.AudioContext||
    window.webkitAudioContext;


  if(!AC){
    return;
  }


  const context=
    new AC();


  [
    523,
    659,
    784,
    1046
  ].forEach(
    (frequency,index)=>{

      setTimeout(
        ()=>{

          const oscillator=
            context.createOscillator();

          const gain=
            context.createGain();


          oscillator.frequency.value=
            frequency;

          oscillator.type=
            "sine";

          gain.gain.value=
            .055;


          oscillator.connect(
            gain
          );

          gain.connect(
            context.destination
          );


          oscillator.start();


          gain.gain
            .exponentialRampToValueAtTime(
              .001,
              context.currentTime+.24
            );


          oscillator.stop(
            context.currentTime+.25
          );

        },
        index*110
      );

    }
  );

}


/* =========================================================
   EVOLUÇÃO DA GIRAFINHA
========================================================= */

function renderLevel(p){

  const level=
    getLevel(
      p.stars
    );

  const next=
    LEVELS[
      level.index+1
    ];


  const levelName=
    document.getElementById(
      "levelName"
    );

  const levelNumber=
    document.getElementById(
      "levelNumber"
    );

  const levelMessage=
    document.getElementById(
      "levelMessage"
    );

  const levelMascotImage=
    document.getElementById(
      "levelMascotImage"
    );

  const progressBar=
    document.getElementById(
      "levelProgressBar"
    );

  const progressText=
    document.getElementById(
      "levelProgressText"
    );

  const nextLevelText=
    document.getElementById(
      "nextLevelText"
    );

  const heroMascotSpeech=
    document.getElementById(
      "heroMascotSpeech"
    );


  if(levelName){
    levelName.textContent=
      level.name;
  }


  if(levelNumber){

    levelNumber.textContent=
      `Nível ${level.index+1}`;

  }


  if(levelMessage){

    levelMessage.textContent=
      level.message;

  }


  if(levelMascotImage){

    levelMascotImage.src=
      level.image;

  }


  if(next){

    const range=
      level.max-
      level.min;

    const current=
      Math.max(
        0,
        p.stars-
        level.min
      );

    const percent=
      Math.min(
        100,
        (current/range)*100
      );


    if(progressBar){

      progressBar.style.width=
        `${percent}%`;

    }


    if(progressText){

      progressText.textContent=
        `${p.stars} de ${level.max} estrelas`;

    }


    if(nextLevelText){

      nextLevelText.textContent=
        `Próximo: ${next.name}`;

    }

  }else{

    if(progressBar){

      progressBar.style.width=
        "100%";

    }


    if(progressText){

      progressText.textContent=
        `${p.stars} estrelas`;

    }


    if(nextLevelText){

      nextLevelText.textContent=
        "Nível máximo alcançado! ⭐";

    }

  }


  const phrases=[
    "Vamos brincar?",
    "Você está indo muito bem!",
    "Quantas aventuras já vivemos!",
    "Uau! Continue brilhando!",
    "Arthur, você é incrível! ⭐"
  ];


  if(heroMascotSpeech){

    heroMascotSpeech.textContent=
      phrases[level.index];

  }

}


/* =========================================================
   RENDERIZAÇÃO DAS CONQUISTAS
========================================================= */

function renderAchievements(unlocked){

  /*
     IDs antigos eventualmente existentes no localStorage
     não entram no contador.

     O contador sempre considera somente as 14 conquistas
     existentes no catálogo atual.
  */

  const currentUnlockedCount=
    ACHIEVEMENTS.filter(
      achievement=>
        unlocked.includes(
          achievement.id
        )
    ).length;


  const countElement=
    document.getElementById(
      "achievementCount"
    );

  const totalElement=
    document.getElementById(
      "achievementTotal"
    );


  if(countElement){

    countElement.textContent=
      currentUnlockedCount;

  }


  if(totalElement){

    totalElement.textContent=
      ACHIEVEMENTS.length;

  }


  if(!achievementGrid){
    return;
  }


  achievementGrid.innerHTML=
    ACHIEVEMENTS.map(
      achievement=>{

        const isUnlocked=
          unlocked.includes(
            achievement.id
          );


        return`
          <div class="achievement-card ${isUnlocked?"unlocked":"locked"}">

            <div class="achievement-icon">
              ${isUnlocked?achievement.icon:"🔒"}
            </div>

            <h4>
              ${achievement.name}
            </h4>

            <p>
              ${achievement.description}
            </p>

            <span class="achievement-status">
              ${
                isUnlocked
                  ?"Conquistado ✓"
                  :"A conquistar"
              }
            </span>

          </div>
        `;

      }
    ).join("");

}


/* =========================================================
   CELEBRAÇÃO
========================================================= */

function createCelebration(){

  const container=
    document.getElementById(
      "achievementCelebration"
    );


  if(!container){
    return;
  }


  container.innerHTML="";


  const symbols=[
    "⭐",
    "✨",
    "💜",
    "🌟"
  ];


  for(
    let i=0;
    i<24;
    i++
  ){

    const particle=
      document.createElement(
        "span"
      );


    particle.textContent=
      symbols[
        Math.floor(
          Math.random()*
          symbols.length
        )
      ];


    particle.style.left=
      `${5+Math.random()*90}%`;


    particle.style.animationDelay=
      `${Math.random()*.8}s`;


    particle.style.animationDuration=
      `${1.8+Math.random()*1.5}s`;


    container.appendChild(
      particle
    );

  }

}


/* =========================================================
   MODAL DE NOVA CONQUISTA
========================================================= */

function showNextAchievement(){

  if(
    !achievementModal||
    achievementModal
      .classList
      .contains("show")||
    achievementQueue.length===0
  ){
    return;
  }


  const achievement=
    achievementQueue.shift();


  const icon=
    document.getElementById(
      "achievementModalIcon"
    );

  const name=
    document.getElementById(
      "achievementModalName"
    );

  const description=
    document.getElementById(
      "achievementModalDescription"
    );


  if(icon){

    icon.textContent=
      achievement.icon;

  }


  if(name){

    name.textContent=
      achievement.name;

  }


  if(description){

    description.textContent=
      achievement.description;

  }


  createCelebration();


  achievementModal
    .classList
    .add("show");


  achievementModal
    .setAttribute(
      "aria-hidden",
      "false"
    );


  document.body.style.overflow=
    "hidden";


  playCelebrationSound();

}


function closeAchievementModal(){

  if(!achievementModal){
    return;
  }


  achievementModal
    .classList
    .remove("show");


  achievementModal
    .setAttribute(
      "aria-hidden",
      "true"
    );


  document.body.style.overflow=
    "";


  setTimeout(
    showNextAchievement,
    250
  );

}


/* =========================================================
   MODAL DE RESET
========================================================= */

function openResetAchievementsModal(){

  if(!resetAchievementsModal){
    return;
  }


  /*
     Evita abrir dois modais simultaneamente.
  */

  if(
    achievementModal&&
    achievementModal
      .classList
      .contains("show")
  ){
    return;
  }


  resetAchievementsModal
    .classList
    .add("show");


  resetAchievementsModal
    .setAttribute(
      "aria-hidden",
      "false"
    );


  document.body.style.overflow=
    "hidden";

}


function closeResetAchievementsModal(){

  if(!resetAchievementsModal){
    return;
  }


  resetAchievementsModal
    .classList
    .remove("show");


  resetAchievementsModal
    .setAttribute(
      "aria-hidden",
      "true"
    );


  document.body.style.overflow=
    "";

}


/* =========================================================
   RESETAR APENAS O ÁLBUM

   NÃO apaga:
   - estrelas
   - partidas
   - pares
   - vitórias
   - evolução
   - progresso dos jogos
========================================================= */

function resetAchievements(){

  const currentProgress=
    getProgress();


  /*
     Criamos uma fotografia do progresso atual.

     As novas conquistas passam a ser calculadas
     a partir deste ponto.
  */

  const baseline={

    stars:
      currentProgress.stars,

    progress:{

      games:
        currentProgress.games,

      pairs:
        currentProgress.pairs,

      wins:
        currentProgress.wins,

      hardWins:
        currentProgress.hardWins,

      animalGames:
        currentProgress.animalGames,

      animalCorrect:
        currentProgress.animalCorrect,

      animalPerfect:
        currentProgress.animalPerfect,

      colorGames:
        currentProgress.colorGames,

      colorCorrect:
        currentProgress.colorCorrect,

      colorPerfect:
        currentProgress.colorPerfect,

      drawings:
        currentProgress.drawings,

      puzzleGames:
        currentProgress.puzzleGames,

      puzzleEasyWins:
        currentProgress.puzzleEasyWins,

      puzzleMediumWins:
        currentProgress.puzzleMediumWins,

      puzzleHardWins:
        currentProgress.puzzleHardWins,

      lettersGames:
        currentProgress.lettersGames,

      lettersCorrect:
        currentProgress.lettersCorrect,

      lettersPerfect:
        currentProgress.lettersPerfect,

      numbersGames:
        currentProgress.numbersGames,

      numbersCorrect:
        currentProgress.numbersCorrect,

      numbersPerfect:
        currentProgress.numbersPerfect

    }

  };


  localStorage.setItem(
    STORAGE.achievementBaseline,
    JSON.stringify(
      baseline
    )
  );


  /*
     Mantemos IDs antigos/desconhecidos caso existam.

     Apagamos somente as conquistas que pertencem
     ao catálogo atual.
  */

  const currentAchievementIds=
    new Set(
      ACHIEVEMENTS.map(
        achievement=>
          achievement.id
      )
    );


  const remainingLegacyIds=
    getUnlocked().filter(
      id=>
        !currentAchievementIds.has(
          id
        )
    );


  saveUnlocked(
    remainingLegacyIds
  );


  /*
     Se havia conquistas aguardando para aparecer
     no modal, elas também são removidas.
  */

  achievementQueue=[];


  /*
     Atualiza somente a parte visual das conquistas.

     Não precisamos alterar estrelas ou progresso.
  */

  renderAchievements(
    remainingLegacyIds
  );


  closeResetAchievementsModal();


  showToast(
    "Álbum reiniciado! Vamos conquistar tudo de novo? ⭐"
  );


  const heroMascotSpeech=
    document.getElementById(
      "heroMascotSpeech"
    );


  if(heroMascotSpeech){

    heroMascotSpeech.textContent=
      "Uma nova aventura começou! ⭐";

  }

}


/* =========================================================
   PROGRESSO DA PÁGINA
========================================================= */

function renderProgress(){

  /*
     Progresso geral/lifetime.
  */

  const p=
    getProgress();


  /*
     As conquistas são verificadas separadamente,
     levando o baseline em consideração.
  */

  const result=
    checkAchievements();


  if(starCount){

    starCount.textContent=
      p.stars;

  }


  const progressStars=
    document.getElementById(
      "progressStars"
    );

  const progressGames=
    document.getElementById(
      "progressGames"
    );

  const progressPairs=
    document.getElementById(
      "progressPairs"
    );

  const progressWins=
    document.getElementById(
      "progressWins"
    );


  if(progressStars){

    progressStars.textContent=
      p.stars;

  }


  if(progressGames){

    progressGames.textContent=
      p.games;

  }


  if(progressPairs){

    progressPairs.textContent=
      p.pairs;

  }


  if(progressWins){

    progressWins.textContent=
      p.wins;

  }


  renderLevel(
    p
  );


  renderAchievements(
    result.unlocked
  );


  if(
    result.newlyUnlocked.length
  ){

    achievementQueue.push(
      ...result.newlyUnlocked
    );


    setTimeout(
      showNextAchievement,
      500
    );

  }

}


/* =========================================================
   BOTÃO DE SOM
========================================================= */

if(soundButton){

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


      updateSoundButton();


      showToast(
        soundEnabled
          ?"Sons ativados 🎵"
          :"Sons desativados"
      );

    }
  );

}


/* =========================================================
   EVENTOS DO MODAL DE CONQUISTA
========================================================= */

if(achievementModalButton){

  achievementModalButton
    .addEventListener(
      "click",
      closeAchievementModal
    );

}


if(achievementModal){

  achievementModal.addEventListener(
    "click",
    event=>{

      if(
        event.target===
        achievementModal
      ){

        closeAchievementModal();

      }

    }
  );

}


/* =========================================================
   EVENTOS DO RESET
========================================================= */

if(resetAchievementsButton){

  resetAchievementsButton
    .addEventListener(
      "click",
      openResetAchievementsModal
    );

}


if(cancelResetAchievementsButton){

  cancelResetAchievementsButton
    .addEventListener(
      "click",
      closeResetAchievementsModal
    );

}


if(confirmResetAchievementsButton){

  confirmResetAchievementsButton
    .addEventListener(
      "click",
      resetAchievements
    );

}


if(resetAchievementsModal){

  resetAchievementsModal
    .addEventListener(
      "click",
      event=>{

        if(
          event.target===
          resetAchievementsModal
        ){

          closeResetAchievementsModal();

        }

      }
    );

}


/* =========================================================
   TECLA ESC
========================================================= */

document.addEventListener(
  "keydown",
  event=>{

    if(
      event.key!=="Escape"
    ){
      return;
    }


    if(
      resetAchievementsModal&&
      resetAchievementsModal
        .classList
        .contains("show")
    ){

      closeResetAchievementsModal();

      return;

    }


    if(
      achievementModal&&
      achievementModal
        .classList
        .contains("show")
    ){

      closeAchievementModal();

    }

  }
);


/* =========================================================
   NAVEGAÇÃO DOS JOGOS
========================================================= */

document
  .querySelectorAll(
    ".game-card"
  )
  .forEach(
    card=>
      card.addEventListener(
        "click",
        ()=>{

          const pages={
            memoria:"memoria.html",
            animais:"animais.html",
            cores:"cores.html",
            desenho:"desenho.html",
            quebracabeca:"quebracabeca.html",
            letras:"letras.html",
            numeros:"numeros.html"
          };


          if(
            pages[
              card.dataset.game
            ]
          ){

            window.location.href=
              pages[
                card.dataset.game
              ];

          }

        }
      )
  );


/* =========================================================
   ATUALIZAÇÃO AO VOLTAR DE UM JOGO

   Em alguns navegadores a página inicial pode voltar
   pelo cache. O pageshow garante que os novos pontos
   apareçam imediatamente.
========================================================= */

window.addEventListener(
  "pageshow",
  ()=>{

    renderProgress();

  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

updateSoundButton();

renderProgress();