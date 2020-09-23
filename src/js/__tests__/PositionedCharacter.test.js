import Swordsman from '../Characters/Swordsman';
import Magician from '../Characters/Magician';
import PositionedCharacter from '../PositionedCharacter';

test('the character cannot attack the field on which it is located', () => {
  const unit = new PositionedCharacter(new Swordsman(1), 9, 0);
  expect(unit.canAttackPosition(9, 8)).toEqual(false);
});

test('Swordsman can move 4 fields', () => {
  const unit = new PositionedCharacter(new Swordsman(1), 9, 0);
  expect(unit.canMoveToPosition(43, 8)).toEqual(true);
  expect(unit.canMoveToPosition(22, 8)).toEqual(false);
});

test('Swordsman can attack 1 fields', () => {
  const unit = new PositionedCharacter(new Swordsman(1), 9, 0);
  expect(unit.canAttackPosition(18, 8)).toEqual(true);
  expect(unit.canAttackPosition(3, 8)).toEqual(false);
});

test('Magician can move 1 fields', () => {
  const unit = new PositionedCharacter(new Magician(1), 27, 0);
  expect(unit.canMoveToPosition(36, 8)).toEqual(true);
  expect(unit.canMoveToPosition(25, 8)).toEqual(false);
});

test('Magician can attack 4 fields', () => {
  const unit = new PositionedCharacter(new Magician(1), 25, 0);
  expect(unit.canAttackPosition(0, 8)).toEqual(true);
  expect(unit.canAttackPosition(61, 8)).toEqual(true);
  expect(unit.canAttackPosition(62, 8)).toEqual(false);
});
