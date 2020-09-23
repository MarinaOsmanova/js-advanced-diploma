import GameState from './GameState';
import Levels, { COMPUTER, HUMAN } from './levels';
import generateTeam from './generators';
import Team from './Team';
import GamePlay from './GamePlay';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.levels = new Levels();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener((index) => { this.onCellEnter(index); });
    this.gamePlay.addCellLeaveListener((index) => { this.onCellLeave(index); });
    this.gamePlay.addCellClickListener((index) => { this.onCellClick(index); });

    // TODO: load saved stated from stateService
    try {
      this.gameState = GameState.from(this.stateService.load());
      this.levels.setLevelIndex(this.gameState.currentLevelIndex);
    } catch (e) {
      alert('Не удалось загрузить сохранённую игру');
    }
    this.newGame();
    console.log(this.gameState);

    this.gamePlay.drawUi(this.levels.current().theme);
    this.gamePlay.redrawPositions(this.gameState.team.getAllCharacters());
  }

  onCellClick(index) {
    const [character, currentCharacter] = [
      this.gameState.team.getCharacterInCell(index),
      this.gameState.currentCharacter,
    ];
    if (currentCharacter && !character && currentCharacter.canMoveToPosition(index, this.gamePlay.boardSize)) {
      // перемещение выделенного персонажа
      this.gamePlay.deselectCell(currentCharacter.position);
      this.gamePlay.deselectCell(index);
      currentCharacter.position = index;
      this.gameState.currentCharacter = null;
      this.gamePlay.redrawPositions(this.gameState.team.getAllCharacters());
      return;
    }


    if (!character) {
      GamePlay.showError('Здесь нет вашего воина');
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
    }
  }

  onCellEnter(index) {
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
    this.gamePlay.hideCellTooltip(index);
    if (!this.gameState.team.getCharacterInCell(index, HUMAN)) {
      this.gamePlay.deselectCell(index);
    }
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
        newCharacterNum = this.team.getCharactersNumber(HUMAN);
      }
      this.gameState.team.addNewCharacters(gamerType, generateTeam(
        settings.allowCharacterTypes[gamerType],
        settings.characterMaxLevel[gamerType],
        newCharacterNum,
      ));
    });
  }
}
