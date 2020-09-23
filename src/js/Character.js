export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создать экземпляр этого класса');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.attack_range = 0;
    this.move_range = 0;
  }

  infoString() {
    return `<span class="level"></span>${this.level} <span class="attack"></span>${this.attack} <span class="defence"></span>${this.defence} <span class="health"></span>${this.health}`;
  }
}
