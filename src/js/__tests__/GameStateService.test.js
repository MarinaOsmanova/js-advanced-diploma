import GameStateService from '../GameStateService';

const storageFalse = {
  getItem() {
    return 'Some bad random string';
  },
};

const testingObject = { key1: 'value1', someObject: { a: 1, b: 'some string' }, key2: 130 };

const storageTrue = {
  getItem() {
    return JSON.stringify(testingObject);
  },
};

test('Загруженный объект должен совпадать с записанным', () => {
  const stateService = new GameStateService(storageTrue);
  expect(stateService.load()).toEqual(testingObject);
});

test('При загрузке некорректной строки должно вызываться исключение', () => {
  const stateService = new GameStateService(storageFalse);
  expect(() => stateService.load()).toThrow('Invalid state');
});
