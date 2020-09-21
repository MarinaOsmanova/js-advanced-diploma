import Bowman from './Characters/Bowman';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
function characterGenerator(allowedTypes, maxLevel) {
  const level = 1 + Math.floor(Math.random() * maxLevel);
  const typesIndex = Math.floor(Math.random() * allowedTypes.length);
  return new allowedTypes[typesIndex](level);
}

export default function* generateTeam(allowedTypes, maxLevel, characterCount) {
  for (let i = 0; i < characterCount; i += 1) {
    yield characterGenerator(allowedTypes, maxLevel);
  }
}
