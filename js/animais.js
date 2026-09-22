const STORAGE={stars:"mundoArthurStars",sound:"mundoArthurSound",progress:"mundoArthurProgress"};
const MASCOT={teach:"assets/mascote/girafinha_ensinando.png",happy:"assets/mascote/girafinha_feliz.png",thinking:"assets/mascote/girafinha_pensativa.png",celebrate:"assets/mascote/girafinha_comemorando.png"};

const ANIMALS=[
{name:"Cachorro",image:"assets/animais/cachorro.jpg",emoji:"🐶",hint:"Eu gosto de brincar, abano o rabo e faço au au."},
{name:"Gato",image:"assets/animais/gato.jpg",emoji:"🐱",hint:"Eu gosto de ronronar, tenho bigodes e faço miau."},
{name:"Leão",image:"assets/animais/leao.jpg",emoji:"🦁",hint:"Tenho uma grande juba, um rugido forte e sou chamado de rei dos animais."},
{name:"Macaco",image:"assets/animais/macaco.jpg",emoji:"🐵",hint:"Sou muito ágil, curioso e gosto de subir nas árvores."},
{name:"Sapo",image:"assets/animais/sapo.jpg",emoji:"🐸",hint:"Gosto de lugares úmidos, pulo bastante e faço croac croac."},
{name:"Panda",image:"assets/animais/panda.jpg",emoji:"🐼",hint:"Tenho pelos pretos e brancos e gosto muito de comer bambu."},
{name:"Tigre",image:"assets/animais/tigre.jpg",emoji:"🐯",hint:"Sou um grande felino e tenho várias listras pelo corpo."},
{name:"Coelho",image:"assets/animais/coelho.jpg",emoji:"🐰",hint:"Tenho orelhas compridas, gosto de pular e adoro vegetais."},
{name:"Vaca",image:"assets/animais/vaca.jpg",emoji:"🐮",hint:"Posso viver na fazenda e faço muu."},
{name:"Porco",image:"assets/animais/porco.jpg",emoji:"🐷",hint:"Tenho um focinho redondo, vivo em fazendas e faço oinc oinc."},
{name:"Elefante",image:"assets/animais/elefante.jpg",emoji:"🐘",hint:"Sou muito grande, tenho orelhas enormes e uma tromba comprida."},
{name:"Girafa",image:"assets/animais/girafa.jpg",emoji:"🦒",hint:"Tenho um pescoço muito comprido que me ajuda a alcançar folhas bem altas."},
{name:"Zebra",image:"assets/animais/zebra.jpg",emoji:"🦓",hint:"Pareço um cavalo, mas tenho muitas listras pretas e brancas."},
{name:"Pinguim",image:"assets/animais/pinguim.jpg",emoji:"🐧",hint:"Sou uma ave que não voa, gosto de lugares frios e nado muito bem."},
{name:"Polvo",image:"assets/animais/polvo.jpg",emoji:"🐙",hint:"Vivo no mar e tenho oito braços."},
{name:"Cavalo",image:"assets/animais/cavalo.jpg",emoji:"🐴",hint:"Tenho crina, corro muito e posso ser montado pelas pessoas."},
{name:"Ovelha",image:"assets/animais/ovelha.jpg",emoji:"🐑",hint:"Meu corpo é coberto de lã e faço bééé."},
{name:"Galinha",image:"assets/animais/galinha.jpg",emoji:"🐔",hint:"Tenho penas, vivo em muitas fazendas e boto ovos."},
{name:"Pato",image:"assets/animais/pato.jpg",emoji:"🦆",hint:"Tenho bico achatado, gosto de nadar e faço quá quá."},
{name:"Coruja",image:"assets/animais/coruja.jpg",emoji:"🦉",hint:"Sou uma ave de olhos grandes e costumo ficar acordada durante a noite."},
{name:"Águia",image:"assets/animais/aguia.jpg",emoji:"🦅",hint:"Sou uma grande ave, voo muito alto e tenho uma visão excelente."},
{name:"Tartaruga",image:"assets/animais/tartaruga.jpg",emoji:"🐢",hint:"Carrego um casco duro nas costas e caminho devagar."},
{name:"Golfinho",image:"assets/animais/golfinho.jpg",emoji:"🐬",hint:"Vivo no mar, sou muito inteligente e gosto de saltar para fora da água."},
{name:"Tubarão",image:"assets/animais/tubarao.jpg",emoji:"🦈",hint:"Sou um grande peixe do mar e tenho várias fileiras de dentes."},
{name:"Baleia",image:"assets/animais/baleia.jpg",emoji:"🐋",hint:"Vivo nos oceanos e estou entre os maiores animais do planeta."},
{name:"Crocodilo",image:"assets/animais/crocodilo.jpg",emoji:"🐊",hint:"Tenho pele resistente, dentes fortes e gosto de ficar perto da água."},
{name:"Hipopótamo",image:"assets/animais/hipopotamo.jpg",emoji:"🦛",hint:"Sou muito grande, tenho uma boca enorme e gosto de passar bastante tempo dentro da água."},
{name:"Rinoceronte",image:"assets/animais/rinoceronte.jpg",emoji:"🦏",hint:"Sou grande, forte e tenho um chifre no nariz."},
{name:"Raposa",image:"assets/animais/raposa.jpg",emoji:"🦊",hint:"Tenho focinho fino, orelhas pontudas e uma cauda grande e peluda."},
{name:"Urso",image:"assets/animais/urso.jpg",emoji:"🐻",hint:"Sou grande, peludo e algumas espécies gostam muito de pescar."}
];

