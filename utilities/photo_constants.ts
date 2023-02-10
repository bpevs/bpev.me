import { MagickFormat } from 'imagemagick'

export interface Entity {
  downloadPath: string
  downloadFormat: Format
  uploadPath: string
  uploadFormat: string
  uploadSize: string
}

export interface ImageMeta {
  averageColor: [number, number, number, number]
  height: number
  width: number
}

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

export const FORMAT_MAP: { [value: string]: MagickFormat } = Object.freeze({
  [FORMAT.JPG]: MagickFormat.Jpeg,
  [FORMAT.PNG]: MagickFormat.Png,
  [FORMAT.WEBP]: MagickFormat.Webp,
})
