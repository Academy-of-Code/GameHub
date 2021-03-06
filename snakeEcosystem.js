var chart = new CanvasJS.Chart("chartContainer", {
      title:{
        text: "Snake Population"              
      },
      data: [
      {
        type: "line",
        dataPoints: [
          { y: 1 },
        ]
      }
      ]
  }
)
chart.render()

function addNew(){
	var cmd = 'chart.data[0].addTo("dataPoints",{y:10});'
  var lastIndex = chart.data[0].get("dataPoints").length - 1
  chart.data[0].addTo('dataPoints',{y:snakeArr.length})
}

//-  πππππππππππ SNAKE CONSTRUCTOR πππππππππππ

function Snake(snakeLength, snakeX, snakeY, direction, snakeColor, snakeName, food, muteChance) {
	this.snakeLength = snakeLength;
	this.snakeX = snakeX;
	this.snakeY = snakeY;
	this.direction = direction;
	this.previousDir = [];
	this.previousPos = [];
	this.snakeColor = snakeColor;
	this.snakeName = snakeName;
  this.food = food;
  this.muteChance = muteChance;
}

//-  πππππππππππ CANVAS ASSIGNMENT πππππππππππ

var c = document.getElementById("game");
var ctx = c.getContext("2d");

//-  πππππππππππ ENVIROMENT VARIABLE πππππππππππ

var fruitX;
var fruitY;
var eat = true;
var intervalArr = [];
var velocity = 5;
var fps = 15;
var gameOver;
var generation = 0;
var dayLength = 5000 // ms
var dayTime = 0 // ms
var build = 'Build 2.3.30'
var colorArr = ['#f54290','#1d68a1','#40eb34']

//-  πππππππππππ AI STARTING VARIABLE πππππππππππ

var snakeArr = []

var ai = new Snake(
	1,
	c.offsetWidth / 2,
	c.offsetHeight / 2,
	"left",
	"#f54290",
	"ai",
  1,
  1,
);
snakeArr.push(ai)
//-  πππππππππππ CLEAR CANVAS πππππππππππ

function nextFrame() {
	ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
}

//-  πππππππππππ DRAW SNAKE πππππππππππ

function drawSnake(snake) {
	ctx.fillStyle = "#000000";
	paintPixel(snake.snakeX, snake.snakeY, snake.snakeColor);

	snake.previousPos.unshift({ x: snake.snakeX, y: snake.snakeY });
	snake.previousDir.unshift(snake.direction);

	for (var i = 1; i < snake.snakeLength; i++) {
		if (snake.previousPos[i]) {
			paintPixel(
				snake.previousPos[i].x,
				snake.previousPos[i].y,
				snake.snakeColor
			);
		}
	}

	//-  πππππππππππ UPDATE SNAKE POSITION BY DIRECTION πππππππππππ

	switch (snake.direction) {
		case "left":
			snake.snakeX -= velocity;
			break;

		case "right":
			snake.snakeX += velocity;
			break;

		case "up":
			snake.snakeY -= velocity;
			break;

		case "down":
			snake.snakeY += velocity;
			break;
	}
}

//-  πππππππππππ DRAW FRUIT πππππππππππ

function drawFruit(spawnNew) {
	if(spawnNew){eat=true}
	if (eat) {
		fruitX = Math.floor(Math.random() * c.offsetWidth - 5 )+ 5;
		fruitY = Math.floor(Math.random() * c.offsetHeight - 5 )+ 5;
		eat = false;

		paintPixel(fruitX, fruitY, "#db0011");
	}
	paintPixel(fruitX, fruitY, "#db0011");
}

//-  πππππππππππ DETECT COLLIDE πππππππππππ

