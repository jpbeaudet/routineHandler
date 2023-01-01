# Routinejs
Routine-Handler is a JavaScript library for organizing and executing tasks, or "routines," in a specific order. It allows you to attach success and failure handlers to routines, and to specify the conditions for determining whether a routine was successful or failed using evaluators. You can also create subroutines that are linked to a parent routine, and execute routines in parallel or in a waterfall queue.

## Installation
To install RoutineHandler, run the following command:

```
npm install routinejs
```

## Basic Usage
To use Routine-Handler, you'll first need to import the Routine and Evaluator classes:

```
const { Routine, Evaluator } = require('routinejs');
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
Promises allow you to execute multiple routines in parallel or in a waterfall queue. To create a promise, you can use the Promise class:

```
const promise = new Promise();

```

You can add routines to the promise using the addRoutine method:

```
promise.addRoutine(routine1);
promise.addRoutine(routine2);

```

By default, routines are executed in parallel. If you want to execute routines in a waterfall queue, you can use the addQueue method:

```
promise.addQueue('waterfall');
```

You can attach success and failure handlers to the promise using the then and catch methods:

```
promise.then(() => {
  console.log('All routines were successful');
});

promise.catch(() => {
  console.log('At least one routine failed');
});

```

To execute the promise, simply call the execute method:

```
promise.execute();

```

### Examples
Here are some examples showing how to use Routine-Handler:

#### Using Evaluators with a Routine

```
const { Routine } = require('routinejs');

const evaluator = new Evaluator(() => {
  // Perform some task and return true if successful, false if not
  return taskWasSuccessful;
});

const routine = new Routine(evaluator);

routine.then(() => {
  console.log('Routine was successful');
}).catch(() => {
  console.log('Routine failed');
}).evaluate(() => {
  // Perform some task and return true if successful, false if not
  return taskWasSuccessful;
}, () => {
  console.log('Routine was successful according to the evaluator');
}).evaluate(() => {
  // Perform some task and return true if successful, false if not
  return !taskWasSuccessful;
}, () => {
  console.log('Routine failed according to the evaluator');
});

routine.execute();


```

#### Using Evaluators with a Promise

```
const { Promise } = require('routinejs');

const evaluator1 = new Evaluator(() => {
  // Perform some task and return true if successful, false if not
  return task1WasSuccessful;
});

const evaluator2 = new Evaluator(() => {
  // Perform some task and return true if successful, false if not
  return task2WasSuccessful;
});

const routine1 = new Routine(evaluator1);
const routine2 = new Routine(evaluator2);

const promise = new Promise();
promise
  .addRoutine(routine1)
  .addRoutine(routine2)
  .addQueue('parallel');

promise.then(() => {
  console.log('All routines were successful');
}).catch(() => {
  console.log('At least one routine failed');
});

promise.execute();

```
