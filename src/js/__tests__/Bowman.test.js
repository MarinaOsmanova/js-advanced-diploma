import Bowman from '../Characters/Bowman';

test('An instance of the Bowman class is supplied with the correct fields', () => {
  const character = new Bowman(2);
  expect(character.type).toEqual('bowman');
  expect(character.level).toEqual(2);
  expect(character.attack).toEqual(25);
  expect(character.defence).toEqual(25);
  expect(character.health).toEqual(100);
  expect(character.attackRange).toEqual(2);
  expect(character.moveRange).toEqual(2);
});

test('infoString returns the correct description', () => {
  const character = new Bowman(2);
  const expected = '<span class="level"></span>2 <span class="attack"></span>25 <span class="defence"></span>25 <span class="health"></span>100';
  expect(character.infoString()).toEqual(expected);
});
