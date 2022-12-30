# RoutineHandler
This module provides a way to define and execute routines, subroutines and promises. A routine is a piece of code that is executed and can have success and failure handlers attached to it. A subroutine is a routine that is nested inside another routine and can be used to execute code in a specific context. A promise is a collection of routines that can be executed in parallel or in a waterfall fashion.

## Installation
To install RoutineHandler, run the following command:

```
npm install routine-handler
```

## Usage
RoutineHandler consists of three main classes: Routine, SubRoutine, and Promise.

### Routine
A Routine represents a single unit of work. It has an evaluator function that is used to determine whether the routine is a success or a failure. When a Routine is executed, it calls the appropriate success or failure handlers based on the result of the evaluator.

```
const { Routine } = require('routine-handler');

const routine = new Routine(() => Math.random() > 0.5);
routine.then(() => console.log('success!'));
routine.catch(() => console.log('failure :('));
routine.execute();
```

### SubRoutine
A SubRoutine is similar to a Routine, but it can be added as a child of another Routine. When the parent Routine is executed, it will execute all of its child SubRoutines as well.

```
const { Routine, SubRoutine } = require('routine-handler');

const parentRoutine = new Routine(() => Math.random() > 0.5);
const subRoutine = new SubRoutine(() => Math.random() > 0.5);
subRoutine.setParentRoutine(parentRoutine);

parentRoutine.then(() => console.log('parent success!'));
parentRoutine.catch(() => console.log
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
