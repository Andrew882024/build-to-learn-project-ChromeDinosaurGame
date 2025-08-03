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

////////////////////////////////////////////////////////////////////////////////
//                                  action                                    //
////////////////////////////////////////////////////////////////////////////////

window.onload = ()=>{
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");// use for drawing on the board

  //draw the dinosaur
  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";

  

  

  //draw cactus
  cactus1Img = new Image();
  cactus1Img.src = "./img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/cactus3.png";

  document.addEventListener("keydown", startGame);
}

function startGame(e){
  if(e.type === "keydown" && e.code === "KeyS"){
    dinoImg.onload = ()=>{
      context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
    }

    //setInterval(update,1000/60);
    requestAnimationFrame(update);
    //setTimeout(update,1000/60);

    setInterval(placeCactus,1000);

    document.addEventListener("keydown",moveDino);
    document.addEventListener("click",moveDino);
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
  console.log(1);
  velocityY = velocityY + gravity;
  dino.y = Math.min(dino.y + velocityY , dinoY);
  context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
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
  if(determineNum>0.9){
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  }
  else if(determineNum>0.7){
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  }
  else if(determineNum>0.5){
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

  if((e.type === "click")||((e.type === "keydown")&&((e.code === "Space")||
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
         a.y + a.height - 30 > b.y;
}