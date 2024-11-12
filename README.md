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
# Automating Content Generation and Sentiment Analysis with RoutineJS

## Overview
This example demonstrates how to automate the process of generating content with GPT-3 and analyzing its sentiment with the Aylien API. The automation is structured into a routine using **RoutineJS**, which chains two AI models to work together: GPT-3 for content generation and Aylien for sentiment analysis. The workflow retries the content generation if the sentiment is negative.

## Explanation

### Routine Setup
We create a `Routine` instance with two subroutines:
1. **`generateContent`**: Calls OpenAI’s GPT-3 API to generate content based on a prompt.
2. **`analyzeSentiment`**: Uses the Aylien Sentiment Analysis API to analyze the sentiment of the generated text.

### Subroutines
- **`generateContent`**: 
  - This subroutine sends a request to OpenAI’s GPT-3 API to generate a creative blog post about a given topic (e.g., AI in healthcare).
  - It returns the generated content.

- **`analyzeSentiment`**: 
  - This subroutine sends the generated content to the Aylien API to analyze its sentiment.
  - The sentiment is categorized as **positive**, **neutral**, or **negative**.

### Evaluators
After generating the content, an evaluator checks the sentiment of the text:
- If the sentiment is **negative**, the evaluator will return `false`, causing the routine to retry the content generation.
- If the sentiment is **positive** or **neutral**, the evaluation passes, and the process completes successfully.

### Event Handling
- If the routine completes successfully, the generated content and its sentiment are logged.
- Custom events (e.g., `start`, `complete`, `error`) can be handled using `RoutineJS`'s event handling methods.

## Key Notes
- **API Keys**: Replace `your-openai-api-key` with your actual OpenAI API key, and replace `your-aylien-api-key` and `your-aylien-app-id` with your Aylien credentials.
- **Retries**: The content generation will retry if the sentiment is negative, based on the evaluator’s logic.
- **Chaining Models**: The routine allows chaining different AI models in a structured flow, with retry mechanisms and evaluations based on results.

## Example Code

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

## Using routinesjs with workers

```
import Routine from './ModernRoutine.js';
import Worker from './Worker.js';

// Create the first routine
const routine1 = new Routine('routine1')
  .addSubroutine('step1', async () => {
    console.log('Routine 1: Step 1 executed');
    return { data: 'Initial data' };
  });

// Create the second routine
const routine2 = new Routine('routine2')
  .addSubroutine('step2', async (initialData) => {
    console.log('Routine 2: Step 2 executed');
    return { ...initialData, data: `${initialData.data} + Additional data` };
  })
  .addEvaluator('step2', async (result, worker1State) => {
    console.log('Routine 2: Evaluating result');
    const worker1Results = worker1State.routine.state.results;
    const worker1Step1Result = worker1Results.get('step1');
    return worker1Step1Result.data === 'Initial data';
  });

// Create the third routine
const routine3 = new Routine('routine3')
  .addSubroutine('step3', async (initialData, results, worker1State, worker2State) => {
    console.log('Routine 3: Step 3 executed');
    const worker1Results = worker1State.routine.state.results;
    const worker2Results = worker2State.routine.state.results;
    const worker1Step1Result = worker1Results.get('step1');
    const worker2Step2Result = worker2Results.get('step2');
    return { ...initialData, data: `${worker2Step2Result.data} + Final data` };
  })
  .addEvaluator('step3', async (result, worker1State, worker2State) => {
    console.log('Routine 3: Evaluating result');
    const worker2Results = worker2State.routine.state.results;
    const worker2Step2Result = worker2Results.get('step2');
    return worker2Step2Result.data.includes('Additional data');
  });

// Create workers with the routines
const worker1 = new Worker('worker1', routine1);
const worker2 = new Worker('worker2', routine2);
const worker3 = new Worker('worker3', routine3);

// Run the workers
worker1.run()
  .then(results => console.log('Worker 1 completed:', results))
  .catch(error => console.error('Worker 1 error:', error));

worker2.run()
  .then(results => console.log('Worker 2 completed:', results))
  .catch(error => console.error('Worker 2 error:', error));

worker3.run(null, worker1, worker2)
  .then(results => console.log('Worker 3 completed:', results))
  .catch(error => console.error('Worker 3 error:', error));
```

## Event driven usage of routinejs and workers

```
import Routine from './ModernRoutine.js';
import Worker from './Worker.js';

// Create the first routine
const routine1 = new Routine('routine1')
  .addSubroutine('step1', async () => {
    console.log('Routine 1: Step 1 executed');
    return { data: 'Initial data' };
  });

// Create the second routine
const routine2 = new Routine('routine2')
  .addSubroutine('step2', async (initialData, results, worker1Event) => {
    console.log('Routine 2: Step 2 executed');
    const worker1Result = await new Promise((resolve) => {
      worker1Event.addEventListener('worker1Complete', (event) => {
        resolve(event.detail.result);
      });
    });
    return { ...initialData, data: `${worker1Result.data} + Additional data` };
  })
  .addEvaluator('step2', async (result) => {
    console.log('Routine 2: Evaluating result');
    return result.data.includes('Initial data');
  });

// Create the third routine
const routine3 = new Routine('routine3')
  .addSubroutine('step3', async (initialData, results, worker1Event, worker2Event) => {
    console.log('Routine 3: Step 3 executed');
    const worker1Result = await new Promise((resolve) => {
      worker1Event.addEventListener('worker1Complete', (event) => {
        resolve(event.detail.result);
      });
    });
    const worker2Result = await new Promise((resolve) => {
      worker2Event.addEventListener('worker2Complete', (event) => {
        resolve(event.detail.result);
      });
    });
    return { ...initialData, data: `${worker2Result.data} + Final data` };
  })
  .addEvaluator('step3', async (result) => {
    console.log('Routine 3: Evaluating result');
    return result.data.includes('Additional data');
  });

// Create workers with the routines
const worker1 = new Worker('worker1', routine1);
const worker2 = new Worker('worker2', routine2);
const worker3 = new Worker('worker3', routine3);

// Run the workers
worker1.run()
  .then(results => {
    console.log('Worker 1 completed:', results);
    worker1.emit('worker1Complete', { result: results });
  })
  .catch(error => console.error('Worker 1 error:', error));

worker2.run(null, worker1)
  .then(results => {
    console.log('Worker 2 completed:', results);
    worker2.emit('worker2Complete', { result: results });
  })
  .catch(error => console.error('Worker 2 error:', error));

worker3.run(null, worker1, worker2)
  .then(results => console.log('Worker 3 completed:', results))
  .catch(error => console.error('Worker 3 error:', error));
```

## Contributing
If you'd like to contribute to the project, feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License.

For more information, please refer to the documentation.





