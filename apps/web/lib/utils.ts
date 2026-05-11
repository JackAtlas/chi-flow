export function capitalize(string: string) {
  if (!string || string.length === 0) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