const answers=document.getElementById("answerGrid"),roundEl=document.getElementById("roundNumber"),scoreEl=document.getElementById("score"),streakEl=document.getElementById("streak"),progressBar=document.getElementById("progressBar"),progressText=document.getElementById("progressText"),starCount=document.getElementById("starCount"),soundButton=document.getElementById("soundButton"),listenButton=document.getElementById("listenButton"),mascotImage=document.getElementById("mascotImage"),mascotText=document.getElementById("mascotText"),mascotBox=document.querySelector(".mascot-box"),feedbackArea=document.getElementById("feedbackArea"),feedbackMascot=document.getElementById("feedbackMascot"),feedbackLabel=document.getElementById("feedbackLabel"),feedbackText=document.getElementById("feedbackText"),nextButton=document.getElementById("nextButton"),resultModal=document.getElementById("resultModal"),confetti=document.getElementById("confettiContainer");

let questions=[],round=0,score=0,streak=0,answered=false,soundEnabled=localStorage.getItem(STORAGE.sound)!=="off",giraffeVoice=null;

function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function stars(){return Number(localStorage.getItem(STORAGE.stars)||0)}
function getProgress(){const p=JSON.parse(localStorage.getItem(STORAGE.progress)||"{}");return{games:Number(p.games||0),pairs:Number(p.pairs||0),wins:Number(p.wins||0),hardWins:Number(p.hardWins||0),animalGames:Number(p.animalGames||0),animalCorrect:Number(p.animalCorrect||0),animalPerfect:Number(p.animalPerfect||0)}}
function saveProgress(p){localStorage.setItem(STORAGE.progress,JSON.stringify(p))}
function updateStars(){starCount.textContent=stars()}
function updateSound(){soundButton.textContent=soundEnabled?"🔊":"🔇"}

function loadGiraffeVoice(){
  if(!("speechSynthesis" in window))return;
  const voices=window.speechSynthesis.getVoices();
  const preferred=["Francisca","Fernanda","Luciana","Leticia","Letícia","Maria","Google português do Brasil"];
  giraffeVoice=null;
  for(const name of preferred){const voice=voices.find(v=>v.name.toLowerCase().includes(name.toLowerCase())&&v.lang.toLowerCase().startsWith("pt"));if(voice){giraffeVoice=voice;break}}
  if(!giraffeVoice)giraffeVoice=voices.find(v=>v.lang.toLowerCase().startsWith("pt-br"))||voices.find(v=>v.lang.toLowerCase().startsWith("pt"))||null;
}

