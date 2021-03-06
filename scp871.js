var cakeCount=1;
var regenCakesAmount=1;
var timeBetween = 1800;
var epochNextSpawn;
var epochLastSpawn;
var timeLeft = 86400;
var saveD = window.localStorage;

function load(){
	cakeCount = saveD.getItem('cakeCount')
  regenCakesAmount = saveD.getItem('regenCakesAmount')
  timeBetween = saveD.getItem('timeBetween')
  epochNextSpawn = saveD.getItem('EpochNextSpawn')
  epochLastSpawn = saveD.getItem('epochLastSpawn')
  timeLeft = saveD.getItem('timeLeft')
}
function save(){
	saveD.setItem('cakeCount', cakeCount)
  saveD.setItem('regenCakesAmount', regenCakesAmount)
  saveD.setItem('timeBetween', timeBetween)
  saveD.setItem('EpochNextSpawn', epochNextSpawn)
  saveD.setItem('epochLastSpawn', epochLastSpawn)
  saveD.setItem('timeLeft', timeLeft)
}
function newCake(){
  var string = '<img src="https://scp-wiki.wdfiles.com/local--files/scp-871/Cake.jpg" onclick="rmo(this)" class="cakearea">'
  
  document.getElementById('cakeArea').innerHTML = ""
  
  for(var i=0;i<cakeCount;i++){
  	document.getElementById('cakeArea').innerHTML = document.getElementById('cakeArea').innerHTML += string
  }
  
}
function logout(){
	save()
}
function start(e){
	e.remove();
	var date = new Date()
	save();
  document.getElementById('c').style.display = 'none';
	epochLastSpawn = Math.round(date/1000);
  epochNextSpawn = epochLastSpawn + timeBetween;
  updateTimer();
  newCake()
}
function continueSave(e){
	e.remove();
	load()
  document.getElementById('s').style.display = 'none';
  newCake()
  updateTimer()
}
function updateTimer(){
	var now = new Date()
  var epoch = now/1000
  cakeCount = document.getElementsByClassName("cakearea").length
  timeLeft = epochNextSpawn - epoch
  save()
  
  if(timeLeft === 0 || timeLeft < 0){
  	if( document.getElementsByClassName("cakearea").length === 0 ){
    	cakeCount = regenCakesAmount;
      epochLastSpawn = epoch;
      epochNextSpawn = epochLastSpawn+timeBetween
      newCake()
    }
    else{
    	regenCakesAmount = regenCakesAmount*2
      cakeCount = regenCakesAmount
      epochLastSpawn = epoch;
      epochNextSpawn = epochLastSpawn+timeBetween
      newCake()
    }
  }
  
  document.getElementById('timer').innerHTML = "Time till multiply: "+format( timeLeft )
	setTimeout(updateTimer, 1000)
}
function rmo(e){
	e.remove()
}
function format(time) {   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
