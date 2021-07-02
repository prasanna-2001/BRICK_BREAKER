var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


//imagess used
//bgimg
var BG_IMG = new Image();//var BG_IMG = new Image(400,500); pparametr dal sakte but mere cas  me effect nhi pada
BG_IMG.src = "bg.png";
//stats image 
var LEVEL_IMG = new Image();
LEVEL_IMG.src="lEVEL.png";
var LIFE_IMG = new Image();
LIFE_IMG.src="life.png";
var SCORE_IMG = new Image();
SCORE_IMG.src="score.png";


//audios used
const Wall_ball = new Audio();
Wall_ball.src = "wallball.wav";//done
const Ball_brick = new Audio();
Ball_brick.src = "brickball.wav";//done
const Die = new Audio();
Die.src = "gameover.wav";//done
const Hitter_ball = new Audio();
Hitter_ball.src = "hitterball.wav";//done
const Level_up = new Audio();
Level_up.src = "levelup.wav";//done
const Win_win = new Audio();
Win_win.src = "win.wav";//done





// console.log(ctx);
canvas.style.border = "2px solid #0ff";

// widthof hitter border
ctx.lineWidth = 3;

//hiting object 
const hitter_height = 20;
const hitter_width = 100;
const hitter_margin_b = 50;
let rightArrow = false;
let leftArrow = false;
const ballRadius = 8;
let life = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let winIndicator = false;

const hitter = {
    x : canvas.width/2 - hitter_width/2,
    y : canvas.height - hitter_margin_b - hitter_height,
    width: hitter_width, 
    height: hitter_height,
    dx:7
}
//structure of  ball
const ball = {
    x : canvas.width/2,
    y : hitter.y - ballRadius,
    radius : ballRadius,
    speed : 7,
    dx : 5 * (Math.random()* 2 - 1),
    dy : -5
}


//structure of bricks
const brick = {
    row : 1,
    column: 5,
    width:55,
    height:20,
    offsetLeft: 20,
    offsetTop: 20,
    marginTop: 15,
    fillColor: '#2e3548',
    strokeColor : "#FFF"
}
let bricks = [];
function createBricks(){
    for(let r=0; r<brick.row; r++) {
        bricks[r] = [];
        for(let c=0; c<brick.column; c++) {
            bricks[r][c] = { 
            x: 0, 
            y: 0, 
            status: true 
            }
        
        }
      
    }
}
createBricks();

//draw brick
function drawBricks() {
    for(let r=0; r<brick.row; r++) {
      for(let c=0; c<brick.column; c++) {
        if( bricks[r][c].status == true ) {
          var brickX = (c * (brick.width + brick.offsetLeft))+brick.offsetTop;
          var brickY = (r * (brick.height + brick.offsetTop))+brick.offsetTop + brick.marginTop;
          bricks[r][c].x = brickX;
          bricks[r][c].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brick.width, brick.height);
          ctx.fillStyle = "#999999";
          ctx.fill();
          ctx.closePath();
        //   ctx.strokeStyle = brick.strokeColor;
          ctx.strokeStyle='#000000';
          ctx.strokeRect(brickX, brickY, brick.width, brick.height);
        }
      }
    }
  }

//ball brick colllision
function ballBrickCollission(){
    for(let r=0; r<brick.row; r++) {
        for(let c=0; c<brick.column; c++) {
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    Ball_brick.play();
                    ball.dy = - ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT
                }
            //     if(SCORE == SCORE_UNIT*30) {
            //         Win_win.play();
            // youWin = document.querySelector('.youWin');
            // youWin.style.visibility = 'visible';
            //         document.location.reload();
            //         clearInterval(interval); // Needed for Chrome to end game
            //     }
            }
    }
  }
}


function draw_hitter(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(hitter.x, hitter.y, hitter.width, hitter.height);
    ctx.strokeStyle='#afcd00';
    ctx.strokeRect(hitter.x, hitter.y, hitter.width, hitter.height)
}

