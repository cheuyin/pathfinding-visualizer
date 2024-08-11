// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(condition: any, msg?: string): asserts condition is true {
  if (!condition) {
    throw new Error(msg || 'Assertion failed');
  }
}
