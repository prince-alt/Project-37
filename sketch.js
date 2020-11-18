//Create variables here
var database,saddog,happydog,pet,foodstock,foods;
var feed,addfood;
var fedTime,lastFed;
var foodObj;
var changestate,readstate;
var bedroomimg,gardenimg,washroomimg;
var Gamestate;
var currentTime;

function preload()
{
  //load images here
  saddog = loadImage("images/Dog.png");
  happydog = loadImage("images/dogImg1.png");

  bedroomimg = loadImage("images/Bed Room.png");
  gardenimg = loadImage("images/Garden.png");
  washroomimg = loadImage("images/Wash Room.png");

}

function setup() {
  createCanvas(800, 500);

  database = firebase.database();

  pet = createSprite(250,350,50,50);
  pet.addImage(saddog);
  pet.scale = 0.2;

  foodstock = database.ref('food');
  foodstock.on("value",readStock);
  
  foodObj = new food();

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addfood = createButton("Add Food")
  addfood.position(800,95);
  addfood.mousePressed(addFoods);

  readstate = database.ref('gamestate');
  readstate.on("value",function(data){

  Gamestate = data.val();

  })

}


function draw() {  

  background("teal");

    foodObj.display();

  //add styles here

textSize(30);
fill ("red");
text("Food :"+foods,50,50);


fedTime = database.ref('feedtime');
fedTime.on("value",function(data){

lastFed=data.val();

})

if(Gamestate!=="hungry"){

feed.hide();
addfood.hide();

}
else{

feed.show();
addfood.show();

}

currentTime = hour();
if(currentTime==(lastFed+1)){

update("playing");
foodObj.garden();

}

else if(currentTime==(lastFed+2)){

update("Sleeping");
foodObj.bedroom();

}

else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){

update("bathing");
foodObj.washroom();

}
else {

update("hungry");
foodObj.display();

}

drawSprites();

}

function readStock(data){

foods = data.val();
foodObj.updateFoodStock(foods);

}



function feedDog(){

pet.addImage(happydog);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);

database.ref('/').update({

food : foodObj.getFoodStock()

})

}

function addFoods(){

  

foods++;
database.ref('/').update({

food : foods

})

}

function update(state){

database.ref('/').update({

gamestate : state

});

}