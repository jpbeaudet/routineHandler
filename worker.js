import Routine from './ModernRoutine.js';

class Worker {
  constructor(name, routine, options = {}) {
    this.name = name;
    this.routine = routine;
    this.options = options;
    this.state = {
      isRunning: false,
      lastRun: null,
      error: null,
      results: null
    };
    this.eventEmitter = new EventTarget();
  }

  async run(initialData = {}) {
    if (this.state.isRunning) {
      throw new Error('Worker is already running');
    }

    try {
      this.state.isRunning = true;
      this.state.lastRun = new Date();
      this.state.error = null;
      this.emit('start', { timestamp: this.state.lastRun });

      this.state.results = await this.routine.execute(initialData);

      this.emit('complete', { results: this.state.results });
      return this.state.results;
    } catch (error) {
      this.state.error = error;
      this.emit('error', { error });
      throw error;
    } finally {
      this.state.isRunning = false;
    }
  }

  getState() {
    return {
      ...this.state,
      routineState: this.routine.getState()
    };
  }

  on(eventName, callback) {
    this.eventEmitter.addEventListener(eventName, (event) => {
      callback(event.detail);
    });
    return this;
  }

  emit(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    this.eventEmitter.dispatchEvent(event);
  }
}

export default Worker;
