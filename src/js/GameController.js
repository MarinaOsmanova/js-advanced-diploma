import GameState from './GameState';
import Levels, { COMPUTER, HUMAN } from './levels';
import generateTeam from './generators';
import Team from './Team';
import GamePlay from './GamePlay';
import cursors from './cursors';
import ComputerAI from './ComputerAI';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.levels = new Levels();
    this.computerAI = new ComputerAI();
  }

  init() {
    this.gamePlay.addCellEnterListener((index) => { this.onCellEnter(index); });
    this.gamePlay.addCellLeaveListener((index) => { this.onCellLeave(index); });
    this.gamePlay.addCellClickListener((index) => { this.onCellClick(index); });
    this.gamePlay.addNewGameListener(() => { this.newGame(); });

    // load saved stated from stateService
    try {
      this.gameState = GameState.from(this.stateService.load());
      this.levels.setLevelIndex(this.gameState.currentLevelIndex);
    } catch (e) {
      this.newGame();
    }
  }

  onCellClick(index) {
    if (this.gameState.currentPlayer !== HUMAN) {
      return;
    }
    const [character, currentCharacter] = [
      this.gameState.team.getCharacterInCell(index),
      this.gameState.currentCharacter,
    ];
    if (currentCharacter && !character) {
      if (currentCharacter.canMoveToPosition(index, this.gamePlay.boardSize)) {
        // перемещение выделенного персонажа
        this.gamePlay.deselectCell(currentCharacter.position);
        this.gamePlay.deselectCell(index);
        currentCharacter.position = index;
        this.gameState.currentCharacter = null;
        this.redrawPositions();
        this.setComputerAction();
      } else {
        GamePlay.showError('Ваш воин не может сюда дойти');
      }
      return;
    }
    if (character && character.gamerType === HUMAN) {
      // выделение персонажа
      if (currentCharacter) {
        const oldPosition = currentCharacter.position;
        if (oldPosition === index) {
          return;
        }
        this.gamePlay.deselectCell(oldPosition);
      }
      this.gameState.currentCharacter = character;
      this.gamePlay.selectCell(index);
      return;
    }
    if (character && currentCharacter) {
      // клик по вражескому персонажу (клик по своему обработан выше), и есть выделенный персонаж
      if (currentCharacter.canAttackPosition(index, this.gamePlay.boardSize)) {
        const damage = this.gameState.team.attack(currentCharacter, character);
        const damageAnimation = this.gamePlay.showDamage(index, damage);
        this.gameState.currentPlayer = COMPUTER;
        this.gamePlay.setCursor(cursors.auto);
        damageAnimation.then(() => {
          this.gamePlay.deselectCell(index);
          this.gamePlay.deselectCell(this.gameState.currentCharacter.position);
          this.gameState.currentCharacter = null;
          this.redrawPositions();
          if (this.gameState.team.getCharactersNumber(COMPUTER) === 0) {
            this.levelComplete();
          } else {
            this.setComputerAction();
          }
        });
      } else {
        GamePlay.showError('Ваш воин не может атаковать эту позицию');
      }
      return;
    }
    if (character) {
      GamePlay.showError('Вы не можете управлять чужим воином');
    } else {
      GamePlay.showError('Здесь пусто. Выберите своего воина');
    }
  }

  onCellEnter(index) {
    if (this.gameState.currentPlayer !== HUMAN) {
      return;
    }
    const [character, currentCharacter] = [
      this.gameState.team.getCharacterInCell(index),
      this.gameState.currentCharacter,
    ];
    if (character) {
      this.gamePlay.showCellTooltip(character.character.infoString(), index);
      if (character.gamerType === HUMAN) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (currentCharacter) {
        if (currentCharacter.canAttackPosition(index, this.gamePlay.boardSize)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
      return;
    }
    if (!currentCharacter) {
      this.gamePlay.setCursor(cursors.auto);
      return;
    }
    if (currentCharacter.canMoveToPosition(index, this.gamePlay.boardSize)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  onCellLeave(index) {
    if (this.gameState.currentPlayer !== HUMAN) {
      return;
    }
    this.gamePlay.hideCellTooltip(index);
    if (!this.gameState.team.getCharacterInCell(index, HUMAN)) {
      this.gamePlay.deselectCell(index);
    }
  }

  redrawPositions() {
    this.gamePlay.redrawPositions(this.gameState.team.getAllCharacters());
  }

  newGame() {
    this.gameState = GameState.from({
      currentBalls: 0,
      currentPlayer: HUMAN,
      currentLevelIndex: 0,
      currentCharacter: null,
      team: new Team(this.gamePlay.boardSize),
    });
    this.startLevel(0);
  }

  startLevel(levelIndex) {
    this.levels.setLevelIndex(levelIndex);
    this.gameState.currentLevelIndex = levelIndex;
    this.gameState.currentCharacter = null;
    this.gameState.currentPlayer = HUMAN;
    const settings = this.levels.current();

    // levelUp у текущих персонажей
    this.gameState.team.levelUp();

    // генерация персонажей
    [HUMAN, COMPUTER].forEach((gamerType) => {
      let newCharacterNum = settings.newCharactersNum[gamerType];
      if (newCharacterNum === null) {
        newCharacterNum = this.gameState.team.getCharactersNumber(HUMAN);
      }
      this.gameState.team.addNewCharacters(gamerType, generateTeam(
        settings.allowCharacterTypes[gamerType],
        settings.characterMaxLevel[gamerType],
        newCharacterNum,
      ));
    });

    this.gamePlay.drawUi(settings.theme);
    this.redrawPositions();
  }

  setComputerAction() {
    this.gameState.currentPlayer = COMPUTER;
    this.gamePlay.setCursor(cursors.auto);
    this.computerAI.setTeam(this.gameState.team);
    const {from, to} = this.computerAI.getSolution();
    this.gamePlay.selectCell(from);
    setTimeout(() => { this.doComputerAction(from, to); }, 400);
  }

  doComputerAction(positionFrom, positionTo) {
    const character = this.gameState.team.getCharacterInCell(positionFrom);
    const target = this.gameState.team.getCharacterInCell(positionTo);
    if (!target) {
      character.position = positionTo;
      this.endComputerAction(positionFrom);
    } else {
      const damage = this.gameState.team.attack(character, target);
      this.gamePlay.selectCell(positionTo, 'red');
      const damageAnimation = this.gamePlay.showDamage(positionTo, damage);
      damageAnimation.then(() => {
        this.gamePlay.deselectCell(positionTo);
        this.endComputerAction(positionFrom);
        if (this.gameState.team.getCharactersNumber(HUMAN) === 0) {
          this.gameState.currentPlayer = COMPUTER;
          setTimeout(() => { GamePlay.showMessage('Компьютер победил'); }, 50);
        }
      });
    }
  }

  endComputerAction(oldPosition) {
    this.gamePlay.deselectCell(oldPosition);
    this.redrawPositions();
    this.gameState.currentPlayer = HUMAN;
  }

  levelComplete() {
    this.gameState.addBalls(this.gameState.team.getSumHealth(HUMAN));
    const level = this.levels.nextLevel();
    if (level === null) {
      setTimeout( () => { GamePlay.showMessage('Вы выиграли'); }, 10);
      return;
    }
    this.startLevel(level);
  }
}
