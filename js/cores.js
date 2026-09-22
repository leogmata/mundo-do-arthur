const STORAGE={stars:"mundoArthurStars",sound:"mundoArthurSound",progress:"mundoArthurProgress"};
const MASCOT={teach:"assets/mascote/girafinha_ensinando.png",happy:"assets/mascote/girafinha_feliz.png",thinking:"assets/mascote/girafinha_pensativa.png",celebrate:"assets/mascote/girafinha_comemorando.png"};

const COLORS=[
{id:"vermelho",name:"Vermelho",hex:"#ef5350"},
{id:"azul",name:"Azul",hex:"#42a5f5"},
{id:"amarelo",name:"Amarelo",hex:"#fdd835"},
{id:"verde",name:"Verde",hex:"#66bb6a"},
{id:"roxo",name:"Roxo",hex:"#8e5ad7"},
{id:"laranja",name:"Laranja",hex:"#ff9800"},
{id:"rosa",name:"Rosa",hex:"#ec6fa6"},
{id:"marrom",name:"Marrom",hex:"#8d6e63"}
];

const SHAPES=[
{id:"circle",name:"Círculo"},
{id:"square",name:"Quadrado"},
{id:"triangle",name:"Triângulo"},
{id:"rectangle",name:"Retângulo"},
{id:"star",name:"Estrela"},
{id:"oval",name:"Oval"}
];

const answers=document.getElementById("answerGrid"),questionTitle=document.getElementById("questionTitle"),questionSubtitle=document.getElementById("questionSubtitle"),challengeText=document.getElementById("challengeText"),mainShape=document.getElementById("mainShape"),roundEl=document.getElementById("roundNumber"),scoreEl=document.getElementById("score"),streakEl=document.getElementById("streak"),progressBar=document.getElementById("progressBar"),progressText=document.getElementById("progressText"),starCount=document.getElementById("starCount"),soundButton=document.getElementById("soundButton"),listenButton=document.getElementById("listenButton"),mascotImage=document.getElementById("mascotImage"),mascotText=document.getElementById("mascotText"),mascotBox=document.querySelector(".mascot-box"),feedbackArea=document.getElementById("feedbackArea"),feedbackMascot=document.getElementById("feedbackMascot"),feedbackLabel=document.getElementById("feedbackLabel"),feedbackText=document.getElementById("feedbackText"),nextButton=document.getElementById("nextButton"),resultModal=document.getElementById("resultModal"),confetti=document.getElementById("confettiContainer");

let questions=[],round=0,score=0,streak=0,answered=false,soundEnabled=localStorage.getItem(STORAGE.sound)!=="off",giraffeVoice=null;

function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function stars(){return Number(localStorage.getItem(STORAGE.stars)||0)}
function getProgress(){const p=JSON.parse(localStorage.getItem(STORAGE.progress)||"{}");return{games:Number(p.games||0),pairs:Number(p.pairs||0),wins:Number(p.wins||0),hardWins:Number(p.hardWins||0),animalGames:Number(p.animalGames||0),animalCorrect:Number(p.animalCorrect||0),animalPerfect:Number(p.animalPerfect||0),colorGames:Number(p.colorGames||0),colorCorrect:Number(p.colorCorrect||0),colorPerfect:Number(p.colorPerfect||0)}}
function saveProgress(p){localStorage.setItem(STORAGE.progress,JSON.stringify(p))}
function updateStars(){starCount.textContent=stars()}
function updateSound(){soundButton.textContent=soundEnabled?"🔊":"🔇"}

function loadVoice(){if(!("speechSynthesis" in window))return;const voices=window.speechSynthesis.getVoices(),preferred=["Francisca","Fernanda","Luciana","Leticia","Letícia","Maria","Google português do Brasil"];giraffeVoice=null;for(const name of preferred){const v=voices.find(x=>x.name.toLowerCase().includes(name.toLowerCase())&&x.lang.toLowerCase().startsWith("pt"));if(v){giraffeVoice=v;break}}if(!giraffeVoice)giraffeVoice=voices.find(v=>v.lang.toLowerCase().startsWith("pt-br"))||voices.find(v=>v.lang.toLowerCase().startsWith("pt"))||null}

