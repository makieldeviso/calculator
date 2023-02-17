let chain = false;
let firstInput; //stores first input
let secondInput; // stores the second input
let answer; // stores answer to the operation
let lastInput; //stores the last input on screen wether a digit or operator
let lastOperation = []; // Stores the last operator executed, except equals
let inputNumbers = []; //stores DIGITS in an array, later used to be combined as a float/ number
let currentOperation;

// Number Buttons ------
let numberButtons = document.querySelectorAll("#number-buttons button");
    numberButtons.forEach(button => {
        button.addEventListener("click", typesNumber);
    })

// AC and DEL ----------
let allClearButton = document.querySelector("[data-action='all-clear']");
    allClearButton.addEventListener("click", allClear);

let deleteButton = document.querySelector("[data-action='delete']");
    deleteButton.addEventListener("click", backSpace);

// Screens -------------
let inputScreen = document.querySelector("#input-screen p");
let cursor = document.querySelector("#screen-cursor");
let answerScreen = document.querySelector("#answer-screen p");
let answerExponent = document.querySelector("#answer-screen .exponent");

function typesNumber() {

// Does not work if last last answer was exponent, large number 
    if (answerExponent.textContent.length > 0) {
        inputScreen.textContent = "Big Integer [AC]: Cancel"
        return;
    }

// Resets calculator after pressing a number upon Math ERROR
    if (answerScreen.textContent === "Math ERROR") {
        allClear();
    }

// User stops the operation chain by typing new set of operands
    if (lastInput === "equals") {
        chain = false;
        firstInput = undefined;
        secondInput = undefined;
        inputScreen.textContent = "";
        answerScreen.textContent = "";
        answerExponent.textContent = "";
        cursor.style.visibility = "visible";
        step = 1;
        inputNumbers = [];
    }


// Limits the screen input to 20 characters
    if (inputScreen.textContent.length === 20) {
        return;
     }

// Sets the characteristic of pressing decimal
    if (this.value === ".") {
        // Puts Zero before the decimal if there is no preceding numbers yet
        if (inputNumbers.length === 0) {
            inputNumbers.push("0");    // Save additional zero to avoid problem in DEL
            lastInput = 0;             // Save additional zero to avoid problem in DEL
            inputScreen.textContent += "0";
        } else {
            // If there is already a decimal, cancels input
            let decimalFound = false;
            inputNumbers.forEach(digit => {
                if (digit === ".") {
                    decimalFound = true;
                }
            });

            if (decimalFound === true) {
                return;
            }
        }
    cursor.style.visibility = "visible";
    }

    //determines that the last input is a number and not an operator, 
    // even decimal will return NaN which is a number data type
    lastInput = parseFloat(this.value); 
    cursor.style.visibility = "visible";
    inputNumbers.push(this.value);
    inputScreen.textContent += this.value;
    
    // console.log(inputNumbers);
}


let operatorButton = document.querySelectorAll("[data-operate]");
operatorButton.forEach(button => {
    button.addEventListener("click", operatesInputs);
});



