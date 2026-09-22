const STORAGE={stars:"mundoArthurStars",sound:"mundoArthurSound",progress:"mundoArthurProgress"};
const MASCOT={teach:"assets/mascote/girafinha_ensinando.png",happy:"assets/mascote/girafinha_feliz.png",thinking:"assets/mascote/girafinha_pensativa.png",celebrate:"assets/mascote/girafinha_comemorando.png"};

const OBJECTS=["⭐","🍎","⚽","🐟","🌸","🚗","🦋","🍓","🐶","🟣"];

const answers=document.getElementById("answerGrid"),mainNumber=document.getElementById("mainNumber"),objectsArea=document.getElementById("objectsArea"),challengeText=document.getElementById("challengeText"),questionTitle=document.getElementById("questionTitle"),questionSubtitle=document.getElementById("questionSubtitle"),roundEl=document.getElementById("roundNumber"),scoreEl=document.getElementById("score"),streakEl=document.getElementById("streak"),progressBar=document.getElementById("progressBar"),progressText=document.getElementById("progressText"),starCount=document.getElementById("starCount"),soundButton=document.getElementById("soundButton"),listenButton=document.getElementById("listenButton"),mascotImage=document.getElementById("mascotImage"),mascotText=document.getElementById("mascotText"),mascotBox=document.querySelector(".mascot-box"),feedbackArea=document.getElementById("feedbackArea"),feedbackMascot=document.getElementById("feedbackMascot"),feedbackLabel=document.getElementById("feedbackLabel"),feedbackText=document.getElementById("feedbackText"),nextButton=document.getElementById("nextButton"),resultModal=document.getElementById("resultModal"),confetti=document.getElementById("confettiContainer");

let questions=[],round=0,score=0,streak=0,answered=false,soundEnabled=localStorage.getItem(STORAGE.sound)!=="off",giraffeVoice=null;

