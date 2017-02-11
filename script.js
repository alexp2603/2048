function gameStart(){

	//Generates four random numbers on board
	for(gameStart_i = 0; gameStart_i < 4; gameStart_i++){
		generateNumber();
	}

	document.getElementById("start_button").innerHTML = "Reset Game";
	document.getElementById("start_button").setAttribute('onclick', 'reset()');
	document.getElementById("start_button").id = 'reset_button';

	var board = document.getElementById("reset_button");

	board.addEventListener("keyup", inputListen, false);
}


//Function to generate a number (90% chance 2, 10% chance 4 in an empty box)
function generateNumber(){


	var emptyBoxes = [];
	emptyBoxes = cycleBoxes();

	//checks for full board and does nothing if true
	if(emptyBoxes.length == 0){
		console.log("Game board full");
		return;
	}

	//generates random box index as well as random number between 0 and 1
	var randomBox = Math.floor((Math.random()* (emptyBoxes.length) ));
	var randomNumber =  Math.random();

	//Checks probability and assigns appropriate number value to random box index
	if(randomNumber <= 0.9){
		emptyBoxes[randomBox].innerHTML = 2;
		emptyBoxes[randomBox].parentNode.className = "box_2";
	}
	else if(randomNumber > 0.9){
		emptyBoxes[randomBox].innerHTML = 4;
		emptyBoxes[randomBox].parentNode.className = "box_4";
	}
	//Checks for some crazy case that should never happen
	else{
		console.log("Error in generating initial number in empty box");
	}
} 

//Generates an array of all boxes
function getBoxes(){
	return document.getElementsByClassName("v");
}

function getBoxesByColumn(columnNumber) {
  return document.querySelectorAll("div[id^=row] > div[id$='" + columnNumber + "']"); // SHould learn about Queuryselectors soon
}

//Generates an array of empty boxes
function cycleBoxes(){
	var boxes = getBoxes();
	var emptyBoxes = [];
	for(i = 0; i < boxes.length; i++){
		if( boxes[i].innerHTML == ""){
			emptyBoxes.push(boxes[i]);
		}
	}
	return emptyBoxes;
}




//Resets board
function reset(){
	var boxes = getBoxes();
	for(i = 0 ; i < boxes.length; i++){
		boxes[i].innerHTML = "";
		boxes[i].parentNode.className = "box_empty";
	}
	document.getElementById("reset_button").innerHTML = "Start Game";
	document.getElementById("reset_button").setAttribute('onclick', 'gameStart()');
	document.getElementById("reset_button").id = 'start_button';
}


function inputListen(e){
	var code = e.keyCode;
	switch(code){
		case 37:
			alert("left");
			break;
		case 38:
				console.log("up");
				var result = moveUp();
				if(result){
					generateNumber();
				}
			break;
		case 39:
			alert("right");
			break;
		case 40:
			alert("down");
			break;
	}
}


//MOVEMENT Controls


function moveUp()
{
	totalSwitch = false;
	for(i = 0 ; i < 4; i++)
	{
		var  boxes  = getBoxesByColumn(i+1);
		for( j = 0 ; j < boxes.length; j ++)
		{
			var box1_value =boxes[j].querySelector(".v").innerHTML;

			if( box1_value != "")
			{
				var count = 0; 
				var switched = false;
				while(count < j && !switched)
				{
					box2_value = boxes[count].querySelector(".v").innerHTML;
					if( box2_value == "")
					{
						swapValues(boxes[j], boxes[count]);
						if(count != 0){
							mergeUp(boxes[count], boxes[count-1]); //implement
						}
						totalSwitch = true;
						switched = true;
					}
					if(j != 0){
							var mergeSwitch = mergeUp(boxes[j], boxes[j-1]); //implement
							if(mergeSwitch){
								totalSwitch = true;
							}
						}
					count++;
				}
			}
		}
	}
	return totalSwitch;

}



//Movement Helper Methods
function swapValues(one, two){
	//Swaps inner html values
	tmp = one.innerHTML;
	one.innerHTML= two.innerHTML;
	two.innerHTML = tmp; 

	var tmp = one.className;
	one.className = two.className;
	two.className = tmp;
}


function mergeUp(box1, box2){
	var box1_value = box1.querySelector(".v").innerHTML;
	var box2_value = box2.querySelector(".v").innerHTML;
	if(box1_value == box2_value && box1_value != ""){
		box2.querySelector(".v").innerHTML = box2_value*2;
		box1.querySelector(".v").innerHTML = "";
		box1.className = "box_empty";
		box2.className = "box_" + (box2_value*2)
		return true;
	}
}

// Test functions

function test(){
	var boxes = getBoxesByColumn(1);
	console.log(boxes);
	console.log("Length " + boxes.length);
	for(i = 0 ; i < 4; i++){
		console.log("Value at row " + i + " is " + boxes[i].querySelector(".v").innerHTML);
	}
}


