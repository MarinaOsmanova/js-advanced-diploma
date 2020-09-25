export default class GameState {
  static from(object) {
    return new GameState(object);
  }

  constructor(object) {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      this[key] = object[key];
    }
  }

  addBalls(balls) {
    this.currentBalls += balls;
    if (typeof(this.maxBalls) === 'undefined') {
      this.maxBalls = balls;
    } else if (this.currentBalls > this.maxBalls) {
      this.maxBalls = this.currentBalls;
    }
  }
}
