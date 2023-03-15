class Evaluator {
  constructor(evaluatorFunction) {
    if (typeof evaluatorFunction !== 'function') {
      throw new Error('`evaluatorFunction` must be a function');
    }

    this.evaluatorFunction = evaluatorFunction;
  }

  async evaluate() {
    return this.evaluatorFunction();
  }
}

class Routine {
  constructor(evaluator) {
    if (!(evaluator instanceof Evaluator)) {
      throw new Error('`evaluator` must be an instance of `Evaluator`');
    }

    this.evaluator = evaluator;
    this.successHandlers = [];
    this.failureHandlers = [];
    this.subRoutines = [];
  }

  then(successHandler) {
    if (typeof successHandler !== 'function') {
      throw new Error('`successHandler` must be a function');
    }

    this.successHandlers.push(successHandler);
    return this;
  }

  catch(failureHandler) {
    if (typeof failureHandler !== 'function') {
      throw new Error('`failureHandler` must be a function');
    }

    this.failureHandlers.push(failureHandler);
    return this;
  }

  addSubRoutine(routine) {
    if (!(routine instanceof Routine)) {
      throw new Error('`routine` must be an instance of `Routine`');
    }

    this.subRoutines.push(routine);
    return this;
  }

  async execute() {
    try {
      const result = await this.evaluator.evaluate();
      if (result) {
        this.successHandlers.forEach((handler) => handler());
      } else {
        this.failureHandlers.forEach((handler) => handler());
      }
    } catch (error) {
      this.failureHandlers.forEach((handler) => handler(error));
    }

    // Execute all subroutines
    for (const subRoutine of this.subRoutines) {
      await subRoutine.execute();
    }
  }
}

module.exports = { Routine, Evaluator };
