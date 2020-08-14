//Create variables here
var dogImg, happyDogImg;
var database;
var numFoodItems, foodStock;
var dog;

var database, position;
var button1, button2;
var fedTime, lastFed;
var foodObj;

function preload() {
  //load images here
  dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");

}

function setup() {
  database = firebase.database();
  createCanvas(900, 500);
  fill(255, 255, 254);
  textSize(15);
  

  dog = createSprite(width - 250, height / 2, 10, 10);
  dog.addImage("dog", dogImg);
  dogImg.width = dogImg.width / 6;
  dogImg.height = dogImg.height / 6;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  button1 = createButton("Feed the Dog");
  button1.position(1050, 75);
  button1.mousePressed(feedDog);

  button2 = createButton("Add Food");
  button2.position(1150, 75);
  button2.mousePressed(addFoods);

}


function draw() {
  background(46, 139, 87);


  drawSprites();
  //add styles here
  textSize(25);
  fill("white");
  stroke(2);
  textFont("Georgia");
  // text("Food remaining:" + numFoodItems, 150, 180);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })

  if (lastFed >= 12) {
    text("last Feed : " + lastFed % 12 + " PM", 350, 30);
  } else if (lastFed == 0) {
    text("last Feed : 12 AM", 350, 30);
  } else {
    text("last Feed : " + lastFed + " AM", 350, 30);
  }
  
  foodObj.display();
}
function readStock(data) {
  numFoodItems = data.val();
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref('/').update({
    Food: x
  })

}
function addFoods() {
  numFoodItems++;
  database.ref('/').update({
    food: numFoodItems
  });
}



function feedDog() {
  console.log('click feed dog');
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    feedTime: hour()
  });
}


