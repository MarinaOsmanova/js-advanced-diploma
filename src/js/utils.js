export function calcTileType(index, boardSize) {
  let tileType = '';
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;
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
