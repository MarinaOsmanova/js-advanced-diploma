import GameState from './GameState';
import Levels, { COMPUTER, HUMAN } from './levels';
import generateTeam from './generators';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.levels = new Levels();
  }

  init() {
    // TODO: add event listeners to gamePlay events


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
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
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
