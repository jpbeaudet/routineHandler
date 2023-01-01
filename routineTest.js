// Evaluator Class
const mockEvaluatorFunction = jest.fn();

beforeEach(() => {
  // Reset the mock function before each test
  mockEvaluatorFunction.mockReset();
});

test('Evaluator should return the result of the evaluator function', () => {
  mockEvaluatorFunction.mockReturnValue(true);
  const evaluator = new Evaluator(mockEvaluatorFunction);
  expect(evaluator.evaluate()).toBe(true);
});

test('Evaluator should throw an error if the constructor is called with a non-function', () => {
  expect(() => new Evaluator('not a function')).toThrow('`evaluatorFunction` must be a function');
});
// Routine Class
const mockEvaluator = {
  evaluate: jest.fn(),
};

const mockSuccessHandler = jest.fn();
const mockFailureHandler = jest.fn();

beforeEach(() => {
  // Reset the mock functions before each test
  mockEvaluator.evaluate.mockReset();
  mockSuccessHandler.mockReset();
  mockFailureHandler.mockReset();
});

test('Routine should call the success handlers if the evaluator function returns true', () => {
  mockEvaluator.evaluate.mockReturnValue(true);
  const routine = new Routine(mockEvaluator);
  routine.then(mockSuccessHandler);
  routine.execute();
  expect(mockSuccessHandler).toHaveBeenCalled();
  expect(mockFailureHandler).not.toHaveBeenCalled();
});

test('Routine should call the failure handlers if the evaluator function returns false', () => {
  mockEvaluator.evaluate.mockReturnValue(false);
  const routine = new Routine(mockEvaluator);
  routine.catch(mockFailureHandler);
  routine.execute();
  expect(mockSuccessHandler).not.toHaveBeenCalled();
  expect(mockFailureHandler).toHaveBeenCalled();
});

test('Routine should call the failure handlers if the evaluator function throws an error', () => {
  mockEvaluator.evaluate.mockImplementation(() => {
    throw new Error('Evaluator error');
  });
  const routine = new Routine(mockEvaluator);
  routine.catch(mockFailureHandler);
  routine.execute();
  expect(mockSuccessHandler).not.toHaveBeenCalled();
  expect(mockFailureHandler).toHaveBeenCalledWith(new Error('Evaluator error'));
});

test('Routine should call the success handlers of subroutines if the evaluator function returns true', () => {
  mockEvaluator.evaluate.mockReturnValue(true);
  const routine = new Routine(mockEvaluator);
  const subRoutine = new SubRoutine({ evaluate: () => true });
  subRoutine.then(mockSuccessHandler);
  routine.addSubRoutine(subRoutine);
  routine.execute();
  expect(mockSuccessHandler).toHaveBeenCalled();
  expect(mockFailureHandler).not.toHaveBeenCalled();
});

test('Routine should call the failure handlers of subroutines if the evaluator function returns false', () => {
  mockEvaluator.evaluate.mockReturnValue(false);
  const routine = new Routine(mockEvaluator);
  const subRoutine = new SubRoutine({ evaluate: () => false });
  subRoutine.catch(mockFailureHandler);
  routine.addSubRoutine(subRoutine);
  routine.execute();
  expect(mockSuccessHandler).not.toHaveBeenCalled();
  expect(mockFailureHandler).toHaveBeenCalled();
});

test('Routine should throw an error if the constructor is called with a non-Evaluator object', () => {
  expect(() => new Routine({})).toThrow('`evaluator` must be an instance of `Evaluator`');
});

test('then should add a success handler to the successHandlers array', () => {
  const routine = new Routine(mockEvaluator);
  routine.then(mockSuccessHandler);
  expect(routine.successHandlers).toEqual([mockSuccessHandler]);
});

test('then should throw an error if called with a non-function', () => {
  const routine = new Routine(mockEvaluator);
  expect(() => routine.then('not a function')).toThrow('`successHandler` must be a function');
});

