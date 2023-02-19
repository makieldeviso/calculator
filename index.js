let chain = false;
let inputScreenLimit = 19;
let answerScreenLimit = 12;
let firstInput; //stores first input
let secondInput; // stores the second input
let answer; // stores answer to the operation
let lastInput; //stores the last input on screen wether a digit or operator
let lastOperation = []; // Stores the last operator executed, except equals
let inputNumbers = []; //stores DIGITS in an array, later used to be combined as a float/ number
let currentOperation;
let keylog = []; // Logs keypress, used for detecting simultaneous keypress

let wholeCalc = document.querySelector("#whole-calc");

// Number Buttons ------
let numberButtons = document.querySelectorAll("#number-buttons button");
    numberButtons.forEach(button => {
        button.addEventListener("click", (typesNumberClick));
    });

    document.addEventListener("keydown", typesNumberButton);
    document.addEventListener("keyup", typesNumberButton);

    function typesNumberClick() {
            let click = this.value;
            typesNumber(click);
    }

    function typesNumberButton(event) {
            let keypress = event.key;
            let allowedNumPress = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];

        // Fires Negative Sign
        // Ensures that subtract operation only fires when shift is held down
             if (keypress === "Shift" || keypress === "-") {
            // shift press
                if (event.type === "keydown" && keypress === "Shift") {
                    keylog.push("shiftDown");
                } else if (event.type === "keyup" && keypress === "Shift") {
                    keylog.push("shiftUp");
                }
        
                if (keylog.length > 1) { // Limits the keylog Array into 1(length)
                    keylog.shift();
                }
    
            // Fires the negative sign while shift is pressed
                if (event.type === "keydown" && keypress === "-" && keylog[0] === "shiftDown") {
                        typesNumber("-");
                    }
            }

            if (allowedNumPress.includes(keypress)) {
                typesNumber(keypress);
            }
    }       

// AC ----------
let allClearButton = document.querySelector("[data-action='all-clear']");
    allClearButton.addEventListener("click", () => allClear());

    document.addEventListener("keydown", allClearPress);

    function allClearPress(event) {
        let keypress = event.key; // "Escape" or "End"
        if (keypress === "Escape" || keypress === "End") {
            allClear();
        }
    }

// DEL ----------
let deleteButton = document.querySelector("[data-action='delete']");
    deleteButton.addEventListener("click", () => backSpace());

    document.addEventListener("keydown", backSpaceButton);

    function backSpaceButton(event) {
        let keypress = event.key; // "Backspace" or "Delete"
        if (keypress === "Backspace" || keypress === "Delete") {
            backSpace();
        }
    }

// Screens -------------
let inputScreen = document.querySelector("#input-screen p");
let cursor = document.querySelector("#screen-cursor");
let answerScreen = document.querySelector("#answer-screen p");
let answerExponent = document.querySelector("#answer-screen .exponent");

function typesNumber(event) {
// Adds pressing animation
    let thisButton = document.querySelector(`[value='${event}']`);   
    setTimeout(() => {
        thisButton.classList.toggle("pressed");
    },100);
        thisButton.classList.toggle("pressed");

    if (cursor.hasAttribute("class")) {
        cursor.classList.remove("limit");
    }
     
// Does not work if last answer was exponent, large number 
    if (answerExponent.textContent.length > 0) {
        inputScreen.textContent = "Memory Full [AC]: Cancel"
        return;
    } else if (answer != undefined) {
        if (answer.toString().length > inputScreenLimit) {
            inputScreen.textContent = "Memory Full [AC]: Cancel"
            return; 
        }
    }

// Resets calculator after pressing a number upon Math ERROR
    if (answerScreen.textContent === "Math ERROR" || answerScreen.textContent === "Syntax ERROR") {
        return;
        // allClear();
    }

// User stops the operation chain by typing new set of operands(numbers) from last equals operation
    if (lastInput === "equals") {
        chain = false;
        firstInput = undefined;
        secondInput = undefined;
        inputScreen.textContent = "";
        answerScreen.textContent = "";
        answerExponent.textContent = "";
        cursor.style.visibility = "visible"; 
        inputNumbers = [];
        lastOperation = [];
        step = 1;
    }

// Limits the screen input  characters
    if (inputScreen.textContent.length === inputScreenLimit) {
        cursor.classList.add("limit");
        return;  
     }


    // Sets the characteristic of pressing decimal
    if (event === ".") {
        // Puts Zero before the decimal if there is no preceding numbers yet
        if (inputNumbers.length === 0) {
            inputNumbers.push("0");    // Save additional zero to avoid problem in DEL
            lastInput = 0;             // Save additional zero to avoid problem in DEL
            inputScreen.textContent += "0";
        } else {
            // If there is already a decimal, cancels input of another 
            let decimalFound = false;
            if (inputNumbers.includes(".")) {
                decimalFound = true;
            }

            if (decimalFound === true) { 
                decimalFound = false;
                return;
            }
        }
    cursor.style.visibility = "visible";
    }

    // Sets the characteristic of pressing negative
    if (event === "-") {
    // If there is already a negative, cancels input
        let negativeFound = false;
        if (inputNumbers.includes("-")) {
            negativeFound = true;
        }

        if (negativeFound === true) {
            negativeFound = false;
            return;
        }
    cursor.style.visibility = "visible";
    }


    // Determines that the last input is a number and not an operator, 
    // even decimal will return NaN which is a number data type
    lastInput = parseFloat(event); 
    cursor.style.visibility = "visible";
    inputNumbers.push(event);
    inputScreen.textContent += event;
}

