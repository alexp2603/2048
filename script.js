//Global Variables 

var points_var = 0;


/**********************/
/****MAIN FUNCTIONS ***/
/**********************/

/****GAME CONTROL FUNCTIONS ****/

//Starts the game
function gameStart(){

	//Generates four initial random numbers on board
	for(gameStart_i = 0; gameStart_i < 4; gameStart_i++){
		generateNumber();
	}

	//Updates the start game button into a reset button
	document.getElementById("start_button").innerHTML = "Reset Game";
	document.getElementById("start_button").setAttribute('onclick', 'reset()');
	document.getElementById("start_button").id = 'reset_button';

	//Add event listener to document
	document.addEventListener("keyup", inputListen, false);

	//Disables arrow key scrolling
	window.addEventListener("keydown", function(e) {
	    // space and arrow keys
	    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	        e.preventDefault();
	    }
	}, false);

}



//Event handling in gamestart page
function inputListen(e){
	var code = e.keyCode;

	//Use switch statement to differentiate depending on the input code
	switch(code){

		//Left
		case 37:
			var result = moveLeft();
			if(result){
				generateNumber();
				checkWin();
				if(checkLost()){
					alert("You lost! \nYou got to a score of: " + points_var +"\nClick the reset button to try again!");
				}
			}
			break;
		//Up
		case 38:
				var result = moveUp();
				if(result){
					generateNumber();
					checkWin();
					if(checkLost()){
						alert("You lost! \nYou got to a score of: " + points_var +"\nClick the reset button to try again!");
					}
				}
			break;
		//Right
		case 39:
				var result = moveRight();
				if(result){
					generateNumber();
					checkWin();
					if(checkLost()){
						alert("You lost! \nYou got to a score of: " + points_var +"\nClick the reset button to try again!");
					}
				}

			break;
		//Down
		case 40:
				var result = moveDown();
				if(result){
					generateNumber();
					checkWin();
					if(checkLost()){
						alert("You lost! \nYou got to a score of: " + points_var +"\nClick the reset button to try again!");
					}
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
	//Changes box properties as well as increments point counter.
	if(randomNumber <= 0.9){
		emptyBoxes[randomBox].innerHTML = 2;
		emptyBoxes[randomBox].parentNode.className = "box_2_gen";
	//	console.log("Generating a 2");
		points_var += 2;
		document.getElementById("points_p").innerHTML = points_var;
	}

	else if(randomNumber > 0.9){
		emptyBoxes[randomBox].innerHTML = 4;
	//	console.log("Generating a 4");
		emptyBoxes[randomBox].parentNode.className = "box_4_gen";
		points_var += 4;
		document.getElementById("points_p").innerHTML = points_var;
	}
	//Checks for some crazy case that should never happen
	else{
		console.log("Error in generating initial number in empty box");
	}
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

function checkWin(){
	var boxes = getBoxes();
	for(boxCur = 0; boxCur < boxes.length; boxCur ++){
		if(boxes[boxCur].innerHTML == 2048){
			document.getElementById("rules_p").innerHTML = "You win! Keep on playing to get more points!";
		}
	}
}


function checkLost(){

	var lost = true;
	var boxes = getBoxes();

	for(boxCur = 0; boxCur < boxes.length; boxCur++){
		var name = boxes[boxCur].parentNode.id;
		for(i = 0 ; i < 4; i++){
			
			switch(i){

				//test left
				case 0:
					var testName = name[0]+"_" + (parseInt(name[2])-1);
					if(!checkAroundBoxes(boxes[boxCur],  testName ) ){
						lost = false;
					}
					break;

				//Checks down
				case 1:
					var testName = (parseInt(name[0])+1) +"_" + (name[2]);
					if(!checkAroundBoxes(boxes[boxCur], testName ) ) {
						lost = false;
					}
					break;

				//Checks box right
				case 2:
					var testName = (name[0] +"_" + (parseInt(name[2])+1) );
					if(!checkAroundBoxes(boxes[boxCur], testName)){
						lost = false;
					}
					break;


				//checks box top
				case 3:
					var testName = (( parseInt(name[0]- 1)) + "_" + name[2]);
					if(!checkAroundBoxes(boxes[boxCur], testName)){
						lost = false;
					}
					break;
			} //End case


		}

	}

	return lost; 
}



function checkAroundBoxes(box, compare){

		var lost = true;
	
		/*check for two conditions
		1. If there is an empty box
		2. If there are two boxes that can be merged
		*/

		var compareExists = !!document.getElementById(compare);
		var boxHasValue = (box.innerHTML != null && box.innerHTML >0);

		//console.log(compareExists);
		//console.log(boxHasValue);

		//Deals with the first possible case - simply an empty bpx that allows movement
		if(!boxHasValue){
			lost = false;
		}


		//Now got to deal with the fact that two boxes can be merged, it's harder

		if(compareExists){
			if( document.getElementById(compare).querySelector(".v").innerHTML == box.innerHTML){
				lost = false;
			}
		}


		/*Check if both compare and the input box exists*/

		return lost;
}



/****MOVEMENT CONTROL METHODS ****/

/*Movement control methods are more complicated.
* Movement is done by cycling through each column or row, depending on the direction
*	Each colunm or row is represented by an array
*	A nested loop is implemented to cycle through these sub arrays
*	method checks the value of each box
*		If the value is non-zero, it cycles back down to the start of the array to find an empty box
*			If there is an empty box, it swaps both of these values
*			Then it checks if it can merge the two boxes
*Function returns if there was a switch done or not, helps in figuring out if the game is over
*/


//UP
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

//DOWN
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

//LEFT
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

//RIGHT
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


/**********************/
/****HELPER METHODS ***/
/**********************/


/**** BOX FETCH FUNCTIONS ****/

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



/**** MOVEMENT METHODS ****/


//Swaps the values of two boxes (used when moving through empty boxes)
function swapValues(one, two){

	//removes animation for 2 values

	if(one.className === ("box_2_gen")){
		one.className = "box_2";
	}
	if(two.className === ("box_2_gen")){
		two.className = "box_2";
	}

	//Removes animation for 4 values
	if(one.className === ("box_4_gen")){
		one.className = "box_4";
	}
	if(two.className === ("box_4_gen")){
		two.className = "box_4";
	}

	//Swaps inner html values
	tmp = one.innerHTML;
	one.innerHTML= two.innerHTML;
	two.innerHTML = tmp; 

	var tmp = one.className;
	one.className = two.className;
	two.className = tmp;

}


//Merges two boxes together
//Should be called merge(), not mergeUp since direction doesn't matter. Change when possible
function mergeUp(box1, box2){
	var box1_value = box1.querySelector(".v").innerHTML;
	var box2_value = box2.querySelector(".v").innerHTML;
	if(box1_value == box2_value && box1_value != ""){
		box2.querySelector(".v").innerHTML = box2_value*2;
		box1.querySelector(".v").innerHTML = "";
		box1.className = "box_empty";
		box2.className = "box_" + (box2_value*2);

		//console.log("Merge, incrementing points by " + (box2_value*2) );
		points_var += box2_value*2;

		return true;
	}
}


/**** GENERAL HELPER METHODS ****/

//Inverse an array, used to implement moveRight and moveDown() methods by simply inversing arrays
function inverseArray(array){
	var arrayLength = array.length - 1; //equals to 3
	var newArray = [];
	for(count = arrayLength ; count>= 0 ; count--){
		newArray.push(array[count]);
	}
	return newArray;
}


/**************************/
/****DEBBUGGING METHODS ***/
/**************************/


//Don't remember why I used that
function test(){
	var boxes = getBoxesByColumn(1);
	console.log(boxes);
	console.log("Length " + boxes.length);
	for(i = 0 ; i < 4; i++){
		console.log("Value at row " + i + " is " + boxes[i].querySelector(".v").innerHTML);
	}
}


