# RoutineHandler
RoutineHandler is a JavaScript library for creating and executing nested routines. It provides a flexible and powerful way to structure your asynchronous code and build complex logic trees.

## Installation
To install RoutineHandler, run the following command:
'
npm install routine-handler

'

## Usage
RoutineHandler consists of three main classes: Routine, SubRoutine, and Promise.

### Routine
A Routine represents a single unit of work. It has an evaluator function that is used to determine whether the routine is a success or a failure. When a Routine is executed, it calls the appropriate success or failure handlers based on the result of the evaluator.

'
const { Routine } = require('routine-handler');

const routine = new Routine(() => Math.random() > 0.5);
routine.then(() => console.log('success!'));
routine.catch(() => console.log('failure :('));
routine.execute();
'

### SubRoutine
A SubRoutine is similar to a Routine, but it can be added as a child of another Routine. When the parent Routine is executed, it will execute all of its child SubRoutines as well.

'
const { Routine, SubRoutine } = require('routine-handler');

const parentRoutine = new Routine(() => Math.random() > 0.5);
const subRoutine = new SubRoutine(() => Math.random() > 0.5);
subRoutine.setParentRoutine(parentRoutine);

parentRoutine.then(() => console.log('parent success!'));
parentRoutine.catch(() => console.log
'
