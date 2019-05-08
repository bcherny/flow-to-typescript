const diff = require('jest-diff');
expect.extend({
  toBe(received, expected) {
    const options = {
      comment: 'Object.is equality',
      isNot: this.isNot,
      promise: (this as any).promise,
    } as any;
    
    const pass = Object.is(received, expected);
    
    const message = pass
      ? () =>
        this.utils.matcherHint('toBe', undefined, undefined, options) +
        '\n\n' +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}`
      : () => {
        const difference = diff(expected, received, {
          expand: this.expand,
        });
        return (
          this.utils.matcherHint('toBe', undefined, undefined, options) +
          '\n\n' +
          (difference && difference.includes('- Expect')
            ? `Difference:\n\n${difference}`
            : `Expected: ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}`)
        );
      };
    
    return {actual: received, message, pass};
  },
});

export {}
