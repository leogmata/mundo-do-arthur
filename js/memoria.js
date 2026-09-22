const STORAGE={stars:"mundoArthurStars",sound:"mundoArthurSound",progress:"mundoArthurProgress",achievements:"mundoArthurAchievements"};
const allAnimals=["🐶","🐱","🦁","🐵","🐸","🐼","🐯","🐰","🐨","🐮"];
const LEVELS={easy:{pairs:6,reward:3},medium:{pairs:8,reward:5},hard:{pairs:10,reward:8}};
const MASCOT_IMAGES={
start:"assets/mascote/girafinha_inicio.png",
success:"assets/mascote/girafinha_feliz.png",
error:"assets/mascote/girafinha_pensativa.png",
victory:"assets/mascote/girafinha_comemorando.png",
thinking:"assets/mascote/girafinha_piscando.png",
achievement:"assets/mascote/girafinha_conquista.png"
};
const ACHIEVEMENTS=[
{id:"firstGame",name:"Primeira Aventura",check:p=>p.games>=1},
{id:"tenPairs",name:"Boa Memória",check:p=>p.pairs>=10},
{id:"fiveWins",name:"Campeão",check:p=>p.wins>=5},
{id:"twentyFiveStars",name:"Colecionador",check:p=>p.stars>=25},
{id:"memoryMaster",name:"Mestre da Memória",check:p=>p.hardWins>=3}
];
const MESSAGES={
start:["Vamos encontrar todos os pares?","Observe bem as cartinhas!","Estou torcendo por você!"],
success:["Muito bem! Você encontrou um par! ⭐","Uau! Você acertou! 🎉","Excelente memória! 🧠","Isso aí! Mais um par!"],
error:["Quase! Tente lembrar onde eles estão.","Não foi dessa vez. Vamos tentar novamente!","Observe bem. Você consegue! 😊"],
victory:["Você conseguiu! Estou muito feliz! 🎉","Fantástico! Todos os pares encontrados!","Que memória incrível! ⭐"]
};

const board=document.getElementById("memoryBoard"),movesEl=document.getElementById("moves"),pairsEl=document.getElementById("pairsFound"),pairsTotal=document.getElementById("pairsTotal"),starCount=document.getElementById("starCount"),victoryModal=document.getElementById("victoryModal"),victoryReward=document.getElementById("victoryReward"),soundButton=document.getElementById("soundButton"),mascotText=document.getElementById("mascotText"),mascotBox=document.querySelector(".mascot-box"),mascotImage=document.getElementById("mascotImage"),confettiContainer=document.getElementById("confettiContainer"),achievementToast=document.getElementById("achievementToast");
let level="easy",activeAnimals=[],firstCard=null,secondCard=null,locked=false,moves=0,pairsFound=0,victoryGiven=false,gameStarted=false,soundEnabled=localStorage.getItem(STORAGE.sound)!=="off";

function getProgress(){const p=JSON.parse(localStorage.getItem(STORAGE.progress)||"{}");return{games:Number(p.games||0),pairs:Number(p.pairs||0),wins:Number(p.wins||0),hardWins:Number(p.hardWins||0)}}
function saveProgress(p){localStorage.setItem(STORAGE.progress,JSON.stringify(p))}
function stars(){return Number(localStorage.getItem(STORAGE.stars)||0)}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function randomMessage(type){const a=MESSAGES[type];return a[Math.floor(Math.random()*a.length)]}

function setMascot(type){mascotBox.classList.remove("success","try-again");if(type==="success")mascotBox.classList.add("success");if(type==="error")mascotBox.classList.add("try-again");mascotText.textContent=randomMessage(type);mascotImage.classList.add("changing");setTimeout(()=>{mascotImage.src=MASCOT_IMAGES[type]||MASCOT_IMAGES.start;mascotImage.onload=()=>mascotImage.classList.remove("changing")},120)}
function updateStars(){starCount.textContent=stars()}
function updateSound(){soundButton.textContent=soundEnabled?"🔊":"🔇"}
function playTone(freq,duration=.12,type="sine",volume=.07){if(!soundEnabled)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.value=volume;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.stop(c.currentTime+duration)}
function successSound(){playTone(523,.15);setTimeout(()=>playTone(659,.16),100);setTimeout(()=>playTone(784,.18),200)}
function errorSound(){playTone(230,.15,"triangle",.05);setTimeout(()=>playTone(190,.16,"triangle",.05),120)}
function victorySound(){[523,659,784,1046].forEach((n,i)=>setTimeout(()=>playTone(n,.28),i*150))}

