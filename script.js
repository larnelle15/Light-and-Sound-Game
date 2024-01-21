// global variables here
let pattern = [2,2,1,3,4,1,2,4];
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;
let clueHoldTime = 1000;
let guessCounter = 0;
// how long to pause in between clues
const cluePauseTime = 333;
//how long to wait before starting playback of clue sequence
const nextClueWaitTime = 1000;
//creating a function for lighting a button
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit");
}
//creating a function for clearing the button
function clearButton(btn){
document.getElementById("button"+btn).classList.remove("lit");
}
//creating a function for playing a single clue
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}
//store the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");



// functions here
function startGame(){
//initialize game variables  
  progress = 0;
  gamePlaying = true;
  playClueSequence()
  //swap the start and stop buttons
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
}
 //creating a function to stop the game
function stopGame(){
  gamePlaying = false;
  stopBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
}

//console Logging
console.log(playClueSequence);
console.log(playSingleClue);
console.log(clearButton);
console.log(lightButton);
console.log(stopGame);
console.log(startGame);
console.log(playTone);
console.log(startTone);
console.log(stopTone);
//creating a function for playing a clue sequence
function playClueSequence(){
  context.resume();
//set delay to initial clue wait time
  let delay = nextClueWaitTime;
//setting guessCounter to zero
  guessCounter = 0;
//for each clue that is 
  for(let i = 0; i<=progress; i++){
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
//set a tiemout to play that clue
    setTimeout(playSingleClue,delay,pattern[i]);
    delay += clueHoldTime;
      delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);

  if(!gamePlaying){
    return;
  }

  if(btn == pattern[guessCounter]){
    //Guess was correct!
    guessCounter++;
    
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence(btn);
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
      playSingleClue(btn);
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    loseGame();
  }
}    


//creating a function for losing the game
function loseGame(){
  stopGame();
  alert("I'm sorry, you have lost the game :( Please try again.");
}

function winGame(){
  stopGame();
  alert("Congratulations, you have won the game :) Press start to play again!");
}


// Sound Synthesis Functions for Steps 6-8
const freqMap = {
  1: 400.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function(){
    stopTone();
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

