const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var player, playerBase, playerMage;
var playerMagic = [];
var board1, board2;
var numberOfMana = 200;

function preload() {
  backgroundImg = loadImage("./assets/background.jpeg");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, 650, 250, 250);
  player = new Player(310, playerBase.body.position.y -100, 400, 230);
  playerMage = new PlayerArcher(370, playerBase.body.position.y -120, 280, 160);

  board1 = new Board(width -300, 330, 50, 200);
  board2 = new Board(width -550, height - 300, 50, 200);
}

function draw(){
  background(backgroundImg);

  Engine.update(engine);

  playerBase.display();
  player.display();
  playerMage.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerMagic.length; i++){
    if (playerMagic[i] !== undefined) {
      playerMagic[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerMagic[i].body
      );
      
      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerMagic[i].body
      );

      if (board1Collision.collided || board2Collision.collided){
        console.log("Collided");
      }

      var posX = playerMagic[i].body.position.x;
      var posY = playerMagic[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerMagic[i].isRemoved) {
          playerMagic[i].remove(i);
        }
      }
    }
  }

  // Título
  fill("violet");
  textAlign("center");
  textSize(40);
  text("MAGO ÉPICO", width / 2, 100);

  // Contagem de flechas
  fill("SkyBlue");
  textAlign("center");
  textSize(30);
  text("Mana restante: " + numberOfMana, 200, 100);
}

function keyPressed(){
  if(keyCode === 69){
    if(numberOfMana > 0){
      var posX = playerMage.body.position.x;
      var posY = playerMage.body.position.y;
      var angle = playerMage.body.angle;

      var arrow = new PlayerArrow(posX+45, posY, 90, 80, angle);

      Matter.Body.setAngle(arrow.body, angle);
      playerMagic.push(arrow);
      numberOfMana -= 10;
    }
  }
}

function keyReleased(){
  if(keyCode === 69){
    if(playerMagic.length){
      var angle = playerMage.body.angle;
      playerMagic[playerMagic.length - 1].shoot(angle);
    }
  }
}
