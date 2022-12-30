# RoutineHandler
Routine-Handler is a JavaScript library for organizing and executing tasks, or "routines," in a specific order. It allows you to attach success and failure handlers to routines, and to specify the conditions for determining whether a routine was successful or failed using evaluators. You can also create subroutines that are linked to a parent routine, and execute routines in parallel or in a waterfall queue.

## Installation
To install RoutineHandler, run the following command:

```
npm install routine-handler
```

## Basic Usage
To use Routine-Handler, you'll first need to import the Routine and Evaluator classes:

```
const { Routine, Evaluator } = require('routine-handler');
```

Next, create an instance of the Evaluator class by passing in a function that returns a boolean value indicating whether the routine was successful or not:

```
const evaluator = new Evaluator(() => {
  // Perform some task and return true if successful, false if not
  return taskWasSuccessful;
});
```

Then, create an instance of the Routine class by passing in the evaluator you just created:

```
const routine = new Routine(evaluator);

```

You can now attach success and failure handlers to the routine using the then and catch methods:

```
routine.then(() => {
  console.log('Routine was successful');
});

routine.catch(() => {
  console.log('Routine failed');
});

```

To execute the routine, simply call the execute method:

```
routine.execute();

```
### Evaluators
Evaluators allow you to specify the conditions for determining whether a routine was successful or failed. You can create an evaluator by extending the Evaluator class and defining your own evaluate method:

```
class MyEvaluator extends Evaluator {
  evaluate() {
    // Perform some task and return true if successful, false if not
    return taskWasSuccessful;
  }
}

```

You can then use this evaluator when creating a routine:

```
const evaluator = new MyEvaluator();
const routine = new Routine(evaluator);

```

### Creating a Subroutine
Subroutines are routines that are linked to a parent routine. When the parent routine is successful, the subroutines will be executed in the order they were added. To create a subroutine, you can use the SubRoutine class, which extends the Routine class:

```
const subRoutine = new SubRoutine(evaluator);

```

To link the subroutine to a parent routine, you can use the setParentRoutine method:

```
subRoutine.setParentRoutine(routine);

```

You can then add the subroutine to the parent routine using the addSubRoutine method:

```
routine.addSubRoutine(subRoutine);

```

### Creating a Promise
A promise is an object that can contain one or more routines, and provides a way to execute them all at once. The promise can be configured to execute the routines in parallel or in a waterfall fashion.

```
const { Routine } = require('routine-handler');

const promise = new Promise();

// Add some routines to the promise
promise.addRoutine(routine1);
promise.addRoutine(routine2);
promise.addRoutine(routine3);

// Execute the routines in parallel
promise.execute();

// Execute the routines in a waterfall fashion
promise.addQueue('waterfall').execute();
```
### Attaching Success and Failure Handlers
You can attach success and failure handlers to a routine or a promise using the then and catch methods.
```
const { Routine } = require('routine-handler');
routine.then(() => {
  console.log('Routine was successful');
});

routine.catch(() => {
  console.log('Routine failed');
});

promise.then(() => {
  console.log('All routines were successful');
});

promise.catch(() => {
  console.log('At least one routine failed');
});

```

Here is an example of how to use the module:

```
const { Routine, SubRoutine, Promise } = require('routine-handler');

// Define a routine that checks if a number is even
const isEvenRoutine = new Routine((x) => x % 2 === 0);

// Define a routine that adds two numbers
const addRoutine = new Routine((x, y) => x + y);

// Define a subroutine that multiplies a number by 2
const multiplyByTwoRoutine = new SubRoutine((x) => x * 2);

// Add the multiplyByTwoRoutine as a subroutine of the addRoutine
addRoutine.addSubRoutine(multiplyByTwoRoutine);

// Create a promise and add the isEvenRoutine and addRoutine to it
const promise = new Promise()
  .addRoutine(isEvenRoutine)
  .addRoutine(addRoutine);

// Set the promise to execute routines in a waterfall fashion
promise.addQueue('waterfall');

// Attach success and failure handlers to the routines
isEvenRoutine.then(() => console.log('Number is even'))
  .catch(() => console.log('Number is odd'));

addRoutine.then((result) => console.log(`Result: ${result}`))
  .catch((error) => console.log(`Error: ${error}`));

// Execute the promise
promise.execute();
```
