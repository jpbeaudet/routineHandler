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

```
npm install routinejs
or
```

```
yarn add routinejs
```
## Usage
### Basic Setup
To start using Routine.js, simply import and create a new routine instance:

```
import Routine from 'routinejs';

const routine = new Routine('MyRoutine', {
  maxRetries: 5,
  retryDelay: 1000,
  timeout: 5000
});
```
### Adding Subroutines
Add a subroutine by specifying a name, action (function), and optionally an evaluator:
```
routine.addSubroutine('subroutine1', async () => {
  // Your subroutine logic here
  return 'Result from subroutine1';
}, async (result) => {
  // Optional: Evaluator for subroutine1
  console.log(`Evaluating: ${result}`);
  return result === 'Result from subroutine1'; // Return true or false
});
```

### Executing a Routine
To execute the routine and its subroutines:

```
routine.execute().then((results) => {
  console.log('Routine completed with results:', results);
}).catch((error) => {
  console.error('Routine failed with error:', error);
});
```

### Event Handling
You can subscribe to various events during the routine execution:

```
routine.on('start', (data) => {
  console.log('Routine started at:', data.timestamp);
});

routine.on('complete', (data) => {
  console.log('Routine completed with results:', data.results);
});

routine.on('error', (data) => {
  console.error('Routine error:', data.error);
});
```
### State Management
You can access the current state of the routine:

```
const state = routine.getState();
console.log(state);
```

### Resetting a Routine
Reset the state of the routine to start fresh:

```
routine.reset();
```

## API

### `Routine(name, options)`
- **name**: The name of the routine.
- **options**: Optional configuration object. Available options:
  - `maxRetries`: Maximum number of retries for subroutines (default: 3).
  - `retryDelay`: Delay between retries in milliseconds (default: 1000).
  - `timeout`: Timeout for each subroutine in milliseconds (default: 30000).

### `addSubroutine(name, action, evaluator)`
- **name**: The name of the subroutine.
- **action**: The function representing the subroutine logic.
- **evaluator**: Optional function to evaluate the result of the subroutine.

### `addEvaluator(name, evaluator)`
- **name**: The name of the subroutine to attach the evaluator to.
- **evaluator**: The evaluation function.

### `executeSubroutine(name, ...args)`
Executes a specific subroutine with retry logic.
- **name**: The name of the subroutine.
- **args**: The arguments passed to the subroutine.

### `execute(initialData)`
Executes the entire routine with optional initial data.
- **initialData**: Optional data passed to the subroutines at the beginning.

### `on(eventName, callback)`
Listens to routine events such as `start`, `complete`, `error`, and custom events.
- **eventName**: The name of the event to listen for.
- **callback**: The callback function to execute when the event is emitted.

### `getState()`
Returns the current state of the routine, including subroutine count, evaluator count, and more.

### `reset()`
Resets the routine state.

### Example
Here’s an example of defining a routine with subroutines and evaluators:

```
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
```
## Exemple is Usage

```
import Routine from './routinejsv3'; // Assuming you've imported the Routine class

// Define the GPT-3 and Aylien API endpoints
const OPENAI_API_KEY = 'your-openai-api-key';
const AYLIEN_API_KEY = 'your-aylien-api-key';

// Function to call GPT-3 for content generation
async function generateContent() {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: 'Generate a creative blog post about AI in healthcare.',
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

// Function to call Aylien Sentiment Analysis API
async function analyzeSentiment(text) {
  const response = await fetch('https://api.aylien.com/api/v1/sentiment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AYLIEN-TextAPI-Application-Key': AYLIEN_API_KEY,
      'X-AYLIEN-TextAPI-Application-ID': 'your-aylien-app-id', // replace with your Aylien app ID
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  return data.polarity; // returns 'positive', 'neutral', or 'negative'
}

// Create the routine instance
const routine = new Routine('ContentGenerationRoutine', { maxRetries: 3, timeout: 30000 });

// Add subroutine for generating content
routine.addSubroutine('generateContent', generateContent);

// Add evaluator for sentiment analysis
routine.addSubroutine('analyzeSentiment', analyzeSentiment);

// Add evaluation logic for sentiment (positive is good, negative should trigger re-run)
routine.addEvaluator('analyzeSentiment', async (sentiment) => {
  if (sentiment === 'negative') {
    console.log('Sentiment was negative. Regenerating content...');
    return false; // Failed evaluation; we will retry content generation
  } else {
    return true; // Sentiment is acceptable
  }
});

// Execute the routine
async function runRoutine() {
  try {
    const result = await routine.execute();
    const generatedContent = result.get('generateContent');
    const sentiment = result.get('analyzeSentiment');

    if (sentiment === 'positive' || sentiment === 'neutral') {
      console.log('Generated Content:', generatedContent);
      console.log('Sentiment:', sentiment);
    }
  } catch (error) {
    console.error('Error executing routine:', error);
  }
}

runRoutine();
```

## Contributing
If you'd like to contribute to the project, feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License.

For more information, please refer to the documentation.





