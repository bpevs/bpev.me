export const FORMAT = Object.freeze({
  JPG: 'JPG',
  PNG: 'PNG',
  WEBP: 'WEBP',
})
export type Format = keyof typeof FORMAT

export const SIZE = Object.freeze({
  FAST: 'FAST',
  NORMAL: 'NORMAL',
  DETAILED: 'DETAILED',
})
export type Size = keyof typeof SIZE

export const DIMENSIONS: { [key: string]: [number, number] } = Object.freeze({
  [SIZE.FAST]: [500, 500],
  [SIZE.NORMAL]: [1800, 1800],
  [SIZE.DETAILED]: [1450, 2560],
})
