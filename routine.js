class Evaluator {
  constructor(evaluatorFunction) {
    // If `evaluatorFunction` is not a function, throw an error
    if (typeof evaluatorFunction !== 'function') {
      throw new Error('`evaluatorFunction` must be a function');
    }

    this.evaluatorFunction = evaluatorFunction;
  }

  evaluate() {
    return this.evaluatorFunction();
  }
}

class Routine {
  constructor(evaluator) {
    // If `evaluator` is not an instance of `Evaluator`, throw an error
    if (!(evaluator instanceof Evaluator)) {
      throw new Error('`evaluator` must be an instance of `Evaluator`');
    }

    this.evaluator = evaluator;
    this.successHandlers = [];
    this.failureHandlers = [];
    this.subRoutines = [];
  }

  then(successHandler) {
    // If `successHandler` is not a function, throw an error
    if (typeof successHandler !== 'function') {
      throw new Error('`successHandler` must be a function');
    }

    this.successHandlers.push(successHandler);
    return this;
  }

  catch(failureHandler) {
    // If `failureHandler` is not a function, throw an error
    if (typeof failureHandler !== 'function') {
      throw new Error('`failureHandler` must be a function');
    }

    this.failureHandlers.push(failureHandler);
    return this;
  }

  addSubRoutine(routine) {
    // If `routine` is not an instance of `Routine`, throw an error
    if (!(routine instanceof Routine)) {
      throw new Error('`routine` must be an instance of `Routine`');
    }

    this.subRoutines.push(routine);
    return this;
  }

  execute() {
    try {
      const result = this.evaluator.evaluate();
      if (result) {
        this.successHandlers.forEach((handler) => handler());
      } else {
        this.failureHandlers.forEach((handler) => handler());
      }
    } catch (error) {
      this.failureHandlers.forEach((handler) => handler(error));
    }

    // Execute all subroutines
    this.subRoutines.forEach((subRoutine) => subRoutine.execute());
  }
}

class SubRoutine extends Routine {
  constructor(evaluator) {
    super(evaluator);
    this.parentRoutine = null;
  }

  setParentRoutine(routine) {
    this.parentRoutine = routine;
    return this;
  }
}

class Promise {
  constructor() {
    this.routines = [];
    this.queue = 'parallel'; // default to parallel execution
  }

  addRoutine(routine) {
    // If `routine` is not an instance of `Routine`, throw an error
    if (!(routine instanceof Routine)) {
      throw new Error('`routine` must be an instance of `Routine`');
    }

    this.routines.push(routine);
    return this;
  }

  addQueue(queue) {
    this.queue = queue;
    return this;
  }

  execute() {
    if (this.queue === 'parallel') {
      // Execute all routines in parallel
      this.routines.forEach((routine) => routine.execute());
    } else if (this.queue === 'waterfall') {
      // Execute routines in waterfall mode
      let i = 0;
      const executeNextRoutine = () => {
        if (i < this.routines.length) {
          const routine = this.routines[i];
          i++;
          routine.execute();
          routine.successHandlers.push(executeNextRoutine);
        }
      };
      executeNextRoutine();
    } else {
      throw new Error(`Invalid queue type: ${this.queue}`);
    }
  }
}

module.exports = { Routine, SubRoutine, Promise, Evaluator };
