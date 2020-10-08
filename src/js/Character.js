export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создать экземпляр этого класса');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    this.attackRange = 0;
    this.moveRange = 0;
  }

  infoString() {
    return `<span class="level"></span>${this.level} <span class="attack"></span>${this.attack} <span class="defence"></span>${this.defence} <span class="health"></span>${this.health}`;
  }

  getDamageValueByAttack(attackValue) {
    return Math.max(attackValue - this.defence, 0.1 * attackValue);
  }

  setDamage(attackValue) {
    const damage = this.getDamageValueByAttack(attackValue);
    this.health = Math.max(this.health - damage, 0);
    return damage;
  }

  levelUp() {
    this.level += 1;
    this.attack = Math.round(Math.max(this.attack, this.attack * (0.8 + this.health / 100)));
    this.defence = Math.round(Math.max(this.defence, this.defence * (0.8 + this.health / 100)));
    this.health = Math.min(this.health + 80, 100);
  }
}
