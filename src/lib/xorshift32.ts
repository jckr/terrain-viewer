export class XorShift32 {
  private _seed: number;

  constructor(seed?: number) {
    if (seed === undefined) {
      seed = new Date().getTime();
    }
    
    if (seed === 0) {
      throw new Error("Seed must not be zero");
    }
    
    this._seed = seed;
  }

  // Generates the next random number in the sequence
  nextInt(): number {
    let x = this._seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this._seed = x;
    return x;
  }

  // Generates a random float between 0 and 1
  nextFloat(): number {
    const int = this.nextInt() >>> 0; // Convert to unsigned 32-bit integer
    return int / 0xFFFFFFFF;
  }
}
