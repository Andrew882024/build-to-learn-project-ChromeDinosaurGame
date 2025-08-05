//test git version1
//add a test for github push
////////////////////////////////////////////////////////////////////////////////
//                           data for the game                                //
//////////////////////////////////////////////////////////////////////////////// 


//board
let board;
let boardWidth = 950;
let boardHeight = 350;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
let dinoImg2;
let dinoImg3;

let dino = {
  x : dinoX,
  y : dinoY,
  width : dinoWidth,
  height : dinoHeight
}

//cactus
let cactusArray = [];

let cactusHeight = 70;

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusX = 958;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//bird
let birdArray = [];
let birdHeight1 = 68*0.75;
let birdWidth1 = 97*0.75;
let birdX1 = 958;
let birdY1 = Math.random() * (boardHeight - birdHeight1 - 100);


let birdImg1;
let birdImg2;

let bird1 = {
  x : birdX1,
  y : birdY1,
  width : birdWidth1,
  height : birdHeight1
}

//physics
let velocityX = -3;
let velocityY = 0;
let gravity = 0.2;
let jumpHeight = 9;

//game
let gameover = false;
let score = 0;
let firstTime = true;
let setIntervalPlaceCactusAndBirdID = null;
let stepCounter = 0;
let flyCounter = 0;
let speedingUpScore = 500;

////////////////////////////////////////////////////////////////////////////////
//                                  action                                    //
////////////////////////////////////////////////////////////////////////////////

window.onload = ()=>{
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");// use for drawing on the board


  context.font = "30px courier";
    context.fillText("press S to start the game",boardWidth/2-240,boardHeight/2+10);

  //draw the dinosaur
  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";
  dinoImg2 = new Image();
  dinoImg2.src = "./img/dino-run1.png";
  dinoImg3 = new Image();
  dinoImg3.src = "./img/dino-run2.png";

  //draw cactus
  cactus1Img = new Image();
  cactus1Img.src = "./img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/cactus3.png";

  //draw bird
  birdImg1 = new Image();
  birdImg1.src = "./img/bird1.png";
  birdImg2 = new Image();
  birdImg2.src = "./img/bird2.png";

  document.addEventListener("keydown", startGame);
  document.addEventListener("keydown", resetGame);

  document.addEventListener("keydown",moveDino);
  document.addEventListener("mousedown",moveDino);
}

function startGame(e){
  if(e.type === "keydown" && e.code === "KeyS"){

    speedingUpScore = 500;
    velocityX = -3;
    
    if(firstTime == true){
      dinoImg.src = "./img/dino.png";
      context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
      requestAnimationFrame(update);
      setIntervalPlaceCactusAndBirdID = setInterval(placeCactusAndBird,1000);
    }
    firstTime = false;

  }
}

function resetGame(e){
  if(e.type === "keydown" && e.code === "KeyR"){
    
    dinoImg.src = "./img/dino.png";

    context.clearRect(0,0,boardWidth,boardHeight);
    if(setIntervalPlaceCactusAndBirdID !== null){
      clearInterval(setIntervalPlaceCactusAndBirdID);
      setIntervalPlaceCactusAndBirdID = null;
    }
    setIntervalPlaceCactusAndBirdID = setInterval(placeCactusAndBird,1000);

    score = 0;
    velocityY = 0;
    cactusArray = [];
    birdArray = [];
    speedingUpScore = 500;
    velocityX = -3;
    context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);

    console.log(`1${gameover}`);
    if(firstTime == true || gameover == true){
      gameover = false;
      console.log(`${gameover}`);
      requestAnimationFrame(update);
      //setIntervalPlaceCactusAndBirdID = setInterval(placeCactusAndBird,1000);
    }
    firstTime = false;

  }

}
////////////////////////////////////////////////////////////////////////////////
//                                functions                                   //
////////////////////////////////////////////////////////////////////////////////

