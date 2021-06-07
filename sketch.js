//Create variables here
var dog, happyDog, database, foodS, foodStock; 
var  fedTime, lastFed;
var foodObj;
var bedroom, garden, washroom;
var readState, changeState;
function preload()
{
  dog= loadImage(images/"dogImg.png");
	happyDog= loadImage(images/ "dogImg1.png" );
  bedroom = loadImage(images/"bedroom.png");
  garden = loadImage(images/"garden.png");
  washroom = loadImage(images/"washroom.png");
  sadDog = loadImage(images/"sadDog.png");
}

function setup() {
	createCanvas(500,500);
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock );

  var feedDog, addFood;

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

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

food.display();

  drawSprites();

  foodStock.update(food);
  
  
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

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove(); 
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

currentTime = hour();
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

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
  Food:foodObj.getFoodStock,
  feedTime:hour()
})
 }
 
function readStock(data){
foodS.data.val();
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



