import { calcTileType } from '../utils';

test('upper left corner', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('upper right corner', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
  expect(calcTileType(99, 100)).toBe('top-right');
});

test('bottom left corner', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
  expect(calcTileType(90, 10)).toBe('bottom-left');
});

test('bottom right corner', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
  expect(calcTileType(99, 10)).toBe('bottom-right');
});

test('left side', () => {
  expect(calcTileType(16, 8)).toBe('left');
  expect(calcTileType(3, 3)).toBe('left');
});

test('right side', () => {
  expect(calcTileType(23, 8)).toBe('right');
  expect(calcTileType(5, 3)).toBe('right');
});

test('top side', () => {
  expect(calcTileType(5, 8)).toBe('top');
  expect(calcTileType(1, 3)).toBe('top');
});

test('bottom side', () => {
  expect(calcTileType(60, 8)).toBe('bottom');
  expect(calcTileType(7, 3)).toBe('bottom');
});

test('the field is not on the edge', () => {
  expect(calcTileType(28, 8)).toBe('center');
  expect(calcTileType(4, 3)).toBe('center');
});
