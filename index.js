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

    //saves the last operation for operation function to work
    if(operation != "equals") {
        lastOperation = operation;
    }

    console.log(lastOperation);
    // don't run equals if no number is printed first
    if (inputScreen.textContent.length === 0 && this.dataset.operate === "equals") {
        return;
    }

    if (typeof lastInput != "number" && lastInput != "equals") {
        if (this.dataset.operate === "equals") {
            // prints syntax error if equal sign is pressed after an operator sign
            inputScreen.textContent = "Syntax ERROR";
            lastInput = this.dataset.operate;
            
            console.log(lastInput);
            return;
        } 
        deleteOneStep();
        lastInput = this.dataset.operate;
        
        inputScreen.textContent += this.textContent;
        return;
    }

    if (step === 1) {
        // this stores first input as answer if after 
        // first input, user operates equals
        if (this.dataset.operate === "equals") {
            firstInput = parseFloat(inputNumbers.join(""));
            answer = firstInput;
            answerScreen.textContent = answer;
            firstInput = answer;
            inputNumbers= [];
            lastInput = this.dataset.operate;
            
            step = 1;
            return;
        } else {
            if (firstInput != undefined && answer === firstInput) {
                // stored firstInput is answer of last operation
                inputScreen.textContent += this.textContent;
                answerScreen.textContent = "";
                lastInput = this.dataset.operate;
                
                step = 2;
                return;

            } else if (inputNumbers.length === 0) {
                //operator was pressed before any number
                firstInput = 0;
                inputScreen.textContent += firstInput;
                
            } else {
                firstInput = parseFloat(inputNumbers.join(""));
                
            }
        }

        inputNumbers= [];
        lastInput = this.dataset.operate;
        
        inputScreen.textContent += this.textContent;
        step = 2;

    } else if (step === 2) {
        if (this.dataset.operate != "equals") {
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
            secondInput = parseFloat(inputNumbers.join(""));
            runOperation(lastOperation);
            answerScreen.textContent = answer;
            firstInput = answer;
            secondInput = "";
            inputNumbers= [];
            step = 3;
            chain = true;
            // console.log(firstInput);
            // console.log(secondInput);
        }
        
    } else if (step === 3) {
        if (chain === true && this.dataset.operate != "equals") {
            inputScreen.textContent = answer;
            inputScreen.textContent += this.textContent;
            answerScreen.textContent = "";
            step = 2;
        } else if (this.dataset.operate === "equals") {
            return;
        }
    }

lastInput = this.dataset.operate;
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


function roundAnswer(answer) {
    let stringAnswer = answer.toString();
    console.log(stringAnswer);
    let decimalIndex = stringAnswer.indexOf(".");

    if (decimalIndex === -1) {
        decimalIndex = stringAnswer.length;
    }
    
    let decimalPlaces = stringAnswer.length - decimalIndex;
    let wholeNumbers = decimalIndex;
}