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

//physics
let velocityX = -3;
let velocityY = 0;
let gravity = 0.2;
let jumpHeight = 9;

//game
let gameover = false;
let score = 0;
let firstTime = true;
let setIntervalPlaceCactusID = null;
let stepCounter = 0;

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

  document.addEventListener("keydown", startGame);
  document.addEventListener("keydown", resetGame);

  document.addEventListener("keydown",moveDino);
  document.addEventListener("mousedown",moveDino);
}

function startGame(e){
  if(e.type === "keydown" && e.code === "KeyS"){
    
    if(firstTime == true){
      dinoImg.src = "./img/dino.png";
      context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
      requestAnimationFrame(update);
      setIntervalPlaceCactusID = setInterval(placeCactus,1000);
    }
    firstTime = false;
  }
}

function resetGame(e){
  if(e.type === "keydown" && e.code === "KeyR"){
    
    dinoImg.src = "./img/dino.png";

    context.clearRect(0,0,boardWidth,boardHeight);
    /*if(setIntervalPlaceCactusID !== null){
      clearInterval(setIntervalPlaceCactusID);
      setIntervalPlaceCactusID = null;
    }*/

    score = 0;
    velocityY = 0;
    cactusArray = [];

    context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);

    console.log(`1${gameover}`);
    if(firstTime == true || gameover == true){
      gameover = false;
      console.log(`${gameover}`);
      requestAnimationFrame(update);
      //setIntervalPlaceCactusID = setInterval(placeCactus,1000);
    }
    firstTime = false;

  }

}

function update(){
  if(gameover == true){
    return;
  }
  //dino
  context.clearRect(0,0,boardWidth,boardHeight);
  //setTimeout(update,1000/60);
  requestAnimationFrame(update);
  if(score%100 === 0 ||score%100 === 25 || score%100 === 50 || score%100 === 75)
    {
    stepCounter++;
  }
  console.log(1);
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
    /*
    cactusArray[i].x = cactusArray[i].x + velocityX;
    context.drawImage(cactusArray[i].img,cactusArray[i].x,cactusArray[i].y,
      cactusArray[i].width,cactusArray[i].height);
    */
    
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

  //score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score,5,20);

}

function placeCactus(){
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
         a.y + a.height - 20 > b.y;
}