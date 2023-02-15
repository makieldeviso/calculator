let chain = false;
let firstInput; //stores first input
let secondInput; // stores the second input
let answer; // stores answer to the operation
let lastInput; //stores the last input on screen wether a digit or operator
let lastOperation = []; // Stores the last operator executed, except equals
let inputNumbers = []; //stores DIGITS in an array, later used to be combined as a float/ number
let currentOperation;
let numberButtons = document.querySelectorAll("#number-buttons button");
numberButtons.forEach(button => {
    button.addEventListener("click", typesNumber);
})



let inputScreen = document.querySelector("#input-screen p");
let answerScreen = document.querySelector("#answer-screen p");



function typesNumber() {
    if (answerScreen.textContent === "Math ERROR" || answer === Infinity || answer === -Infinity) {
        return;
    }




    // User stops the operation chain by typing new set of operands
    if (lastInput === "equals") {
        chain = false;
        firstInput = undefined;
        secondInput = undefined;
        inputScreen.textContent = "";
        answerScreen.textContent = "";
        step = 1;
        inputNumbers = [];
    }

    
    lastInput = parseFloat(this.value); //determines that the last input is a number and not an operator
    inputNumbers.push(this.value);
    inputScreen.textContent += this.value;
    console.log(lastInput);
}






let operatorButton = document.querySelectorAll("[data-operate]");
operatorButton.forEach(button => {
    button.addEventListener("click", operatesInputs);
});



let step = 1;
function operatesInputs() {
    let operation = this.dataset.operate;
    console.log(lastInput);

if (answerScreen.textContent === "Math ERROR" || answer === Infinity || answer === -Infinity) {
    return;
}





// Saves the last operation for operation function to work
    if(operation != "equals") {
        currentOperation = operation;

        if (operation != "equals") { // Don't add equals to the array
            lastOperation.push(currentOperation); //stores previous operations
        }

        //minimizes array into 2(length)
        if (lastOperation.length > 2) { 
            lastOperation.shift();
        };

        if (typeof lastInput === "number" && firstInput != undefined) {
            currentOperation = lastOperation[0];
        } else {
            currentOperation = lastOperation[1];
        }

    } else {
    //when equals is pressed
        if (chain === false) {
            currentOperation = lastOperation[0];
        } else {
            currentOperation = lastOperation[1];
        }
    }

    console.log(currentOperation);

// Don't run equals if no number is printed first
    if (inputScreen.textContent.length === 0 && operation === "equals") {
        return;
    }

    if (typeof lastInput != "number" && lastInput != "equals" && inputScreen.textContent.length != 0) {
    // Prints syntax error if equal sign is pressed after an operator sign
        if (operation === "equals") {
            inputScreen.textContent = "Syntax ERROR";
            lastInput = operation;
            return;
        } 
    // changes operator on screen 
        deleteOneStep();
        lastInput = operation;
        inputScreen.textContent += this.textContent;
        return;
    }

    if (step === 1) {
    // This stores first input as answer if after 
    // first input, user operates equals
        if (operation === "equals") {
            firstInput = parseFloat(inputNumbers.join(""));
            answer = firstInput;
            postAnswer(answer);
            firstInput = answer;
            inputNumbers= [];
            lastInput = operation; // advance save since there is return
            
            step = 1;
            return;
        } else {
        // chains operation without pressing equals
            if (firstInput != undefined && answer === firstInput) {
            // Stores the Answer of last operation as First Input,
            // then continue steps
                inputScreen.textContent += this.textContent;
                answerScreen.textContent = "";
                lastInput = operation; // advance save since there is return

                step = 2;
                return;

                

            } else if (inputNumbers.length === 0) {
            // Operator was pressed before any number, makes
            // first input as ZERO, then continue steps
                firstInput = 0;
                inputScreen.textContent += firstInput;
                console.log(firstInput);
                
            } else {
            // Stores first input and continue step
                firstInput = parseFloat(inputNumbers.join(""));
                
            }
        }

        inputNumbers= []; //clears typing storage
        lastInput = operation; // saves operation as last input
        inputScreen.textContent += this.textContent; // puts the operator on screen
        step = 2;

    } else if (step === 2) {
        if (operation != "equals") {
        // Chains operation by pressing operator sign 
        // instead of pressing equals
            secondInput = parseFloat(inputNumbers.join(""));
            runOperation(currentOperation);

            // Posts Math ERROR and end function
            if (answer === Infinity || answer === -Infinity) {
                answerScreen.textContent = "Math ERROR";
                return;
            }

            inputScreen.textContent = answer;
            inputScreen.textContent += this.textContent;
            firstInput = answer;
            secondInput = undefined;
            inputNumbers= [];
            // console.log(secondInput);
            chain = true;
            step = 2;
            // console.log(lastInput);
        } else {
        // Runs the operation after pressing equals
            secondInput = parseFloat(inputNumbers.join(""));
            runOperation(currentOperation);
            postAnswer(answer);

            // Ends function on Math Error
            if (answer === Infinity || answer === -Infinity) {
                return;
            }

            // Storing answer as first input enables chaining another
            //   operation if next button press is another operator
            // The first input is vacated after this operation if a
            //  number is pressed
            firstInput = answer; 
            secondInput = undefined;
            inputNumbers= [];
            step = 3;
            chain = true;
            // console.log(firstInput);
            // console.log(secondInput);
        }
        
    } else if (step === 3) {
        if (chain === true && operation != "equals") {
            inputScreen.textContent = answer;
            inputScreen.textContent += this.textContent;
            // Does not post answer on answer screen if user is
            //  still chaining operations
            answerScreen.textContent = "";
            step = 2;
        } else if (operation === "equals") {
            // Do nothing if after an answer, another 
            // equals is pressed, AGAIN
            return;
        }
    }

lastInput = operation; // Ensures that the operation is saved as last input
}


function runOperation(operation) {
    if(operation === "add") {
        answer = firstInput + secondInput;
    } else if (operation === "subtract") {
        answer = firstInput - secondInput;
    } else if (operation === "multiply") {
        answer = firstInput * secondInput;
    } else if (operation === "divide") {
        answer = firstInput / secondInput;
    }  
}

// function showsAnswer() {

// }


function deleteOneStep() {
    inputScreen.textContent = inputScreen.textContent.slice(0, inputScreen.textContent.length - 1);
}


function postAnswer(number) {
    let stringAnswer = number.toString(); //converts number to string
    let decimalIndex = stringAnswer.indexOf("."); //finds the index of decimal

    if (decimalIndex === -1) {
        decimalIndex = stringAnswer.length;
    }
    
    // let decimalPlaces = stringAnswer.length - decimalIndex;
    let wholeNumbers = decimalIndex; // assign to new variable to be readable

    if (stringAnswer.length > 16) {
        let result = number.toFixed(16 - wholeNumbers); //this is string
        answerScreen.textContent = result;
    } else {
        if (number === Infinity || number === -Infinity) {
            answerScreen.textContent = "Math ERROR";
        } else {
            answerScreen.textContent = answer;
        }
        
    }
}
