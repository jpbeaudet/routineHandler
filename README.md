# Routine.js v3

Routine.js v3 is a modern and flexible JavaScript library for managing and executing routines with subroutines, evaluators, retry logic, and event-driven workflows. It allows you to define, execute, and evaluate tasks (subroutines) in a controlled and reliable manner, with support for retries, timeouts, and event-based interactions.

## Features

- **Subroutines:** Define functions that can be executed as part of a routine.
- **Evaluators:** Attach evaluators to subroutines to evaluate results.
- **Retry Logic:** Automatically retry failed subroutines up to a maximum number of retries.
- **Timeouts:** Set timeouts for subroutines to prevent long-running operations.
- **Event Handling:** Easily subscribe to routine events like `start`, `complete`, `error`, and more.
- **State Management:** Track the state of a routine including current subroutine, error, and results.
- **Customizable Options:** Control retry delay, timeout, and maximum retries.

## Installation

You can install `routinejs` via npm or yarn:

```bash
npm install routinejs
or

bash
Copy code
yarn add routinejs
Usage
Basic Setup
To start using Routine.js, simply import and create a new routine instance:

javascript
Copy code
import Routine from 'routinejs';

const routine = new Routine('MyRoutine', {
  maxRetries: 5,
  retryDelay: 1000,
  timeout: 5000
});
Adding Subroutines
Add a subroutine by specifying a name, action (function), and optionally an evaluator:

javascript
Copy code
routine.addSubroutine('subroutine1', async () => {
  // Your subroutine logic here
  return 'Result from subroutine1';
}, async (result) => {
  // Optional: Evaluator for subroutine1
  console.log(`Evaluating: ${result}`);
  return result === 'Result from subroutine1'; // Return true or false
});
Executing a Routine
To execute the routine and its subroutines:

javascript
Copy code
routine.execute().then((results) => {
  console.log('Routine completed with results:', results);
}).catch((error) => {
  console.error('Routine failed with error:', error);
});
Event Handling
You can subscribe to various events during the routine execution:

javascript
Copy code
routine.on('start', (data) => {
  console.log('Routine started at:', data.timestamp);
});

routine.on('complete', (data) => {
  console.log('Routine completed with results:', data.results);
});

routine.on('error', (data) => {
  console.error('Routine error:', data.error);
});
State Management
You can access the current state of the routine:

javascript
Copy code
const state = routine.getState();
console.log(state);
Resetting a Routine
Reset the state of the routine to start fresh:

javascript
Copy code
routine.reset();
API
Routine(name, options)
name: The name of the routine.
options: Optional configuration object. Available options:
maxRetries: Maximum number of retries for subroutines (default: 3).
retryDelay: Delay between retries in milliseconds (default: 1000).
timeout: Timeout for each subroutine in milliseconds (default: 30000).
addSubroutine(name, action, evaluator)
name: The name of the subroutine.
action: The function representing the subroutine logic.
evaluator: Optional function to evaluate the result of the subroutine.
addEvaluator(name, evaluator)
name: The name of the subroutine to attach the evaluator to.
evaluator: The evaluation function.
executeSubroutine(name, ...args)
Executes a specific subroutine with retry logic.

name: The name of the subroutine.
args: The arguments passed to the subroutine.
execute(initialData)
Executes the entire routine with optional initial data.

initialData: Optional data passed to the subroutines at the beginning.
on(eventName, callback)
Listens to routine events such as start, complete, error, and custom events.

eventName: The name of the event to listen for.
callback: The callback function to execute when the event is emitted.
getState()
Returns the current state of the routine, including subroutine count, evaluator count, and more.

reset()
Resets the routine state.

Example
Here’s an example of defining a routine with subroutines and evaluators:

javascript
Copy code
import Routine from 'routinejs';

const routine = new Routine('MyRoutine', {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 5000
});

routine.addSubroutine('fetchData', async () => {
  // Simulate fetching data
  return { success: true, data: [1, 2, 3] };
}, async (result) => {
  if (result.success) {
    return result.data;
  }
  throw new Error('Data fetch failed');
});

routine.addSubroutine('processData', async (data) => {
  // Simulate processing data
  return data.map(item => item * 2);
});

routine.execute().then((results) => {
  console.log('Routine completed with results:', results);
}).catch((error) => {
  console.error('Routine failed with error:', error);
});
Contributing
If you'd like to contribute to the project, feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License.

For more information, please refer to the documentation.

vbnet
Copy code

This README covers installation, usage, API references, and basic examples of how to use the `Routine.js v3` library, including new features like retry logic, timeouts, and event handling.