// Operators ------------

let operatorButton = document.querySelectorAll("[data-operate]");
    operatorButton.forEach(button => {
        button.addEventListener("click", operatesInputsClick);
    });

    document.addEventListener("keydown", operatesInputsPress);
    document.addEventListener("keyup", operatesInputsPress);

    let operatorsArr = [];
    function OperatorsBank (button, operation, textContent) {
        this.button = button;
        this.operation = operation;
        this.textContent = textContent;
        operatorsArr.push(this);
    } 

    // I can code this by using the node[], but choose to keep this for readability and further features 
    let multiplyButton = document.querySelector("#multiply");
    let divideButton = document.querySelector("#divide");
    let addButton = document.querySelector("#add");
    let subtractButton = document.querySelector("#subtract");
    let equalsButton = document.querySelector("#equals");

    let multiplyObj = new OperatorsBank(multiplyButton, "multiply", "×" );
    let divideObj = new OperatorsBank(divideButton, "divide", "÷" );
    let addObj = new OperatorsBank(addButton, "add", "+" );
    let subtractObj = new OperatorsBank(subtractButton, "subtract", "−" );
    let equalsObj = new OperatorsBank(equalsButton, "equals", "=" );

    function operatesInputsClick() {
        let operation = this.dataset.operate;
        switch (operation) {

            case "multiply":
                operatesInputs(multiplyObj);
                break;
            case "divide":
                operatesInputs(divideObj);
                break;
            case "add":
                operatesInputs(addObj);
                break;
            case "subtract":
                operatesInputs(subtractObj);
                break;
            case "equals":
                operatesInputs(equalsObj);
                break;
        }
    }

    function operatesInputsPress(event) {
        let keypress = event.key;

        let allowedKeys = ["*", "/", "+", "=", "Enter"]; // Subtract has special set of events

// Fires subtraction
// Ensures that subtract operation only fires when shift is not held down
        if (keypress === "Shift" || keypress === "-") {
        // shift press
            if (event.type === "keydown" && keypress === "Shift") {
                keylog.push("shiftDown");
            } else if (event.type === "keyup" && keypress === "Shift") {
                keylog.push("shiftUp");
            }
    
            if (keylog.length > 1) { // Limits the keylog Array into 1(length)
                keylog.shift();
            }

        // subtract sign press
            if (event.type === "keydown" && keypress === "-" && keylog[0] === "shiftUp") {
                    operatesInputs(subtractObj);
                }
        }
        
// Fires other operations
        if (allowedKeys.includes(keypress)) {
            if (keypress === "*") {
                operatesInputs(multiplyObj);    
            } else if (keypress === "/") {
                operatesInputs(divideObj);
            } else if (keypress === "+") {
                operatesInputs(addObj);
            } else if (keypress === "=" || keypress === "Enter") {
                operatesInputs(equalsObj);
            }
        }  
    }