function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function random(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function stars(){return Number(localStorage.getItem(STORAGE.stars)||0)}
function updateStars(){starCount.textContent=stars()}
function updateSound(){soundButton.textContent=soundEnabled?"🔊":"🔇"}

function getProgress(){const p=JSON.parse(localStorage.getItem(STORAGE.progress)||"{}");return{...p,games:Number(p.games||0),wins:Number(p.wins||0),numbersGames:Number(p.numbersGames||0),numbersCorrect:Number(p.numbersCorrect||0),numbersPerfect:Number(p.numbersPerfect||0)}}
function saveProgress(p){localStorage.setItem(STORAGE.progress,JSON.stringify(p))}

function loadVoice(){if(!("speechSynthesis" in window))return;const voices=speechSynthesis.getVoices(),preferred=["Francisca","Fernanda","Luciana","Leticia","Letícia","Maria","Google português do Brasil"];giraffeVoice=null;for(const name of preferred){const v=voices.find(x=>x.name.toLowerCase().includes(name.toLowerCase())&&x.lang.toLowerCase().startsWith("pt"));if(v){giraffeVoice=v;break}}if(!giraffeVoice)giraffeVoice=voices.find(v=>v.lang.toLowerCase().startsWith("pt-br"))||voices.find(v=>v.lang.toLowerCase().startsWith("pt"))||null}

function speak(text){if(!soundEnabled||!("speechSynthesis" in window))return;speechSynthesis.cancel();if(!giraffeVoice)loadVoice();const u=new SpeechSynthesisUtterance(text);if(giraffeVoice)u.voice=giraffeVoice;u.lang="pt-BR";u.rate=.96;u.pitch=1.35;speechSynthesis.speak(u)}
if("speechSynthesis" in window){loadVoice();speechSynthesis.onvoiceschanged=loadVoice}

function tone(f,d=.12){if(!soundEnabled)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.stop(c.currentTime+d)}
function successSound(){tone(523,.14);setTimeout(()=>tone(659,.15),90);setTimeout(()=>tone(784,.17),180)}
function errorSound(){tone(230,.14);setTimeout(()=>tone(190,.15),110)}

function setMascot(image,message,type=""){mascotBox.classList.remove("success","try-again");if(type==="success")mascotBox.classList.add("success");if(type==="error")mascotBox.classList.add("try-again");mascotText.textContent=message;mascotImage.classList.add("changing");mascotImage.onload=()=>mascotImage.classList.remove("changing");mascotImage.src=image;setTimeout(()=>mascotImage.classList.remove("changing"),350)}

function numberOptions(correct,max=20){const values=[correct];while(values.length<4){const n=random(1,max);if(!values.includes(n))values.push(n)}return shuffle(values)}

function makeRecognition(){const n=random(1,20);return{type:"number",answer:n,speech:`Qual é este número? É o número ${n}.`,options:numberOptions(n)}}
function makeCounting(){const n=random(1,10),emoji=OBJECTS[Math.floor(Math.random()*OBJECTS.length)];return{type:"count",answer:n,emoji,speech:`Conte os objetos. Quantos existem?`,options:numberOptions(n,10)}}
function makeSpoken(){const n=random(1,20);return{type:"spoken",answer:n,speech:`Encontre o número ${n}.`,options:numberOptions(n)}}

function generateQuestions(){const q=[];for(let i=0;i<4;i++)q.push(makeRecognition());for(let i=0;i<3;i++)q.push(makeCounting());for(let i=0;i<3;i++)q.push(makeSpoken());return shuffle(q)}

function renderQuestion(){
answered=false;feedbackArea.classList.remove("show");const q=questions[round];
roundEl.textContent=round+1;progressText.textContent=`${round+1} de 10`;progressBar.style.width=`${(round+1)*10}%`;
mainNumber.classList.remove("hidden");objectsArea.classList.remove("show");objectsArea.innerHTML="";

if(q.type==="number"){
questionTitle.textContent="Qual é este número?";
questionSubtitle.textContent="Observe e escolha a resposta.";
mainNumber.textContent=q.answer;
challengeText.textContent="Que número é este?";
}

if(q.type==="count"){
questionTitle.textContent="Quantos objetos existem?";
questionSubtitle.textContent="Conte com calma.";
mainNumber.classList.add("hidden");
objectsArea.classList.add("show");
objectsArea.innerHTML=Array.from({length:q.answer},()=>`<span>${q.emoji}</span>`).join("");
challengeText.textContent="Quantos você contou?";
}

if(q.type==="spoken"){
questionTitle.textContent="Escute a Girafinha";
questionSubtitle.textContent="Ouça o número e escolha.";
mainNumber.classList.add("hidden");
challengeText.textContent="Qual número a Girafinha falou?";
}

answers.innerHTML="";
q.options.forEach(n=>{const b=document.createElement("button");b.className="answer-button";b.textContent=n;b.dataset.answer=n;b.addEventListener("click",()=>chooseAnswer(b,n,q));answers.appendChild(b)});
setMascot(MASCOT.teach,q.type==="count"?"Conte devagar. Você consegue!":q.type==="spoken"?"Clique para ouvir o número!":"Observe bem o número!");
}

function chooseAnswer(button,chosen,q){
if(answered)return;answered=true;speechSynthesis?.cancel();document.querySelectorAll(".answer-button").forEach(b=>b.disabled=true);
if(chosen===q.answer){button.classList.add("correct");score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;successSound();setMascot(MASCOT.happy,streak>=3?`${streak} acertos seguidos! 🔥`:`Isso! A resposta é ${q.answer}!`,"success");feedbackMascot.src=MASCOT.happy;feedbackLabel.textContent="Muito bem! ⭐";feedbackText.textContent=`A resposta é ${q.answer}.`}
else{button.classList.add("wrong");streak=0;streakEl.textContent=0;document.querySelectorAll(".answer-button").forEach(b=>{if(Number(b.dataset.answer)===q.answer)b.classList.add("correct")});errorSound();setMascot(MASCOT.thinking,`Quase! A resposta é ${q.answer}.`,"error");feedbackMascot.src=MASCOT.thinking;feedbackLabel.textContent="Quase! 😊";feedbackText.textContent=`A resposta correta é ${q.answer}.`}
feedbackArea.classList.add("show");nextButton.textContent=round===9?"Ver meu resultado 🏆":"Próxima rodada →";
}

function nextQuestion(){if(!answered)return;round++;round<10?renderQuestion():finishGame()}
function reward(n){if(n===10)return 8;if(n>=8)return 5;if(n>=5)return 3;return 1}

function finishGame(){
const r=reward(score);localStorage.setItem(STORAGE.stars,stars()+r);const p=getProgress();p.games++;p.numbersGames++;p.numbersCorrect+=score;if(score===10)p.numbersPerfect++;if(score>=8)p.wins++;saveProgress(p);updateStars();
document.getElementById("finalScore").textContent=score;document.getElementById("rewardText").textContent=`+${r} ⭐`;const title=document.getElementById("resultTitle"),msg=document.getElementById("resultMessage"),img=document.getElementById("resultMascot");
if(score===10){title.textContent="Perfeito, Arthur!";msg.textContent="Você acertou todos os números!";img.src=MASCOT.celebrate;createConfetti()}
else if(score>=8){title.textContent="Excelente!";msg.textContent="Você conhece muito bem os números!";img.src=MASCOT.celebrate;createConfetti()}
else if(score>=5){title.textContent="Muito bem!";msg.textContent="Você contou e reconheceu muitos números!";img.src=MASCOT.happy}
else{title.textContent="Boa tentativa!";msg.textContent="Vamos brincar novamente com os números?";img.src=MASCOT.thinking}
resultModal.classList.add("show");
}

function createConfetti(){confetti.innerHTML="";const colors=["#36b6a6","#7c4dff","#ffd34e","#58d68d","#5dade2"];for(let i=0;i<80;i++){const c=document.createElement("div");c.className="confetti";c.style.left=`${Math.random()*100}%`;c.style.background=colors[Math.floor(Math.random()*colors.length)];c.style.animationDuration=`${2.5+Math.random()*2}s`;c.style.animationDelay=`${Math.random()*.7}s`;confetti.appendChild(c)}setTimeout(()=>confetti.innerHTML="",5000)}

function startGame(){speechSynthesis?.cancel();questions=generateQuestions();round=0;score=0;streak=0;scoreEl.textContent=0;streakEl.textContent=0;resultModal.classList.remove("show");renderQuestion()}

listenButton.addEventListener("click",()=>speak(questions[round].speech));
nextButton.addEventListener("click",nextQuestion);
document.getElementById("playAgainButton").addEventListener("click",startGame);
soundButton.addEventListener("click",()=>{soundEnabled=!soundEnabled;localStorage.setItem(STORAGE.sound,soundEnabled?"on":"off");updateSound();if(!soundEnabled)speechSynthesis?.cancel()});

updateStars();updateSound();startGame();