function speak(text){
  if(!soundEnabled||!("speechSynthesis" in window))return;
  window.speechSynthesis.cancel();
  if(!giraffeVoice)loadGiraffeVoice();
  const u=new SpeechSynthesisUtterance(text);
  if(giraffeVoice)u.voice=giraffeVoice;
  u.lang="pt-BR";
  u.rate=.98;
  u.pitch=1.35;
  u.volume=1;
  listenButton.classList.add("speaking");
  u.onend=()=>listenButton.classList.remove("speaking");
  u.onerror=()=>listenButton.classList.remove("speaking");
  window.speechSynthesis.speak(u);
}

if("speechSynthesis" in window){loadGiraffeVoice();window.speechSynthesis.onvoiceschanged=loadGiraffeVoice}

function tone(freq,duration=.12,type="sine",volume=.06){if(!soundEnabled)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type=type;g.gain.value=volume;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.stop(c.currentTime+duration)}
function successSound(){tone(523,.14);setTimeout(()=>tone(659,.15),90);setTimeout(()=>tone(784,.17),180)}
function errorSound(){tone(240,.14,"triangle",.05);setTimeout(()=>tone(190,.15,"triangle",.05),110)}

function setMascot(image,message,type=""){mascotBox.classList.remove("success","try-again");if(type==="success")mascotBox.classList.add("success");if(type==="error")mascotBox.classList.add("try-again");mascotImage.classList.add("changing");mascotText.textContent=message;setTimeout(()=>{mascotImage.src=image;mascotImage.onload=()=>mascotImage.classList.remove("changing")},100)}

function generateOptions(correct){return shuffle([correct,...shuffle(ANIMALS.filter(a=>a.name!==correct.name)).slice(0,3)])}

function buildImage(animal){
  return `<div class="answer-image-wrap"><img class="answer-image" src="${animal.image}" alt="${animal.name}"><div class="answer-fallback">${animal.emoji}</div></div>`;
}

function renderQuestion(){
  answered=false;
  feedbackArea.classList.remove("show");
  const current=questions[round];
  roundEl.textContent=round+1;
  progressText.textContent=`${round+1} de 10`;
  progressBar.style.width=`${((round+1)/10)*100}%`;
  answers.innerHTML="";
  generateOptions(current).forEach(animal=>{
    const b=document.createElement("button");
    b.className="answer-button";
    b.innerHTML=`${buildImage(animal)}<div class="answer-name">${animal.name}</div><div class="answer-result"></div>`;
    const img=b.querySelector(".answer-image"),fallback=b.querySelector(".answer-fallback");
    img.addEventListener("error",()=>{img.style.display="none";fallback.style.display="grid"});
    b.addEventListener("click",()=>chooseAnswer(b,animal,current));
    answers.appendChild(b);
  });
  setMascot(MASCOT.teach,"Escute a dica e escolha uma fotografia!");
}

