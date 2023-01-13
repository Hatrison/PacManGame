export default function checkInt(x, y, size = 1) {
  return Number.isInteger(x / size) && Number.isInteger(y / size);
}