function speak(text){if(!soundEnabled||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();if(!giraffeVoice)loadVoice();const u=new SpeechSynthesisUtterance(text);if(giraffeVoice)u.voice=giraffeVoice;u.lang="pt-BR";u.rate=.98;u.pitch=1.35;u.volume=1;window.speechSynthesis.speak(u)}

if("speechSynthesis" in window){loadVoice();window.speechSynthesis.onvoiceschanged=loadVoice}

function tone(freq,duration=.12,type="sine",volume=.06){if(!soundEnabled)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type=type;g.gain.value=volume;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.stop(c.currentTime+duration)}
function successSound(){tone(523,.14);setTimeout(()=>tone(659,.15),90);setTimeout(()=>tone(784,.17),180)}
function errorSound(){tone(240,.14,"triangle",.05);setTimeout(()=>tone(190,.15,"triangle",.05),110)}

function setMascot(image,message,type=""){mascotBox.classList.remove("success","try-again");if(type==="success")mascotBox.classList.add("success");if(type==="error")mascotBox.classList.add("try-again");mascotImage.classList.add("changing");mascotText.textContent=message;setTimeout(()=>{mascotImage.src=image;mascotImage.onload=()=>mascotImage.classList.remove("changing")},100)}

function colorQuestion(){
  const color=COLORS[Math.floor(Math.random()*COLORS.length)],shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
  return{type:"color",color,shape,answer:color.name,speech:`Qual é a cor desta forma?`,options:shuffle([color,...shuffle(COLORS.filter(c=>c.id!==color.id)).slice(0,3)])};
}

function shapeQuestion(){
  const shape=SHAPES[Math.floor(Math.random()*SHAPES.length)],color=COLORS[Math.floor(Math.random()*COLORS.length)];
  return{type:"shape",color,shape,answer:shape.name,speech:"Qual é o nome desta forma?",options:shuffle([shape,...shuffle(SHAPES.filter(s=>s.id!==shape.id)).slice(0,3)])};
}

function combinationQuestion(){
  const color=COLORS[Math.floor(Math.random()*COLORS.length)],shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
  const correct={name:`${shape.name} ${color.name}`,color,shape};
  const others=[];
  while(others.length<3){const c=COLORS[Math.floor(Math.random()*COLORS.length)],s=SHAPES[Math.floor(Math.random()*SHAPES.length)],name=`${s.name} ${c.name}`;if(name!==correct.name&&!others.some(o=>o.name===name))others.push({name,color:c,shape:s})}
  return{type:"combo",color,shape,answer:correct.name,speech:`Qual é o ${shape.name.toLowerCase()} ${color.name.toLowerCase()}?`,options:shuffle([correct,...others])};
}

function generateQuestions(){const q=[];for(let i=0;i<4;i++)q.push(colorQuestion());for(let i=0;i<3;i++)q.push(shapeQuestion());for(let i=0;i<3;i++)q.push(combinationQuestion());return shuffle(q)}

function applyMainShape(q){mainShape.className=`main-shape ${q.shape.id}`;mainShape.style.color=q.color.hex;if(q.shape.id==="triangle"){mainShape.style.background="transparent";mainShape.style.borderBottomColor=q.color.hex}else{mainShape.style.background=q.color.hex;mainShape.style.borderBottomColor=""}}

function renderOption(option,q){
  if(q.type==="color")return `<div class="answer-color" style="background:${option.hex}"></div><div class="answer-name">${option.name}</div>`;
  if(q.type==="shape")return `<div class="answer-shape ${option.id}"></div><div class="answer-name">${option.name}</div>`;
  const triangle=option.shape.id==="triangle"?`style="border-bottom-color:${option.color.hex}"`:`style="background:${option.color.hex}"`;
  return `<div class="answer-shape ${option.shape.id}" ${triangle}></div><div class="answer-name">${option.name}</div>`;
}

function renderQuestion(){
  answered=false;feedbackArea.classList.remove("show");const q=questions[round];roundEl.textContent=round+1;progressText.textContent=`${round+1} de 10`;progressBar.style.width=`${((round+1)/10)*100}%`;applyMainShape(q);
  if(q.type==="color"){questionTitle.textContent="Qual é a cor?";questionSubtitle.textContent="Observe a forma e escolha a cor correta.";challengeText.textContent="Que cor é esta?"}
  if(q.type==="shape"){questionTitle.textContent="Qual é a forma?";questionSubtitle.textContent="Observe e escolha o nome correto.";challengeText.textContent="Que forma é esta?"}
  if(q.type==="combo"){questionTitle.textContent="Encontre a combinação";questionSubtitle.textContent="Observe a cor e a forma.";challengeText.textContent=`Encontre: ${q.answer}`}
  answers.innerHTML="";
  q.options.forEach(option=>{const b=document.createElement("button");b.className="answer-button";b.dataset.answer=option.name;b.innerHTML=renderOption(option,q);b.addEventListener("click",()=>chooseAnswer(b,option.name,q));answers.appendChild(b)});
  setMascot(MASCOT.teach,"Observe com atenção e escolha a resposta!");
}

function chooseAnswer(button,chosen,q){
  if(answered)return;answered=true;document.querySelectorAll(".answer-button").forEach(b=>b.disabled=true);
  if(chosen===q.answer){button.classList.add("correct");score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;successSound();setMascot(MASCOT.happy,streak>=3?`Muito bem! ${streak} acertos seguidos! 🔥`:"Isso mesmo! Você acertou! ⭐","success");feedbackMascot.src=MASCOT.happy;feedbackLabel.textContent="Muito bem! ⭐";feedbackText.textContent=`A resposta é ${q.answer}.`}
  else{button.classList.add("wrong");streak=0;streakEl.textContent=0;document.querySelectorAll(".answer-button").forEach(b=>{if(b.dataset.answer===q.answer)b.classList.add("correct")});errorSound();setMascot(MASCOT.thinking,`Quase! A resposta é ${q.answer}.`,"error");feedbackMascot.src=MASCOT.thinking;feedbackLabel.textContent="Quase! 😊";feedbackText.textContent=`A resposta correta é ${q.answer}.`}
  feedbackArea.classList.add("show");nextButton.textContent=round===9?"Ver meu resultado 🏆":"Próxima rodada →";
}

function nextQuestion(){if(!answered)return;round++;if(round<10)renderQuestion();else finishGame()}
function rewardForScore(n){if(n===10)return 8;if(n>=8)return 5;if(n>=5)return 3;return 1}

function finishGame(){
  const reward=rewardForScore(score);localStorage.setItem(STORAGE.stars,stars()+reward);const p=getProgress();p.games++;p.colorGames++;p.colorCorrect+=score;if(score===10)p.colorPerfect++;if(score>=8)p.wins++;saveProgress(p);updateStars();
  document.getElementById("finalScore").textContent=score;document.getElementById("rewardText").textContent=`+${reward} ⭐`;const title=document.getElementById("resultTitle"),message=document.getElementById("resultMessage"),resultMascot=document.getElementById("resultMascot");
  if(score===10){title.textContent="Perfeito, Arthur!";message.textContent="Você acertou todas as cores e formas!";resultMascot.src=MASCOT.celebrate;createConfetti()}
  else if(score>=8){title.textContent="Excelente!";message.textContent="Você conhece muito bem as cores e formas!";resultMascot.src=MASCOT.celebrate;createConfetti()}
  else if(score>=5){title.textContent="Muito bem!";message.textContent="Você foi muito bem nessa aventura!";resultMascot.src=MASCOT.happy}
  else{title.textContent="Boa tentativa!";message.textContent="Vamos praticar mais um pouco?";resultMascot.src=MASCOT.thinking}
  resultModal.classList.add("show");
}

function createConfetti(){confetti.innerHTML="";const colors=["#5dade2","#7c4dff","#ffd34e","#58d68d","#ff7f7f"];for(let i=0;i<80;i++){const c=document.createElement("div");c.className="confetti";c.style.left=`${Math.random()*100}%`;c.style.background=colors[Math.floor(Math.random()*colors.length)];c.style.animationDuration=`${2.5+Math.random()*2}s`;c.style.animationDelay=`${Math.random()*.7}s`;confetti.appendChild(c)}setTimeout(()=>confetti.innerHTML="",5000)}

function startGame(){window.speechSynthesis?.cancel();questions=generateQuestions();round=0;score=0;streak=0;answered=false;scoreEl.textContent=0;streakEl.textContent=0;resultModal.classList.remove("show");feedbackArea.classList.remove("show");confetti.innerHTML="";renderQuestion()}

soundButton.addEventListener("click",()=>{soundEnabled=!soundEnabled;localStorage.setItem(STORAGE.sound,soundEnabled?"on":"off");updateSound();if(!soundEnabled)window.speechSynthesis?.cancel()});
listenButton.addEventListener("click",()=>speak(questions[round].speech));
nextButton.addEventListener("click",nextQuestion);
document.getElementById("playAgainButton").addEventListener("click",startGame);

updateStars();updateSound();startGame();