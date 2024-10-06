# Calculator

## About
A calculator web app that solves basic math operations. Built with interactive display and button mapping.

## Objective
Create a calculator web app that solves basic math operations utilizing fundamental JavaScript concept, combined with HTML and CSS for a functional on-screen display.

The project showcases use of objects and array methods to solve problems. 

In addition, this project features on-screen interaction and keyboard button presses to execute actions. 

## Manual
1. The on-screen button consists numbers and operator symbols the user can press to solve math operations. A screen display is provided to show user actions.

2. **Del** button deletes a digit or the operator.

3. **AC** button clears the calculator memory, resets on-going action and clear the screen display.

4. The calculator requires a *first number*, an *operator* and a *second number* to process operation. This is the standard operation sequence.

5. The user can however, press an *operator* first, and a 0 will represent the *first number*. Also, pressing the **=** symbol after the *first number* will equate the given number as *answer*. Then, pressing **=** symbol after the *operator* will result to a syntax error.

6. When there's already a *first number*, an *operator* and a *second number*, the user can press **=** to execute the math operation. The answer will display on the lower part of the calculator screen. The answer will be saved in a memory.

7. If the *answer* is still displayed and saved to memory, then the user decides to press a new *operator*, the *answer* from memory will be assigned as the new *first number* with the new *operator*, awaiting for a new *second number* from the user. This allow chaining of operations.

8. However, if the user press a new number while an *answer* is in display and in memory, the memory will be cleared and the newly pressed number will be assigned as *first number*. The user can then continue the sequence.

9. If the user press another *operator* after the *second number* instead of *=* to equate result, the current operation will execute. Then, the *answer* to the operation will be assigned as *first number* for the next operation that is awaiting for a new *second number* for the user to provide.

10. The calculator was scripted to limit very large numbers and detect syntax error (i.e operations equating without a *second number*) and math error (i.e. dividing a number by 0), the **AC** button will escape the user from the error screen.

11. The calculator is mapped for keyboard functions:
- DEL - Backspace | Delete
- AC - Esc | End
- EQUAL - Enter
- NEGATIVE ( - ) - Shift + [ - ]
- INFO/CALC FLIP - PgUp | PgDn | I
- Numbers and operators can be accessed through the numpad and number row keys

An info button is located at the upper right side of the calculator that the user can press to access some information.

## Live Preview
This project can be viewed on [Calculator](https://makieldeviso.github.io/calculator/)

Credits to:
[AMIGO TOTAL](https://giphy.com/amigototal/)