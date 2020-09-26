import { COMPUTER, HUMAN } from './levels';
import { coordinates } from './utils';

export default class ComputerAI {
  setTeam(team) {
    this.team = team;
  }

  getSolution() {
    let bestRating = -1000000;
    const bestMove = {
      from: null,
      to: null,
    };
    this.team.characters[COMPUTER].forEach((character) => {
      for (let toPosition = 0; toPosition < this.team.boardSize ** 2; toPosition += 1) {
        const rating = this.calcMoveRating(character, toPosition);
        if (rating !== null) {
          if (rating > bestRating || (rating === bestRating && Math.random() > 0.49)) {
            bestRating = rating;
            bestMove.from = character.position;
            bestMove.to = toPosition;
          }
        }
      }
    });
    return bestMove;
  }

  // Расчёт рейтинга от хода (перемещения или атаки) персонажа на позицию toPosition
  calcMoveRating(character, toPosition) {
    const target = this.team.getCharacterInCell(toPosition);
    if (target) {
      if (target.gamerType === COMPUTER) {
        return null;
      }
      if (!character.canAttackPosition(toPosition, this.team.boardSize)) {
        return null;
      }
      const targetCharacter = target.character;
      let rating = targetCharacter.attack * targetCharacter.attackRange
        + 2 * targetCharacter.moveRange;
      const effectiveDamage = targetCharacter.getDamageValueByAttack(character.character.attack);
      if (effectiveDamage >= targetCharacter.health) {
        rating = 40 * rating * targetCharacter.health;
      } else {
        rating *= effectiveDamage;
      }
      return rating;
    }
    if (!character.canMoveToPosition(toPosition, this.team.boardSize)) {
      return null;
    }
    const nowDanger = this.calcDanger(character.position, character);
    const newDanger = this.calcDanger(toPosition, character);
    let rating = 10 * (nowDanger - newDanger);
    const [row1, col1] = coordinates(character.position, this.team.boardSize);
    const [row2, col2] = coordinates(toPosition, this.team.boardSize);
    // Ближе к центру - лучше. Буду считать квадраты расстояний
    const centr = this.team.boardSize / 2;
    const dist1 = (row1 - centr) ** 2 + (col1 - centr) ** 2;
    const dist2 = (row2 - centr) ** 2 + (col2 - centr) ** 2;
    rating += dist1 - dist2;
    return rating;
  }

  // расчёт "опасности" поля - максимальный урон от войск человека, который может получить персонаж
  // Если урон смертельный, значение умножается
  calcDanger(position, character) {
    let maxDamage = 0;
    this.team.characters[HUMAN].forEach((unit) => {
      if (unit.canAttackPosition(position, this.team.boardSize)) {
        const damage = character.character.getDamageValueByAttack(unit.character.attack);
        if (damage > maxDamage) {
          maxDamage = damage;
        }
      }
    });
    if (maxDamage > character.health) {
      maxDamage *= 15;
    }
    return maxDamage;
  }
}