test('catch should add a failure handler to the failureHandlers array', () => {
  const routine = new Routine(mockEvaluator);
  routine.catch(mockFailureHandler);
  expect(routine.failureHandlers).toEqual([mockFailureHandler]);
});

test('catch should throw an error if called with a non-function', () => {
  const routine = new Routine(mockEvaluator);
  expect(() => routine.catch('not a function')).toThrow('`failureHandler` must be a function');
});

test('addSubRoutine should add a routine to the subRoutines array', () => {
  const routine = new Routine(mockEvaluator);
  const subRoutine = new SubRoutine(mockEvaluator);
  routine.addSubRoutine(subRoutine);
  expect(routine.subRoutines).toEqual([subRoutine]);
});

test('addSubRoutine should throw an error if called with a non-Routine object', () => {
  const routine = new Routine(mockEvaluator);
  expect(() => routine.addSubRoutine({})).toThrow('`routine` must be an instance of `Routine`');
});
// Subroutine Class
const mockEvaluator = {
  evaluate: jest.fn(),
};

const mockSuccessHandler = jest.fn();
const mockFailureHandler = jest.fn();

beforeEach(() => {
  // Reset the mock functions before each test
  mockEvaluator.evaluate.mockReset();
  mockSuccessHandler.mockReset();
  mockFailureHandler.mockReset();
});

test('SubRoutine should call the success handlers if the evaluator function returns true', () => {
  mockEvaluator.evaluate.mockReturnValue(true);
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.then(mockSuccessHandler);
  subRoutine.execute();
  expect(mockSuccessHandler).toHaveBeenCalled();
  expect(mockFailureHandler).not.toHaveBeenCalled();
});

test('SubRoutine should call the failure handlers if the evaluator function returns false', () => {
  mockEvaluator.evaluate.mockReturnValue(false);
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.catch(mockFailureHandler);
  subRoutine.execute();
  expect(mockSuccessHandler).not.toHaveBeenCalled();
  expect(mockFailureHandler).toHaveBeenCalled();
});

test('SubRoutine should call the failure handlers if the evaluator function throws an error', () => {
  mockEvaluator.evaluate.mockImplementation(() => {
    throw new Error('Evaluator error');
  });
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.catch(mockFailureHandler);
  subRoutine.execute();
  expect(mockSuccessHandler).not.toHaveBeenCalled();
  expect(mockFailureHandler).toHaveBeenCalledWith(new Error('Evaluator error'));
});

test('setParentRoutine should set the parentRoutine property', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  const parentRoutine = new Routine(mockEvaluator);
  subRoutine.setParentRoutine(parentRoutine);
  expect(subRoutine.parentRoutine).toBe(parentRoutine);
});

test('SubRoutine should throw an error if the constructor is called with a non-Evaluator object', () => {
  expect(() => new SubRoutine({})).toThrow('`evaluator` must be an instance of `Evaluator`');
});

test('then should add a success handler to the successHandlers array', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.then(mockSuccessHandler);
  expect(subRoutine.successHandlers).toEqual([mockSuccessHandler]);
});

test('then should throw an error if called with a non-function', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  expect(() => subRoutine.then('not a function')).toThrow('`successHandler` must be a function');
});

test('catch should add a failure handler to the failureHandlers array', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.catch(mockFailureHandler);
  expect(subRoutine.failureHandlers).toEqual([mockFailureHandler]);
});

test('catch should throw an error if called with a non-function', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  expect(() => subRoutine.catch('not a function')).toThrow('`failureHandler` must be a function');
});

test('setParentRoutine should throw an error if called with a non-Routine object', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  expect(() => subRoutine.setParentRoutine({})).toThrow('`routine` must be an instance of `Routine`');
});
// Promise Class
const mockEvaluator = {
  evaluate: jest.fn(),
};

const mockSuccessHandler = jest.fn();
const mockFailureHandler = jest.fn();

beforeEach(() => {
  // Reset the mock functions before each test
  mockEvaluator.evaluate.mockReset();
  mockSuccessHandler.mockReset();
  mockFailureHandler.mockReset();
});

