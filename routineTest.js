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
