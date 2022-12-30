# RoutineHandler
This module provides a way to define and execute routines, subroutines and promises. A routine is a piece of code that is executed and can have success and failure handlers attached to it. A subroutine is a routine that is nested inside another routine and can be used to execute code in a specific context. A promise is a collection of routines that can be executed in parallel or in a waterfall fashion.

## Installation
To install RoutineHandler, run the following command:

```
npm install routine-handler
```

## Usage
RoutineHandler consists of three main classes: Routine, SubRoutine, and Promise.

### Creating a Routine
To create a routine, you need to define an evaluator function that returns a boolean value indicating whether the routine was successful or not. You can then attach success and failure handlers to the routine using the then and catch methods.

```
const { Routine } = require('routine-handler');

const routine = new Routine(() => {
  // Perform some task here
  // Return true if the task was successful, false otherwise
});

routine.then(() => {
  console.log('Routine was successful');
});

routine.catch(() => {
  console.log('Routine failed');
});

```

### Creating a Subroutine
A subroutine is a routine that is attached to another routine as a child. When the parent routine is executed, all of its subroutines will also be executed.

```
const { Routine } = require('routine-handler');

const parentRoutine = new Routine(() => {
  // Perform some task here
  // Return true if the task was successful, false otherwise
});

const childRoutine = new SubRoutine(() => {
  // Perform some task here
  // Return true if the task was successful, false otherwise
});

parentRoutine.addSubRoutine(childRoutine);

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