function update(){
  if(gameover == true){
    return;
  }

  //speed up the game

  if(score === speedingUpScore){
    console.log(`speed up:${speedingUpScore}`);
    clearInterval(setIntervalPlaceCactusAndBirdID);
    setIntervalPlaceCactusAndBirdID = setInterval(placeCactusAndBird,Math.max(300,1000 - speedingUpScore/7));
    velocityX = velocityX - 1;
    velocityX = Math.max(velocityX,-10);
    speedingUpScore += 500;
  }
  //dino
  context.clearRect(0,0,boardWidth,boardHeight);
  //setTimeout(update,1000/60);
  
  requestAnimationFrame(update);
  
  if(score%100 === 0 ||score%100 === 25 || score%100 === 50 || score%100 === 75)
    {
    stepCounter++;
  }
  //console.log(1);
  velocityY = velocityY + gravity;
  dino.y = Math.min(dino.y + velocityY , dinoY);
  if(dino.y !== dinoY){
  context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
  }
  else if(stepCounter%2 === 0){
    context.drawImage(dinoImg2,dino.x,dino.y,dino.width,dino.height);
  }
  else{
    context.drawImage(dinoImg3,dino.x,dino.y,dino.width,dino.height);
  }
  //requestAnimationFrame(update);

  //cactus
  for(let i = 0; i<cactusArray.length; i++){
    
    let cactus = cactusArray[i];
    cactus.x = cactus.x + velocityX;
    context.drawImage(cactus.img,cactus.x,cactus.y,cactus.width,cactus.height);

    if(detectCollisionForCactus(dino,cactus)){
      console.log(2);
      gameover = true;
      dinoImg.src = "./img/dino-dead.png";
      dinoImg.onload = ()=>{
        context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
      }
      context.font = "50px courier";
      context.fillText("Game Over",boardWidth/2-150,boardHeight/2+5);
      context.font = "20px courier";
      context.fillText("press R to restart",boardWidth/2-125,boardHeight/2+30);
    }
  }

  //bird
  if(score%100 === 33 ||score%100 === 66 || score%100 === 99){
    flyCounter++;
  }
  for(let i = 0; i<birdArray.length; i++){
    let bird = birdArray[i];
    bird.x = bird.x + velocityX;
    if(flyCounter%2 === 0){
      context.drawImage(birdImg1,bird.x,bird.y,bird.width,bird.height);
    }
    else{
      context.drawImage(birdImg2,bird.x+3,bird.y-15,bird.width,bird.height);
    }   

    if(detectCollisionForBird(dino,bird)){
      console.log(2);
      gameover = true;
      dinoImg.src = "./img/dino-dead.png";
      dinoImg.onload = ()=>{
        context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
      }
      context.font = "50px courier";
      context.fillText("Game Over",boardWidth/2-150,boardHeight/2+5);
      context.font = "20px courier";
      context.fillText("press R to restart",boardWidth/2-125,boardHeight/2+30);
    }
  }
  console.log(`birdArray.length:${birdArray.length}`);

  //score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score,5,20);

}

//place cactus and bird
function placeCactusAndBird(){
  if(gameover == true){
    return;
  }
  
  let cactus = {
    img : null,
    x:cactusX,
    y:cactusY,
    height:cactusHeight,
    width: null
  }

  let determineNum = Math.random();
  if(determineNum>0.8){
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  }
  else if(determineNum>0.6){
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  }
  else if(determineNum>0.3){
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }
  

  if(cactusArray.length>8){
    cactusArray.shift();
  }

  let bird = {
    img : null,
    x: birdX1,
    y: 100 + Math.random() * (boardHeight - birdHeight1 - 100),
    width: birdWidth1,
    height: birdHeight1
  }
  if(score>1000){
    if(determineNum<0.3&&determineNum>0.1){
      bird.img = birdImg1;
      birdArray.push(bird);
    }

    if(birdArray.length>8){
      birdArray.shift();
    }
  }

}

//dino move
function moveDino(e){
  if(gameover == true){
    return;
  }

  if((e.type === "mousedown")||((e.type === "keydown")&&((e.code === "Space")||
    (e.code === "ArrowUp")||(e.code === "keyW")))){
      if(dinoY === dino.y){
        velocityY = -jumpHeight;
      }
  }
}

function detectCollision(a,b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function detectCollisionForCactus(a,b){
  return a.x+5 < b.x + b.width - 5 &&
         a.x + a.width - 5 > b.x +5 &&
         a.y < b.y + b.height &&
         a.y + a.height - 15 > b.y;
}

function detectCollisionForBird(a,b){
  return a.x + 5 < b.x + b.width - 5 &&
         a.x + a.width - 5 > b.x + 5&&
         a.y + 10 < b.y + b.height - 5 &&
         a.y + a.height - 20 > b.y;
}