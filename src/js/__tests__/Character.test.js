import Character from '../Character';

test('An exception must be thrown when instantiating the Character class', () => {
  expect(() => { new Character(1); }).toThrow('Нельзя создать экземпляр этого класса');
});
