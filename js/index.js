let obstacles =  [];
let frames = 0;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = 'images/road.png'

const backgroundImage = {
    image: image, 
    x: 0,
    
    draw: function(){
        ctx.drawImage(this.image, this.x, 0, canvas.width, canvas.height);
        
    }
}
let interval= 0
function updateCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundImage.draw();
    player.draw();
    interval = requestAnimationFrame(updateCanvas, 10);
    updateObstacles();
    checkGameOver();
    score();
    

}


function startGame() {
    updateCanvas();
  }


function stop() {
  cancelAnimationFrame(interval)
}

class Car {
  constructor(){// could had parameters to have it starting at xy position passed as arguments
      this.x = canvas.width - 150;
      this.y = canvas.height - 200;

      const image = new Image();
      image.addEventListener('load', () => {
          this.image = image
      });
      image.src = 'images/car.png'
  }

  moveLeft(){
      this.x -= 25;
  }
  moveRight(){
      this.x += 25;
  }
  draw(){
      ctx.drawImage(this.image, this.x, this.y, 50, 100);
  }
  left() {
    return this.x;
}
right() {
    return this.x //+ this.width;
}
top() {
    return this.y;
}
bottom() {
    return this.y //+ this.height;
}
crashWith(obstacle) {
    return !(this.bottom() < obstacle.top() || 
            this.top() > obstacle.bottom() || 
            this.right() < obstacle.left() ||
            this.left() > obstacle.right())
}
}

function score(){
  const points = Math.floor(frames / 10);
  ctx.font = '30px serif';
  ctx.fillStyle = 'yellow';
  ctx.fillText(`Score: ${points}`, 300, 50)
}

class Component {
  constructor(width, height, color, x, y) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
      //this.speedX = 0;
      //this.speedY = 0;
  }
  update() {  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  left() {
      return this.x;
  }
  right() {
      return this.x + this.width;
  }
  top() {
      return this.y;
  }
  bottom() {
      return this.y + this.height;
  }
  crashWith(obstacle) {
      return !(this.bottom() < obstacle.top() || 
              this.top() > obstacle.bottom() || 
              this.right() < obstacle.left() ||
              this.left() > obstacle.right())
  }
}

let player = new Car();

document.addEventListener('keydown', e => {
  switch(e.keyCode){
    case 37:
      player.moveLeft();
      break;
    case 39:
      player.moveRight();
      break;
  }
  updateCanvas();
});

function updateObstacles() {
  for(let i = 0; i < obstacles.length; i++) {
      obstacles[i].y += 4;
      obstacles[i].update();
  }
  frames+=1;
  if (frames % 200 === 0) {   
      let minWidth = 100;
      let maxWidth = 200;
      let width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
    
      let position = Math.floor(Math.random() * canvas.width);
      obstacles.push(
          new Component(width, 20, 'red', position, 0
      ));
  }
}


function gameOver(){
  ctx.font = '50px serif';
  ctx.fillStyle = 'red';
  ctx.fillText(`GAME OVER`,100, canvas.height / 2)
}

function checkGameOver() {
  const crashed = obstacles.some((obstacle)=> {
      return player.crashWith(obstacle);
  });
  if (crashed) {
      stop();
      gameOver()
  }
}