function chooseAnswer(button,chosen,correct){
  if(answered)return;
  answered=true;
  window.speechSynthesis?.cancel();
  listenButton.classList.remove("speaking");

  document.querySelectorAll(".answer-button").forEach(b=>b.disabled=true);

  if(chosen.name===correct.name){
    button.classList.add("correct");
    button.querySelector(".answer-result").textContent="✓";
    score++;
    streak++;
    scoreEl.textContent=score;
    streakEl.textContent=streak;
    successSound();
    setMascot(MASCOT.happy,streak>=3?`Uau! ${streak} acertos seguidos! 🔥`:`Muito bem! Esse é o ${correct.name}!`,"success");
    feedbackMascot.src=MASCOT.happy;
    feedbackLabel.textContent="Muito bem! ⭐";
    feedbackText.textContent=`Você descobriu o ${correct.name}!`;
  }else{
    button.classList.add("wrong");
    button.querySelector(".answer-result").textContent="✕";
    streak=0;
    streakEl.textContent=0;
    document.querySelectorAll(".answer-button").forEach(b=>{if(b.querySelector(".answer-name").textContent===correct.name){b.classList.add("correct");b.querySelector(".answer-result").textContent="✓"}});
    errorSound();
    setMascot(MASCOT.thinking,`Quase! Esse animal é o ${correct.name}.`,"error");
    feedbackMascot.src=MASCOT.thinking;
    feedbackLabel.textContent="Quase! 😊";
    feedbackText.textContent=`A resposta correta era ${correct.name}.`;
  }

  feedbackArea.classList.add("show");
  nextButton.textContent=round===9?"Ver meu resultado 🏆":"Próximo animal →";
  feedbackArea.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function nextQuestion(){
  if(!answered)return;
  round++;
  if(round<10){renderQuestion();window.scrollTo({top:0,behavior:"smooth"})}
  else finishGame();
}

function rewardForScore(n){if(n===10)return 8;if(n>=8)return 5;if(n>=5)return 3;return 1}

function finishGame(){
  const reward=rewardForScore(score);
  localStorage.setItem(STORAGE.stars,stars()+reward);

  const p=getProgress();
  p.games++;
  p.animalGames++;
  p.animalCorrect+=score;
  if(score===10)p.animalPerfect++;
  if(score>=8)p.wins++;
  saveProgress(p);
  updateStars();

  document.getElementById("finalScore").textContent=score;
  document.getElementById("rewardText").textContent=`+${reward} ⭐`;

  const title=document.getElementById("resultTitle"),message=document.getElementById("resultMessage"),resultMascot=document.getElementById("resultMascot");

  if(score===10){title.textContent="Perfeito, Arthur!";message.textContent="Você descobriu todos os animais!";resultMascot.src=MASCOT.celebrate;createConfetti()}
  else if(score>=8){title.textContent="Excelente!";message.textContent="Você conhece muitos animais!";resultMascot.src=MASCOT.celebrate;createConfetti()}
  else if(score>=5){title.textContent="Muito bem!";message.textContent="Você foi muito bem nessa aventura!";resultMascot.src=MASCOT.happy}
  else{title.textContent="Boa tentativa!";message.textContent="Vamos brincar novamente e conhecer ainda mais animais?";resultMascot.src=MASCOT.thinking}

  resultModal.classList.add("show");
}

function createConfetti(){
  confetti.innerHTML="";
  const colors=["#ff934d","#7c4dff","#ffd34e","#58d68d","#5dade2"];
  for(let i=0;i<80;i++){const c=document.createElement("div");c.className="confetti";c.style.left=`${Math.random()*100}%`;c.style.background=colors[Math.floor(Math.random()*colors.length)];c.style.animationDuration=`${2.5+Math.random()*2}s`;c.style.animationDelay=`${Math.random()*.7}s`;confetti.appendChild(c)}
  setTimeout(()=>confetti.innerHTML="",5000);
}

function startGame(){
  window.speechSynthesis?.cancel();
  questions=shuffle(ANIMALS).slice(0,10);
  round=0;
  score=0;
  streak=0;
  answered=false;
  scoreEl.textContent=0;
  streakEl.textContent=0;
  resultModal.classList.remove("show");
  feedbackArea.classList.remove("show");
  confetti.innerHTML="";
  renderQuestion();
}

soundButton.addEventListener("click",()=>{soundEnabled=!soundEnabled;localStorage.setItem(STORAGE.sound,soundEnabled?"on":"off");updateSound();if(!soundEnabled)window.speechSynthesis?.cancel()});
listenButton.addEventListener("click",()=>speak(questions[round].hint));
nextButton.addEventListener("click",nextQuestion);
document.getElementById("playAgainButton").addEventListener("click",startGame);

updateStars();
updateSound();
startGame();