function showAchievement(a){document.getElementById("achievementToastName").textContent=a.name;achievementToast.classList.add("show");setTimeout(()=>achievementToast.classList.remove("show"),3000)}
function checkAchievements(){const p=getProgress(),data={...p,stars:stars()},unlocked=JSON.parse(localStorage.getItem(STORAGE.achievements)||"[]");let newly=null;ACHIEVEMENTS.forEach(a=>{if(a.check(data)&&!unlocked.includes(a.id)){unlocked.push(a.id);if(!newly)newly=a}});localStorage.setItem(STORAGE.achievements,JSON.stringify(unlocked));if(newly)setTimeout(()=>showAchievement(newly),350)}
function registerGameStart(){if(gameStarted)return;gameStarted=true;const p=getProgress();p.games++;saveProgress(p);checkAchievements()}
function registerPair(){const p=getProgress();p.pairs++;saveProgress(p);checkAchievements()}

function prepareLevel(){activeAnimals=allAnimals.slice(0,LEVELS[level].pairs);pairsTotal.textContent=LEVELS[level].pairs;victoryReward.textContent=`+${LEVELS[level].reward} estrelinhas`}
function adjustBoard(){board.style.gridTemplateColumns=activeAnimals.length<=6?"repeat(4,minmax(0,1fr))":"repeat(5,minmax(0,1fr))"}
function createBoard(){board.innerHTML="";adjustBoard();shuffle([...activeAnimals,...activeAnimals]).forEach(animal=>{const card=document.createElement("button");card.className="memory-card";card.dataset.animal=animal;card.innerHTML=`<div class="card-inner"><div class="card-face card-front"></div><div class="card-face card-back">${animal}</div></div>`;card.addEventListener("click",handleCardClick);board.appendChild(card)})}

function handleCardClick(){if(locked||this===firstCard||this.classList.contains("matched"))return;registerGameStart();playTone(440,.07,"sine",.04);this.classList.add("flipped");if(!firstCard){firstCard=this;return}secondCard=this;moves++;movesEl.textContent=moves;firstCard.dataset.animal===secondCard.dataset.animal?handleMatch():handleMismatch()}
function handleMatch(){firstCard.classList.add("matched");secondCard.classList.add("matched");firstCard.classList.remove("flipped");secondCard.classList.remove("flipped");pairsFound++;pairsEl.textContent=pairsFound;registerPair();successSound();setMascot("success");resetTurn();if(pairsFound===activeAnimals.length)setTimeout(showVictory,700)}
function handleMismatch(){locked=true;errorSound();setMascot("error");setTimeout(()=>{firstCard?.classList.remove("flipped");secondCard?.classList.remove("flipped");resetTurn()},850)}
function resetTurn(){firstCard=null;secondCard=null;locked=false}

function giveReward(){localStorage.setItem(STORAGE.stars,stars()+LEVELS[level].reward);const p=getProgress();p.wins++;if(level==="hard")p.hardWins++;saveProgress(p);updateStars();checkAchievements()}
function createConfetti(){confettiContainer.innerHTML="";const colors=["#7c4dff","#ffd34e","#ff7f7f","#58d68d","#5dade2","#ff9ff3"];for(let i=0;i<90;i++){const c=document.createElement("div");c.className="confetti";c.style.left=`${Math.random()*100}%`;c.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)];c.style.animationDuration=`${2.5+Math.random()*2}s`;c.style.animationDelay=`${Math.random()*.8}s`;confettiContainer.appendChild(c)}setTimeout(()=>confettiContainer.innerHTML="",5200)}
function showVictory(){if(!victoryGiven){giveReward();victoryGiven=true}setMascot("victory");victorySound();createConfetti();victoryModal.classList.add("show")}
function restartGame(){moves=0;pairsFound=0;firstCard=null;secondCard=null;locked=false;victoryGiven=false;gameStarted=false;movesEl.textContent="0";pairsEl.textContent="0";victoryModal.classList.remove("show");confettiContainer.innerHTML="";prepareLevel();createBoard();setMascot("start")}
function changeLevel(newLevel){level=newLevel;document.querySelectorAll(".difficulty-button").forEach(b=>b.classList.toggle("active",b.dataset.level===level));restartGame()}

soundButton.addEventListener("click",()=>{soundEnabled=!soundEnabled;localStorage.setItem(STORAGE.sound,soundEnabled?"on":"off");updateSound();if(soundEnabled)successSound()});
document.querySelectorAll(".difficulty-button").forEach(b=>b.addEventListener("click",()=>changeLevel(b.dataset.level)));
document.getElementById("restartButton").addEventListener("click",restartGame);
document.getElementById("playAgainButton").addEventListener("click",restartGame);

updateStars();
updateSound();
prepareLevel();
createBoard();
setMascot("start");