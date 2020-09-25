import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 100;
    this.defence = 40;
    this.attackRange = 4;
    this.moveRange = 1;
  }
}
