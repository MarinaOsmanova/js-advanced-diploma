import { HUMAN, COMPUTER } from './levels';
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.characters = [[], []];
  }

  getAllCharacters() {
    return this.characters[HUMAN].concat(this.characters[COMPUTER]);
  }

  getCharactersNumber(gamerType) {
    return this.characters[gamerType].length;
  }

  getRandomPositionForNewCharacter(gamerType) {
    const columns = (gamerType === HUMAN) ? [0, 1] : [this.boardSize - 2, this.boardSize - 1];
    const positions = [];
    columns.forEach((col) => {
      for (let row = 0; row < this.boardSize; row += 1) {
        positions.push(col + row * this.boardSize);
      }
    });
    const allCharacters = this.getAllCharacters();
    allCharacters.forEach((character) => {
      const busyPosition = character.position;
      const index = positions.indexOf(busyPosition);
      if (index !== -1) {
        positions.splice(index, 1);
      }
    });
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  }

  addNewCharacters(gamerType, generator) {
    for (const character of generator) {
      const position = this.getRandomPositionForNewCharacter(gamerType);
      this.characters[gamerType].push(new PositionedCharacter(character, position, gamerType));
    }
  }

  levelUp() {
    // Повышение уровня у ВСЕХ оставшихся персонажей.
    // Хотя по правилам игры, останутся только персонажи игрока
    this.getAllCharacters().forEach((unit) => {
      unit.character.levelUp();
    });
  }

  getCharacterInCell(position, gamerType = null) {
    const characters = (gamerType === null) ? this.getAllCharacters() : this.characters[gamerType];
    for (let i = 0; i < characters.length; i += 1) {
      if (characters[i].position === position) {
        return characters[i];
      }
    }
    return null;
  }

  attack(attacker, target) {
    const attackValue = attacker.character.attack;
    const targetCharacter = target.character;
    const damage = targetCharacter.setDamage(attackValue);
    if (targetCharacter.health === 0) {
      this.removeCharacter(target);
    }
    return damage;
  }

  removeCharacter(character) {
    const { position } = character;
    const characters = this.characters[character.gamerType];
    this.characters[character.gamerType] = characters.filter((e) => e.position !== position);
  }

  getSumHealth(gamerType) {
    const characters = this.characters[gamerType];
    let balls = 0;
    characters.forEach((unit) => {
      balls += unit.character.health;
    });
    return balls;
  }
}
