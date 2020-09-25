export function coordinates(index, boardSize) {
  return [Math.floor(index / boardSize), index % boardSize];
}

export function distance(index1, index2, boardSize) {
  const [row1, col1] = coordinates(index1, boardSize);
  const [row2, col2] = coordinates(index2, boardSize);
  return Math.max(Math.abs(row2 - row1), Math.abs(col2 - col1));
}

export function calcTileType(index, boardSize) {
  let tileType = '';
  const [row, col] = coordinates(index, boardSize);
  if (row === 0) {
    tileType = 'top';
  } else if (row === boardSize - 1) {
    tileType = 'bottom';
  }
  if (col === 0) {
    tileType += `${tileType ? '-' : ''}left`;
  } else if (col === boardSize - 1) {
    tileType += `${tileType ? '-' : ''}right`;
  }
  return tileType || 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
