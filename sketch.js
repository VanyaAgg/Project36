//Create variables here
var dog, happyDog, database, foodS, foodStock; 
var  fedTime, lastFed;
var foodObj;
var feedDog, addFood;
var bedroom, garden, washroom;
var readState, changeState;
var gameState;
function preload()
{
  dog= loadImage("images/dogImg.png");
	happyDog= loadImage("images/Happy.png" );
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  sadDog = loadImage("images/sadDog.png");
}

function setup() {
	createCanvas(1000,400);
  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock );

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
}


function draw() {  
background(46,139,87);

foodObj.display();


  
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if (lastFed >=15){
    text("Last Feed : "+ lastFed%12 + "PM" , 350, 30);
  }
  else if (lastFed == 0){
    text("Last Feed : 12 AM ", 350, 30);
  }
  else{
    text("Last Feed : "+ lastFed + "AM" , 350, 30);
  }

  drawSprites();

 

currentTime = hour();

if (gameState!= "Hungry"){
  feed.hide();
  addFood.show();
  dog.remove();
}
else{
  dog.addImage(sadDog);
  feed.show();
}
if(currentTime == (lastFed + 1)){
  update("Playing");
  foodObj.garden();
}
else if(currentTime == (lastFed + 2)){
  update("Sleeping");
  foodObj.bedroom();
}
else if(currentTime > (lastFed + 2) && currentTime<= (lastFed + 4)){
  update("Bathing");
  foodObj.washroom();
}
else{
  update("Hungry");
  foodObj.display();
}
}
  
  function addFoods(){
foodS++;
database.ref('/').update({
  Food:foodS
})
 }


 function feedDog(){
dog.addImage(happyDog);

if(foodObj.getFoodStock()<= 0){
  foodObj.updateFoodStock(foodObj.getFoodStock()*0);
}else{
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
}

  
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
})

 }
 
function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  database.ref('/').update({
    Food : x
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  });
}



