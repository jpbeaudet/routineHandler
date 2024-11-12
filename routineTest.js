const { expect } = require('chai');
const Routine = require('../path/to/your/ModernRoutine.js');  // Adjust path to your Routine class

describe('Routine Class - v3', function() {
  let routine;

  beforeEach(() => {
    // Set up a fresh Routine instance before each test
    routine = new Routine('TestRoutine', { maxRetries: 2, retryDelay: 500, timeout: 2000 });
  });

  describe('addSubroutine', function() {
    it('should add a valid subroutine', function() {
      const action = async () => 'hello world';
      const evaluator = (result) => result === 'hello world'; // A simple evaluator

      routine.addSubroutine('generateContent', action, evaluator);
      
      expect(routine.subroutines.has('generateContent')).to.be.true;
      expect(routine.evaluators.has('generateContent')).to.be.true;
    });

    it('should throw an error if the action is not a function', function() {
      const invalidAction = 'not a function';
      expect(() => routine.addSubroutine('invalidAction', invalidAction))
        .to.throw('Subroutine invalidAction must be a function');
    });

    it('should throw an error if evaluator is not a function', function() {
      const action = async () => 'test';
      const invalidEvaluator = 'not a function';
      expect(() => routine.addSubroutine('invalidEvaluator', action, invalidEvaluator))
        .to.throw('Evaluator for invalidEvaluator must be a function');
    });
  });

  describe('executeSubroutine', function() {
    it('should execute a subroutine and return the result', async function() {
      const action = async () => 'test result';
      routine.addSubroutine('testSubroutine', action);

      const result = await routine.executeSubroutine('testSubroutine');
      expect(result).to.equal('test result');
    });

    it('should retry the subroutine if it fails once', async function() {
      let attempts = 0;
      const action = async () => {
        attempts++;
        if (attempts === 1) throw new Error('temporary failure');
        return 'success';
      };

      routine.addSubroutine('retrySubroutine', action);
      const result = await routine.executeSubroutine('retrySubroutine');
      
      expect(result).to.equal('success');
      expect(attempts).to.equal(2);  // Should retry once
    });

    it('should fail after exceeding max retries', async function() {
      const action = async () => {
        throw new Error('permanent failure');
      };

      routine.addSubroutine('retryFailSubroutine', action);
      try {
        await routine.executeSubroutine('retryFailSubroutine');
        expect.fail('Should throw error after retries');
      } catch (error) {
        expect(error.message).to.equal('Subroutine retryFailSubroutine failed after 2 attempts: permanent failure');
      }
    });

    it('should respect timeout for subroutines', async function() {
      const action = async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));  // Simulate long delay
        return 'delayed result';
      };

      routine.addSubroutine('timeoutTest', action);
      try {
        await routine.executeSubroutine('timeoutTest');
        expect.fail('Should timeout before completion');
      } catch (error) {
        expect(error.message).to.include('Timeout');
      }
    });
  });

  describe('execute', function() {
    it('should execute all subroutines and return results', async function() {
      const action1 = async () => 'result 1';
      const action2 = async () => 'result 2';
      
      routine.addSubroutine('subroutine1', action1);
      routine.addSubroutine('subroutine2', action2);

      const results = await routine.execute();
      expect(results.get('subroutine1')).to.equal('result 1');
      expect(results.get('subroutine2')).to.equal('result 2');
    });

    it('should throw an error if a subroutine fails', async function() {
      const action = async () => {
        throw new Error('Subroutine failure');
      };
      
      routine.addSubroutine('failingSubroutine', action);
      
      try {
        await routine.execute();
        expect.fail('Routine should fail if a subroutine fails');
      } catch (error) {
        expect(error.message).to.include('Subroutine failure');
      }
    });

    it('should emit events during execution', function(done) {
      const action = async () => 'event test result';
      routine.addSubroutine('eventTestSubroutine', action);
      
      routine.on('complete', (data) => {
        expect(data.results.get('eventTestSubroutine')).to.equal('event test result');
        done();
      });
      
      routine.execute();
    });
  });

  describe('reset', function() {
    it('should reset the routine state', function() {
      routine.addSubroutine('someSubroutine', async () => 'reset test');
      
      routine.execute();
      routine.reset();
      
      const state = routine.getState();
      expect(state.isRunning).to.be.false;
      expect(state.results.size).to.equal(0);
    });
  });
});