test('Promise should execute all routines in parallel if the queue is set to "parallel"', () => {
  mockEvaluator.evaluate.mockReturnValue(true);
  const promise = new Promise();
  const routine1 = new Routine(mockEvaluator);
  const routine2 = new Routine(mockEvaluator);
  routine1.then(mockSuccessHandler);
  routine2.then(mockSuccessHandler);
  promise.addRoutine(routine1);
  promise.addRoutine(routine2);
  promise.addQueue('parallel');
  promise.execute();
  expect(mockSuccessHandler).toHaveBeenCalledTimes(2);
});

test('Promise should execute routines in waterfall mode if the queue is set to "waterfall"', () => {
  mockEvaluator.evaluate.mockReturnValue(true);
  const promise = new Promise();
  const routine1 = new Routine(mockEvaluator);
  const routine2 = new Routine(mockEvaluator);
  routine1.then(mockSuccessHandler);
  routine2.then(mockSuccessHandler);
  promise.addRoutine(routine1);
  promise.addRoutine(routine2);
  promise.addQueue('waterfall');
  promise.execute();
  expect(mockSuccessHandler).toHaveBeenCalledTimes(2);
});

test('Promise should throw an error if the queue is set to an invalid value', () => {
  const promise = new Promise();
  expect(() => promise.addQueue('invalid')).toThrow('Invalid queue type: invalid');
});

test('addRoutine should add a routine to the routines array', () => {
  const promise = new Promise();
  const routine = new Routine(mockEvaluator);
  promise.addRoutine(routine);
  expect(promise.routines).toEqual([routine]);
});

test('addRoutine should throw an error if called with a non-Routine object', () => {
  const promise = new Promise();
  expect(() => promise.addRoutine({})).toThrow('`routine` must be an instance of `Routine`');
});
// Additional Tests

test('then should return the Routine object, allowing for chaining', () => {
  const routine = new Routine({ evaluate: () => true });
  expect(routine.then(mockSuccessHandler)).toBe(routine);
});

test('catch should return the Routine object, allowing for chaining', () => {
  const routine = new Routine({ evaluate: () => false });
  expect(routine.catch(mockFailureHandler)).toBe(routine);
});

test('addSubRoutine should return the Routine object, allowing for chaining', () => {
  const routine = new Routine({ evaluate: () => true });
  const subRoutine = new SubRoutine({ evaluate: () => true });
  expect(routine.addSubRoutine(subRoutine)).toBe(routine);
});
// Additional tests

// Routine Class

test('execute should call the execute method of added subroutines, even if the evaluator function returns true', () => {
  mockEvaluator.evaluate.mockReturnValue(true);
  const routine = new Routine(mockEvaluator);
  const subRoutine = new SubRoutine({ evaluate: () => true });
  const spy = jest.spyOn(subRoutine, 'execute');
  routine.addSubRoutine(subRoutine);
  routine.execute();
  expect(spy).toHaveBeenCalled();
});

test('addSubRoutine should throw an error if called with a non-Routine object', () => {
  const routine = new Routine(mockEvaluator);
  expect(() => routine.addSubRoutine({})).toThrow('`routine` must be an instance of `Routine`');
});

// SubRoutine Class

test('then should add a success handler to the successHandlers array', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.then(mockSuccessHandler);
  expect(subRoutine.successHandlers).toEqual([mockSuccessHandler]);
});

test('catch should add a failure handler to the failureHandlers array', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  subRoutine.catch(mockFailureHandler);
  expect(subRoutine.failureHandlers).toEqual([mockFailureHandler]);
});

test('then should throw an error if called with a non-function', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  expect(() => subRoutine.then('not a function')).toThrow('`successHandler` must be a function');
});

test('catch should throw an error if called with a non-function', () => {
  const subRoutine = new SubRoutine(mockEvaluator);
  expect(() => subRoutine.catch('not a function')).toThrow('`failureHandler` must be a function');
});
