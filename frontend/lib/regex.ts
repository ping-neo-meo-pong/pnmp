export function regex(input: string, length: number): boolean {
  const regex = /[^가-힣\w\s]/g;
  const trimName = input.trim();
  if (
    trimName.length === 0 ||
    regex.test(trimName) === true ||
    trimName.length > length
  ) {
    return true;
  } else return false;
}
