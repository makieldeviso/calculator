let chain = false;
let firstInput;
let secondInput;
let answer;
let lastInput;
let lastOperation;

let numberButtons = document.querySelectorAll("#number-buttons button");
numberButtons.forEach(button => {
    button.addEventListener("click", typesNumber);
})



let inputNumbers = []; //stores inputs in an array
let inputScreen = document.querySelector("#input-screen p");
let answerScreen = document.querySelector("#answer-screen p");

function typesNumber() {

    if (lastInput === "equals") {
        console.log(answer);
        firstInput = "";
        secondInput = "";
        inputScreen.textContent = "";
        answerScreen.textContent = "";
        step = 1;
        inputNumbers = [];
    }

    lastInput = parseFloat(this.value);
    inputNumbers.push(this.value);
    inputScreen.textContent += this.value;
}






let operatorButton = document.querySelectorAll("[data-operate]");
operatorButton.forEach(button => {
    button.addEventListener("click", operatesInputs);
})



let step = 1;
function operatesInputs() {
    let operation = this.dataset.operate;

    // Saves the last operation for operation function to work
    if(operation != "equals") {
        lastOperation = operation;
    }

    console.log(lastOperation);
    // Don't run equals if no number is printed first
    if (inputScreen.textContent.length === 0 && operation === "equals") {
        return;
    }

    if (typeof lastInput != "number" && lastInput != "equals") {
        if (operation === "equals") {
            // Prints syntax error if equal sign is pressed after an operator sign
            inputScreen.textContent = "Syntax ERROR";
            lastInput = operation;
            
            console.log(lastInput);
            return;
        } 
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
            lastInput = operation;
            
            step = 1;
            return;
        } else {
            // chains operation without pressing equals
            if (firstInput != undefined && answer === firstInput) {
                // Stores the Answer of last operation as First Input,
                // then continue steps
                inputScreen.textContent += this.textContent;
                answerScreen.textContent = "";
                lastInput = operation;
                
                step = 2;
                return;

            } else if (inputNumbers.length === 0) {
                // Operator was pressed before any number, makes
                // first input as ZERO, then continue steps
                firstInput = 0;
                inputScreen.textContent += firstInput;
                
            } else {
                // Stores first input and continue step
                firstInput = parseFloat(inputNumbers.join(""));
                
            }
        }

        inputNumbers= [];
        lastInput = operation;
        inputScreen.textContent += this.textContent;
        step = 2;

    } else if (step === 2) {
        if (operation != "equals") {
            // Chains operation by pressing operator sign 
            // instead of pressing equals
            secondInput = parseFloat(inputNumbers.join(""));
            runOperation(lastOperation);
            inputScreen.textContent = answer;
            inputScreen.textContent += this.textContent;
            firstInput = answer;
            secondInput = "";
            inputNumbers= [];
            step = 2;
            console.log(lastInput);
        } else {
            // Runs the operation after pressing equals
            secondInput = parseFloat(inputNumbers.join(""));
            runOperation(lastOperation);
            postAnswer(answer);
            firstInput = answer;
            secondInput = "";
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
            answerScreen.textContent = "";
            step = 2;
        } else if (operation === "equals") {
            // Do nothing if after an answer equals is pressed again
            return;
        }
    }

lastInput = operation;
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
    let stringAnswer = number.toString();
    console.log(stringAnswer);
    let decimalIndex = stringAnswer.indexOf(".");

    if (decimalIndex === -1) {
        decimalIndex = stringAnswer.length;
    }
    
    let decimalPlaces = stringAnswer.length - decimalIndex;
    let wholeNumbers = decimalIndex;

    if (stringAnswer.length > 16) {
        let result = number.toFixed(16 - wholeNumbers);
        answerScreen.textContent = result;
    } else {
        answerScreen.textContent = answer;
    }
}