let step = 1;
function operatesInputs() {
// Limits the screen input to 20 characters
    let continueOperation = false;
    cursor.style.visibility = "visible";
    if (inputScreen.textContent.length === 20) {
        let screenChar = [...inputScreen.textContent];
        // console.log(screenChar);

        screenChar.forEach(char => {
            if (char === "+" || char === "−" || char === "×" || char === "÷" ) {
                continueOperation = true;
            }
        });

        if (continueOperation === false) {
            return;
        }
    }

    let operation = this.dataset.operate;
    // console.log(lastInput);

// Does not work if last last answer was exponent, large number 
    if (answerExponent.textContent.length > 0) {
        inputScreen.textContent = "Big Integer [AC]: Cancel"
        cursor.style.visibility = "hidden";
        return;
    }

//  Does not work on Math ERROR, requires AC
    if (answerScreen.textContent === "Math ERROR") {
        cursor.style.visibility = "hidden";
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

    // console.log(currentOperation);

// Don't run equals if no number is printed first
    if (inputScreen.textContent.length === 0 && operation === "equals") {
        return;
    }

    if (typeof lastInput != "number" && lastInput != "equals" && inputScreen.textContent.length != 0) {
    // Prints syntax error if equal sign is pressed after an operator sign
        if (operation === "equals") {
            inputScreen.textContent = "[AC] : Cancel"
            cursor.style.visibility = "hidden";
            answerScreen.textContent = "Syntax ERROR";
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
                // console.log(firstInput);
                
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
            if (answer === Infinity || answer === -Infinity || answer.toString() === "NaN") {
                answerScreen.textContent = "[AC] : Cancel"
                inputScreen.textContent = "Math ERROR";
                answerExponent.textContent = "";
                cursor.style.visibility = "hidden";
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
            if (answer === Infinity || answer === -Infinity || answer.toString() === "NaN") {
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


function deleteOneStep() {
    inputScreen.textContent = inputScreen.textContent.slice(0, inputScreen.textContent.length - 1);
}

function postAnswer(number) {
    let stringAnswer = number.toString(); //converts number to string
    let decimalIndex = stringAnswer.indexOf("."); //finds the index of decimal

    if (decimalIndex === -1) {
        decimalIndex = stringAnswer.length;
    }
    
    let decimalPlaces = stringAnswer.length - decimalIndex;
    let wholeNumbers = decimalIndex; // assign to new variable to be readable

    if (stringAnswer.length > 12 && decimalPlaces > 0) {
        if (wholeNumbers > 12) {
            let result = number.toFixed(wholeNumbers - 12); //this is string
        } else {
            result = number.toFixed(12 - wholeNumbers); //this is string
        }

        answerScreen.textContent = result;

    } else if (stringAnswer.length > 12 && decimalPlaces === 0) {
        result = number.toExponential(6); //this is string, convert large number to exponential
        console.log(result);

        let expRegex = /e[+-]?\d+/; // finds the "e+num" characters
        let exponential = result.match(expRegex); // this is an array
        let powerNum = exponential[0].slice(2); //this is string
        let newIntegerRaised = result.replace(exponential[0], `×10`); //this is string

        answerScreen.textContent = newIntegerRaised; 
        answerExponent.textContent = powerNum;
         
    } else if (number === Infinity || number === -Infinity || number.toString() === "NaN" ) {
        answerScreen.textContent = "Math ERROR";
        inputScreen.textContent = "[AC] : Cancel"
    } else {
        answerScreen.textContent = answer;
    }
    cursor.style.visibility = "hidden";
}

function allClear() {
    chain = false;
    firstInput = undefined;
    secondInput = undefined;
    answer = undefined;
    lastInput = undefined;
    lastOperation = [];
    currentOperation = undefined;
    inputScreen.textContent = "";
    answerScreen.textContent = "";
    answerExponent.textContent = "";
    cursor.style.visibility = "visible";
    step = 1;
    inputNumbers = [];
}

function backSpace() {
    let inputScreenText = inputScreen.textContent;
    let lastChar = inputScreenText.slice(inputScreenText.length - 1);

// Does not work if the answer screen is not yet cleared
        if (answerScreen.textContent.length != 0) {
            return;
        }

// deletes character on screen
    inputScreen.textContent = inputScreenText.slice(0, inputScreen.textContent.length - 1);

// detect if the last character deleted is a number
    if (typeof parseFloat(lastChar) === "number") {
        inputNumbers.pop();
    }

// detect if the last character deleted is an operator and reset user input to step 1
    if (parseFloat(lastChar).toString() === "NaN") {
        chain = false;
        lastOperation = [];
        currentOperation = undefined;
        firstInput = undefined;
        step = 1;
        inputNumbers = [...inputScreen.textContent];
    }

// Emulates last inputs upon deletion of characters
    if (parseFloat(inputScreen.textContent[inputScreen.textContent.length - 1]).toString() === "NaN") {
        // If last character on screen is an operator
        let inputScreenTextLastChar = inputScreen.textContent[inputScreen.textContent.length - 1];
        
        if (inputScreenTextLastChar === "+") {
            lastInput = "add";
        } else if (inputScreenTextLastChar === "−") {
            lastInput = "subtract";
        } else if (inputScreenTextLastChar === "×") {
            lastInput = "multiply"; 
        } else if (inputScreenTextLastChar === "÷") {
            lastInput = "divide"; 
        }
    } else {
        lastInput = parseFloat(inputScreen.textContent[inputScreen.textContent.length - 1]);
    }
}
