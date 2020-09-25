import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 400;
    this.defence = 10;
    this.attackRange = 1;
    this.moveRange = 4;
  }
}
