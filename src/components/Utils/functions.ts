export function calcQuant(
  size: string | undefined,
  value: number | undefined,
  from: string | undefined,
  to: string | undefined
): number {
  if (!size || !value || !from || !to) return 0
  const [x, y, z] = size.split('x')
  const a = Number(x) / 1000
  const b = Number(y) / 1000
  const c = Number(z) / 1000
  if (from === 'm3') {
    if (to === 'm2') value = value / a
    if (to === 'szt') value = value / a / b / c
  }
  if (from === 'm2') {
    if (to === 'm3') value = value * a
    if (to === 'szt') value = value / b / c
  }
  if (from === 'szt') {
    if (to === 'm3') value = value * a * b * c
    if (to === 'm2') value = value * b * c
  }
  return value
}

export function calcPrice(
  size: string | undefined,
  value: number | undefined,
  from: string | undefined,
  to: string | undefined
): number {
  if (!size || !value || !from || !to) return 0
  const [x, y, z] = size.split('x')
  const a = Number(x) / 1000
  const b = Number(y) / 1000
  const c = Number(z) / 1000
  if (from === 'm3') {
    if (to === 'm2') value = value * a
    if (to === 'szt') value = value * a * b * c
  }
  if (from === 'm2') {
    if (to === 'm3') value = value / a
    if (to === 'szt') value = value * b * c
  }
  if (from === 'szt') {
    if (to === 'm3') value = value / a / b / c
    if (to === 'm2') value = value / b / c
  }
  return value
}

export function escapeNonWordChars(string: string) {
  return string
    .split('')
    .map((char) => (!char.match(/\w/) ? char.charCodeAt(0) : char))
    .join('')
}
