import { XorShift32 } from './xorshift32';

describe('XorShift32', () => {
  test('should generate consistent integer sequence with the same seed', () => {
    const prng1 = new XorShift32(12345);
    const prng2 = new XorShift32(12345);

    for (let i = 0; i < 10; i++) {
      expect(prng1.nextInt()).toBe(prng2.nextInt());
    }
  });

  test('should generate different integer sequences with different seeds', () => {
    const prng1 = new XorShift32(12345);
    const prng2 = new XorShift32(67890);

    let differentValues = false;
    for (let i = 0; i < 10; i++) {
      if (prng1.nextInt() !== prng2.nextInt()) {
        differentValues = true;
        break;
      }
    }
    expect(differentValues).toBe(true);
  });
});
