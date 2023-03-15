This library provides a set of classes to help you create and manage trading bot routines using a custom implementation based on native JavaScript `Promise` and `async/await`.

Classes
-------

### Evaluator

The `Evaluator` class is responsible for evaluating a function that returns a boolean result. This can be useful for determining the success or failure of a particular trading strategy.

#### Constructor

javascriptCopy code

`constructor(evaluatorFunction: Function)`

-   `evaluatorFunction`: A function that returns a boolean value. This function will be executed when the `Evaluator` is asked to evaluate the success or failure of a trading strategy.

#### Methods

javascriptCopy code

`async evaluate(): Promise<boolean>`

-   Returns a `Promise` that resolves to a boolean value, the result of executing the evaluator function.

### Routine

The `Routine` class represents a single trading routine. It contains an `Evaluator` instance, an array of success handlers, an array of failure handlers, and an array of subroutines.

#### Constructor

javascriptCopy code

`constructor(evaluator: Evaluator)`

-   `evaluator`: An instance of the `Evaluator` class.

#### Methods

javascriptCopy code

`then(successHandler: Function): Routine`

-   Adds a success handler function that will be called if the `Evaluator` returns `true`.
-   Returns the `Routine` instance, allowing for method chaining.

javascriptCopy code

`catch(failureHandler: Function): Routine`

-   Adds a failure handler function that will be called if the `Evaluator` returns `false` or throws an error.
-   Returns the `Routine` instance, allowing for method chaining.

javascriptCopy code

`addSubRoutine(routine: Routine): Routine`

-   Adds a subroutine to the current routine. Subroutines will be executed after the main routine has been executed.
-   Returns the `Routine` instance, allowing for method chaining.

javascriptCopy code

`async execute(): Promise<void>`

-   Executes the routine by calling the `Evaluator`'s `evaluate` method.
-   If the evaluation is successful, calls all success handlers.
-   If the evaluation fails or throws an error, calls all failure handlers.
-   Executes all subroutines.

Usage
-----

javascriptCopy code

`const { Routine, Evaluator } = require('./trading-bot-routine-library');

// Define the evaluator function
const evaluatorFunction = async () => {
  // Perform your evaluation logic here
  // Return true or false based on your criteria
};

// Create an Evaluator instance
const evaluator = new Evaluator(evaluatorFunction);

// Create a Routine instance
const routine = new Routine(evaluator);

// Add success and failure handlers
routine
  .then(() => {
    console.log('Success');
  })
  .catch((error) => {
    console.error('Failure', error);
  });

// Execute the routine
routine.execute();`

To execute multiple routines in parallel, you can use `Promise.all()`:

javascriptCopy code

`const routines = [routine1, routine2, routine3];

Promise.all(routines.map((routine) => routine.execute()));`

To execute routines sequentially, you can use a `for` loop with `async/await`:

javascriptCopy code

`async function executeRoutinesSequentially(routines) {
  for (const routine of routines) {
    await routine.execute();
  }
}

executeRoutinesSequentially([routine1, routine2, routine3]);`

License
-------

MIT