let step = 1;
function operatesInputs(event) {
// Adds pressing animation   
    setTimeout(() => {
        event.button.classList.toggle("pressed");
    },100);
        event.button.classList.toggle("pressed");

     if (cursor.hasAttribute("class")) {
        cursor.classList.remove("limit");
    }

// Limits the screen input characters
    let continueOperation = false;
    cursor.style.visibility = "visible";
    if (inputScreen.textContent.length === inputScreenLimit) {
        let screenChar = [...inputScreen.textContent];
        cursor.classList.add("limit");

        screenChar.forEach(char => {
            if (char === "+" || char === "−" || char === "×" || char === "÷" ) {
                continueOperation = true;
            }
        });

        if (continueOperation === false) {
            return;
        }
    }

    let operation = event.operation;

// Does not work if last answer was exponent, large number 
    if (answerExponent.textContent.length > 0) {
        inputScreen.textContent = "Memory Full [AC]: Cancel"
        cursor.style.visibility = "hidden";
        return;
    } else if (answer != undefined) {
        if (answer.toString().length > inputScreenLimit) {
            inputScreen.textContent = "Memory Full [AC]: Cancel"
            cursor.style.visibility = "hidden";
            return; 
        }
    }

//  Does not work on Math ERROR and Syntax ERROR, requires AC
    if (answerScreen.textContent === "Math ERROR" || answerScreen.textContent === "Syntax ERROR") {
        cursor.style.visibility = "hidden";
        return;
    }

// Saves the last operation for operation function to work
    if(operation != "equals") {
        currentOperation = operation;

        if (operation != "equals") { // Don't add equals to the array
            lastOperation.push(currentOperation); //stores previous operations
        }

        //maximizes array into 2(length)
        if (lastOperation.length > 2) { 
            lastOperation.shift();
        };

        if (typeof lastInput === "number" && firstInput != undefined) {
            // Used if firstInput is already defined, 
            //  operator is pressed and awaiting second input
            currentOperation = lastOperation[0];
        } else {
            // Used if firstInput is not yet defined
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
        inputScreen.textContent += event.textContent;
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
                inputScreen.textContent += event.textContent;
                answerScreen.textContent = "";
                lastInput = operation; // advance save since there is return

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

        inputNumbers= []; //clears typing storage
        lastInput = operation; // saves operation as last input
        inputScreen.textContent += event.textContent; // puts the operator on screen
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
            inputScreen.textContent += event.textContent;
            firstInput = answer;
            secondInput = undefined;
            inputNumbers= [];
            
            chain = true;
            step = 2;
            
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
        }
        
    } else if (step === 3) {
        if (chain === true && operation != "equals") {
            inputScreen.textContent = answer;
            inputScreen.textContent += event.textContent;
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
// Check for Syntax Error
    let negRegex = /[-]/g;
    let numRegex = /[0-9]/;

    let isSyntaxError = [];
    let screenInputArr = inputScreen.textContent.split("");
    let lastIndex = 0; // records the last index of the found "-"
    screenInputArr.forEach(char => {
        if (char === "-") {
            let charIndex = screenInputArr.indexOf(char, lastIndex);
            lastIndex = charIndex + 1;
            if (charIndex != 0) {
                if (numRegex.test(screenInputArr[charIndex - 1]) === false) {
                    isSyntaxError.push(false);
                } else {
                    isSyntaxError.push(true);
                }
            }
        } 
    });

 if (isSyntaxError.includes(true)) {
    answer = "Syntax ERROR";
    return;
 }
    

// Continue operation
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
        decimalIndex = stringAnswer.length; // decimalIndex equals to string length if no decimal
    }
    
    let decimalPlaces = stringAnswer.length - decimalIndex;
    let wholeNumbers = decimalIndex; // Assign to new variable to be readable

// Handles long numbers with short whole numbers but long decimal places
    if (stringAnswer.length > answerScreenLimit && wholeNumbers < 5 && decimalPlaces > 0) {
        let result;
        if (wholeNumbers < answerScreenLimit) {
            result = number.toFixed(answerScreenLimit - wholeNumbers);
        } else {
            result = number.toFixed(wholeNumbers - answerScreenLimit);
        }

        answer = parseFloat(result); // Added for consistency in chaining operations
        answerScreen.textContent = result;

// Handles large numbers with integers greater than 5 digits
    } else if (stringAnswer.length > answerScreenLimit) { 
        let result = number.toExponential(8); //this is string, convert large number to exponential
        let expRegex = /e[+-]?\d+/; // finds the "e+num" characters
        let exponential = result.match(expRegex); // this is an array
        let powerNum;
        if (exponential[0].slice(1)[0] === "-") {
            powerNum = exponential[0].slice(1); //this is string
        } else {
            powerNum = exponential[0].slice(2); //this is string
        }

        let newIntegerRaised = result.replace(exponential[0], `×10`); //this is string

        answerScreen.textContent = newIntegerRaised; 
        answerExponent.textContent = powerNum;
         
    } else if (number === Infinity || number === -Infinity || number.toString() === "NaN" ) {
        answerScreen.textContent = "Math ERROR";
        inputScreen.textContent = "[AC] : Cancel"

    } else if (number === "Syntax ERROR") {
        answerScreen.textContent = "Syntax ERROR";
        inputScreen.textContent = "[AC] : Cancel"

    } else {
        answerScreen.textContent = answer;
    }
    cursor.style.visibility = "hidden";
}

function allClear() {
// Adds pressing animation
let acKey = document.querySelector("#ac");
    setTimeout(() => {
        allClearButton.classList.toggle("pressed");
    },100);
       allClearButton.classList.toggle("pressed");

    if (cursor.hasAttribute("class")) {
        cursor.classList.remove("limit");
    }

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

// Adds pressing animation
    setTimeout(() => {
        deleteButton.classList.toggle("pressed");
    },100);
        deleteButton.classList.toggle("pressed");
    
    if (cursor.hasAttribute("class")) {
        cursor.classList.remove("limit");
    }

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
    if (parseFloat(lastChar).toString() === "NaN" && lastChar != "." && lastChar != "-") {
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