//CONTROLLING MOUSE
document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){
        leftArrow = true;
    }
    else if(event.keyCode == 39){
        rightArrow = true;
    }
});
document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){
        leftArrow = false;
    }
    else if(event.keyCode == 39){
        rightArrow = false;
    }
});
function moveHitter(){
    if(rightArrow && hitter.x + hitter.width<canvas.width){
        hitter.x += hitter.dx;
    }
    else if(leftArrow && hitter.x>0){
        hitter.x -= hitter.dx;
    }
}

//draw the ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";

    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
}

// mobving the ball
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy; 
}

//ball and the hitter collison
function ballHitterCollission(){
    if(ball.x < hitter.x + hitter.width && ball.x > hitter.x && hitter.y < hitter.y + hitter.height && ball.y > hitter.y){
        //audio
        Hitter_ball.play();
        
        //collision point
        let collidepoint = ball.x - (hitter.x + hitter.width/2);
        collidepoint = collidepoint / (hitter.width/2);
        let angle = collidepoint * Math.PI/3;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

//ball colllisinn with the wall
function ballWallCollission(){
    //sidewalls
    if(ball.x + ballRadius > canvas.width || ball.x - ball.radius<0){
        ball.dx = - ball.dx;
        Wall_ball.play();
    }
    //topwall
    if(ball.y - ballRadius < 0 ){
        ball.dy = - ball.dy;
        Wall_ball.play();
    }
    //life decrement
    if(ball.y + ballRadius > canvas.height){
        life --;
        //lifelooseaudio


        resetBall();
    }

}

//resetbal func
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = hitter.y - ballRadius;
    ball.dx = 5 * (Math.random()* 2 - 1);
    ball.dy = -5;
}






//to show score ad the lifes and the levels

function showGameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "#FFF";
    ctx.font = "17px 'Press Start 2p',cursive";
    ctx.fillText(text, textX, textY);

    //draw img
    ctx.drawImage(img, imgX, imgY, width=25, height=25);
}
// draw_hitter
function draw(){
    draw_hitter();
    drawBall();
    drawBricks();
    //score
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    //lives
    showGameStats(life, canvas.width - 25, 25, LIFE_IMG, canvas.width - 55, 5);
    //levls
    showGameStats(LEVEL, canvas.width/2 , 25, LEVEL_IMG, canvas.width/2 - 30, 5);
}

function gameover(){
    //game ove fynctionality
    if(life <= 0){
        //gameover audio
        Die.play();
        gameover = document.querySelector('.gameover');
        gameover.style.visibility = 'visible';
    }
}
//we win function 
function weWin(){
    Win_win.play();
    youWin = document.querySelector('.youWin'); 
    youWin.style.visibility = 'visible';
    winnotification = document.querySelector('.winnotification'); 
    winnotification.style.visibility = 'visible';
}
// levelup function`
function levelUp(){
    let isLevelDone = true;

    //if al brcks are broken or not to increase the level
    for(let r=0; r<brick.row; r++) {
        for(let c=0; c<brick.column; c++) {
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }

    if(isLevelDone){
        if(LEVEL >= MAX_LEVEL){
            winIndicator = true;
            weWin();
        }
        Level_up.play();
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}



function update(){
    // hitter.y-=10;
    moveHitter();
    moveBall();
    ballWallCollission();
    ballHitterCollission();
    ballBrickCollission();
    levelUp();
    gameover();
}
update();

// game loop
function loop(){
    ctx.drawImage(BG_IMG, 0,0)
    draw();
    update();
    if(winIndicator == false){
        requestAnimationFrame(loop); //to endstop the ball and evey animation  on win
    }

    //agar variable banaya hota gameover ka false karke
    //thengame ko ovr per rokne ke liye 
//     if(!gameover){
//         requestAnimationFrame(loop);
//     }
//yaha apan ne htm se impot kiya isliye jarurat nhi padi
}
loop();
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - hitter.width/2;
    }
}