function detectCollide(snakeX, snakeY, x, y, radius) {
	var differentX = x - snakeX;
	var differentY = y - snakeY;
	if (differentX <= radius && differentX >= -radius) {
		if (differentY <= radius && differentY >= -radius) {
			return true;
			// snakeLength += 5 ;
			// eat = true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

//-  πππππππππππ PAINT PIXEL πππππππππππ

function paintPixel(x, y, color) {
	if (color) {
		ctx.fillStyle = color;
	} else {
		ctx.fillStyle = "#000000";
	}
	ctx.fillRect(x, y, 5, 5);
}

//-  πππππππππππ GAME LOSE CHECKING πππππππππππ

function gameLoseCheck(snake) {
	
}

//-  πππππππππππ GAME OVER BEHAVIOUR πππππππππππ

function stop(){

}

//-  πππππππππππ EAT CHECKING πππππππππππ

function eatCheck(snake) {
	if (detectCollide(snake.snakeX, snake.snakeY, fruitX, fruitY, 5)) {
		snake.food += 1;
    if(snake.snakeLength === 0){
    	snake.snakeLength+=2
    }
    else{
    	snake.snakeLength+=1
    }
		eat = true;
	}
}

//-  πππππππππππ AI BEHAVIOUR πππππππππππ

function AiHandler(snake) {
	var possibleMove = [];
	var differentX = fruitX - snake.snakeX;
	var differentY = fruitY - snake.snakeY;

	if (differentX > 0 && snake.previousDir[0] !== "left") {
		possibleMove.push("right");
	} else if (snake.previousDir[0] !== "right") {
		possibleMove.push("left");
	}

	if (differentY > 0 && snake.previousDir[0] !== "up") {
		possibleMove.push("down");
	} else if (snake.previousDir[0] !== "down") {
		possibleMove.push("up");
	}

	possibleMove = possibleMoveFilter(snake, possibleMove);

	//- LAYER TWO = IF ALL POSSBLE MOVE TO FOOD IS NEGATED

	if (possibleMove.length == 0) {
		possibleMove.unshift("up");
		possibleMove.unshift("down");
		possibleMove.unshift("left");
		possibleMove.unshift("right");

		possibleMove = possibleMoveFilter(snake, possibleMove);
	}

	var random = Math.floor(Math.random() * possibleMove.length);
	snake.direction = possibleMove[random];
}

function possibleMoveFilter(snake, moveArr) {
	var currentX = snake.snakeX;
	var currentY = snake.snakeY;
	var newArr = [];

	moveArr.forEach(function(data) {
		var validation = 0;
		var count = 0;

		if (data == "left" && snake.direction !== "right") {
			if (currentX - velocity > 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX - velocity,
								currentY,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}

		if (data == "right" && snake.direction !== "left") {
			if (currentX + velocity < c.offsetWidth - 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX + velocity,
								currentY,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}

		if (data == "up" && snake.direction !== "down") {
			if (currentY - velocity > 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX,
								currentY - velocity,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}

		if (data == "down" && snake.direction !== "up") {
			if (currentY + velocity < c.offsetHeight - 3) {
				for (var i = 0; i < snake.snakeLength; i++) {
					if (snake.previousPos[i]) {
						if (
							detectCollide(
								currentX,
								currentY + velocity,
								snake.previousPos[i].x,
								snake.previousPos[i].y,
								3
							)
						) {
							count++;
						}
					}
				}

				if (!count) {
					validation++;
				}
			}
		}
		if (validation) {
			newArr.unshift(data);
		}
	});

	return newArr;
}

//-  πππππππππππ Create New Snake πππππππππππ
function addSnake(){
	var e = new Snake(
  1,
  c.offsetWidth / 2,
  c.offsetHeight / 2,
  "left",
  "#1d68a1",
  "ai",
  1,
  0.05,
  )
  mutate(e)
  snakeArr.push(e)
  return(e)
}

//-  πππππππππππ Generate Integer πππππππππππ
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//-  πππππππππππ Update Stats πππππππππππ
function updateStats(){
	var dayEle = document.getElementById('gens')
  var snakesEle = document.getElementById('snakes')
  var buildEle = document.getElementById('build')
  
  dayEle.innerHTML = 'Day: '+dayTime
  snakesEle.innerHTML = 'Snakes: '+snakeArr.length
  buildEle.innerHTML = 'Build: '+build
}

//-  πππππππππππ Calculate Every Combonation πππππππππππ
function combo(arr){
	var arr2 = []
	for(var x=0;x<arr.length;x++){
  	if( arr[x-1] != undefined ){
    	collideCheck(arr[x], arr[x-1])
      if( arr[x+1] != undefined ){
    		collideCheck(arr[x], arr[x+1])
    	}
    }
    else if( arr[x+1] != undefined ){
    	collideCheck(arr[x], arr[x+1])
    }
  }
}

//-  πππππππππππ SELF COLLISION DETECTION πππππππππππ
function collideCheck(snake, crashSnake) {
	for (var i = 0; i < crashSnake.snakeLength; i++) {
		if (crashSnake.previousPos[i]) {
			if (
				detectCollide(
					snake.snakeX,
					snake.snakeY,
					crashSnake.previousPos[i].x,
					crashSnake.previousPos[i].y,
					2
				)
			) {
				// do something
			}
		}
	}
}

//-  πππππππππππ Mutate πππππππππππ
function mutate(snake){
	for(var x=0;x<snakeArr.length;x++){
    var muteChance = snake.muteChance*100
    var int = randomInt(0, 100)
    if(int<=muteChance){
    	var possibleMutes = ['color','muteChance']
      var int2 = randomInt(0,possibleMutes.length-1)
      var res= possibleMutes[int2]
      if(res==='color'){
      	snake.snakeColor = colorArr[randomInt(0,colorArr.length-1)]
      }
      else if(res==='muteChance'){
      	var interval = randomInt(0,1)
        var inter = randomInt(1,5)
        if(interval===1){snake.muteChance+=(inter/100)}
        else{snake.muteChance-=(inter/100)}
      }
    }
  }
}

//-  πππππππππππ Day Counter πππππππππππ
function dayCounter(){
  for(var x=0;x<snakeArr.length;x++){
  	snake = snakeArr[x]
    if(snake.food>0){
    	if(snake.food>1){snek();snek();}
    }
    else{
    	//snakeArr.splice(x,)
    }
    snake.snakeLength = 0
    snake.food = 0
  }
  addNew()
  drawFruit(true)
  dayTime+=1
  setTimeout(dayCounter, 20000)
}

//-  πππππππππππ MERGE EVERYTHING TOGETHER πππππππππππ
function run() {
	generation = 1
  dayCounter()
	intervalArr.push(
		setInterval(function() {
			nextFrame();
  		for(var o=0;o<snakeArr.length;o++){
      	AiHandler(snakeArr[o])
        drawSnake(snakeArr[o])
        combo(snakeArr);
        drawFruit();
				eatCheck(snakeArr[o]);
        updateStats()
        o++
      }
      
		}, 1000 / fps)
	);
}

run();
reset();
function snek(){
	var e = addSnake()
  return(e)
}
function reset() {
	
}
