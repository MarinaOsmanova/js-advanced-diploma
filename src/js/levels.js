import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Swordsman from './Characters/Swordsman';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';

export const HUMAN = 0;
export const COMPUTER = 1;

export default class Levels {
  constructor(currentLevel = null) {
    this.levels = [
      {
        theme: 'prairie',
        newCharactersNum: [2, 2],
        characterMaxLevel: [1, 1],
      },
      {
        theme: 'desert',
        newCharactersNum: [1, null],
        characterMaxLevel: [1, 2],
      },
      {
        theme: 'arctic',
        newCharactersNum: [2, null],
        characterMaxLevel: [2, 3],
      },
      {
        theme: 'mountain',
        newCharactersNum: [2, null],
        characterMaxLevel: [3, 4],
      },
    ];
    this.setLevelIndex(currentLevel);
  }

  setLevelIndex(level) {
    if (Number.isInteger(level) && level >= 0 && level < this.levels.length) {
      this.currentLevel = level;
    } else {
      this.currentLevel = null;
    }
  }

  [Symbol.iterator]() {
    return this;
  }

  getLevelSettings(levelIndex) {
    const levelSettings = this.levels[levelIndex];
    levelSettings.allowCharacterTypes = [
      [Bowman, Swordsman],
      [Daemon, Undead, Vampire],
    ];
    if (levelIndex > 0) {
      levelSettings.allowCharacterTypes[0].push(Magician);
    }
    return levelSettings;
  }

  current() {
    if (!(this.currentLevel >= 0 && this.currentLevel < this.levels.length)) {
      return null;
    }
    return this.getLevelSettings(this.currentLevel);
  }

  nextLevel() {
    if (this.currentLevel === null) {
      this.currentLevel = 0;
      return 0;
    }
    this.currentLevel += 1;
    if (this.currentLevel < this.levels.length) {
      return this.currentLevel;
    }
    return null;
  }
}
