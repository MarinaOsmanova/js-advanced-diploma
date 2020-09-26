import { COMPUTER, HUMAN, CharacterClasses } from './levels';
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  static from(object) {
    const gameState = new GameState();
    gameState.setFrom(object);
    return gameState;
  }

  constructor() {
    this.maxBalls = 0;
  }

  newGame() {
    this.currentBalls = 0;
    this.currentPlayer = HUMAN;
    this.currentLevelIndex = 0;
    this.currentCharacter = null;
    this.team = null;
  }

  setFrom(object) {
    this.maxBalls = object.maxBalls;
    this.currentBalls = object.currentBalls;
    this.currentPlayer = object.currentPlayer;
    this.currentLevelIndex = object.currentLevelIndex;
    this.team = new Team(object.team.boardSize);
    [HUMAN, COMPUTER].forEach((gamerType) => {
      const units = object.team.characters[gamerType];
      for (let i = 0; i < units.length; i += 1) {
        const unit = units[i];
        const character = GameState.createCharacterByParams(unit.character);
        this.team.characters[gamerType].push(
          new PositionedCharacter(character, unit.position, gamerType),
        );
      }
    });
    if (object.currentCharacter) {
      this.currentCharacter = this.team.getCharacterInCell(object.currentCharacter.position);
    } else {
      this.currentCharacter = null;
    }
  }

  addBalls(balls) {
    this.currentBalls += balls;
    if (this.currentBalls > this.maxBalls) {
      this.maxBalls = this.currentBalls;
    }
  }

  static createCharacterByParams(params) {
    const character = new CharacterClasses[params.type](params.level);
    character.attack = params.attack;
    character.defence = params.defence;
    character.health = params.health;
    character.type = params.type;
    character.attackRange = params.attackRange;
    character.moveRange = params.moveRange;
    return character;
  }
}
