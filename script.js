//Global Variables 

var points_var = 0;



//Functions

function gameStart(){

	//Generates four random numbers on board
	for(gameStart_i = 0; gameStart_i < 4; gameStart_i++){
		generateNumber();
	}

	document.getElementById("start_button").innerHTML = "Reset Game";
	document.getElementById("start_button").setAttribute('onclick', 'reset()');
	document.getElementById("start_button").id = 'reset_button';

	var board = document.getElementById("reset_button");

//	console.log(getBoxesByColumn(1));
//	console.log(getBoxesByRow(1));
	board.addEventListener("keyup", inputListen, false);

	document.getElementById("rules_p").innerHTML = "Use the arrow keys to push boxes together and form the number 2048!";
}

//Event handling for gameStart()
function inputListen(e){
	var code = e.keyCode;
	switch(code){
		case 37:
//			console.log("left");
			var result = moveLeft();
			if(result){
				generateNumber();
				checkWin();
			}
			break;
		case 38:
//				console.log("up");
				var result = moveUp();
				if(result){
					generateNumber();
					checkWin();
				}
			break;
		case 39:
//			console.log("right");
				var result = moveRight();
				if(result){
					generateNumber();
					checkWin();
				}

			break;
		case 40:
///			console.log("down");
				var result = moveDown();
				if(result){
					generateNumber();
					checkWin();
				}
	}
}


//Generates number in empty box (90% chance 2, 10% chance 4 in an empty box)
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
		console.log("Generating a 2");
		points_var += 2;
		document.getElementById("points_p").innerHTML = points_var;
	}
	else if(randomNumber > 0.9){
		emptyBoxes[randomBox].innerHTML = 4;
		console.log("Generating a 4");
		emptyBoxes[randomBox].parentNode.className = "box_4";
		points_var += 4;
		document.getElementById("points_p").innerHTML = points_var;
	}
	//Checks for some crazy case that should never happen
	else{
		console.log("Error in generating initial number in empty box");
	}
} 

//BOX FETCH FUNCTIONS

//gets all boxes 
function getBoxes(){
	return document.getElementsByClassName("v");
}

//get Boxes by column
function getBoxesByColumn(columnNumber) {
  return document.querySelectorAll("div[id^=row] > div[id$='" + columnNumber + "']"); // SHould learn about Queuryselectors soon
}

//get boxes by row number


function getBoxesByRow(rowNumber) {
  return document.querySelectorAll("div[id^=row]>div[id^='" + rowNumber + "']");// SHould learn about Queuryselectors soon
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

	points_var = 0;
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

function moveDown()
{
	totalSwitch = false;
	for(i = 0 ; i < 4; i++)
	{
		var  boxes  = getBoxesByColumn(i+1);
		var newBoxes = inverseArray(boxes); //inverses array

		boxes = newBoxes;
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

function moveLeft()
{
	totalSwitch = false;
	for(i = 0 ; i < 4; i++)
	{
		var  boxes  = getBoxesByRow(i+1); //Implemented
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


function moveRight()
{
	totalSwitch = false;
	for(i = 0 ; i < 4; i++)
	{
		var  boxes  = getBoxesByRow(i+1); //Implemented
		var newBoxes = inverseArray(boxes); //inverses array

		boxes = newBoxes;

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


function checkWin(){
	var boxes = getBoxes();
	for(boxCur = 0; boxCur < boxes.length; boxCur ++){
		if(boxes[boxCur].innerHTML == 2048){
			document.getElementById("rules_p").innerHTML = "You win! Keep on playing to get more points!";
		}
	}
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
		box2.className = "box_" + (box2_value*2);

		console.log("Merge, incrementing points by " + (box2_value*2) );
		points_var += box2_value*2;

		return true;
	}
}


//General Helper methods

function inverseArray(array){
	var arrayLength = array.length - 1; //equals to 3
	var newArray = [];
	for(count = arrayLength ; count>= 0 ; count--){
		console.log(count);
		console.log(array[count]);
		newArray.push(array[count]);
	}
	return newArray;
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


