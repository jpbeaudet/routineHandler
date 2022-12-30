class Routine {
  constructor(evaluator) {
    // If `evaluator` is not a function, throw an error
    if (typeof evaluator !== 'function') {
      throw new Error('`evaluator` must be a function');
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
      const result = this.evaluator();
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
  }

  addRoutine(routine) {
    // If `routine` is not an instance of `Routine`, throw an error
    if (!(routine instanceof Routine)) {
      throw new Error('`routine` must be an instance of `Routine`');
    }

    this.routines.push(routine);
    return this;
  }

  execute() {
    this.routines.forEach((routine) => routine.execute());
  }
}

module.exports = { Routine, SubRoutine, Promise };
