import Character from './Character';
import { distance } from './utils';

export default class PositionedCharacter {
  constructor(character, position, gamerType) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
    this.gamerType = gamerType;
  }

  canAttackPosition(index, boardSize) {
    return this.position !== index
      && this.character.attackRange >= distance(this.position, index, boardSize);
  }

  canMoveToPosition(index, boardSize) {
    return this.position !== index
      && this.character.moveRange >= distance(this.position, index, boardSize);
  }
}
