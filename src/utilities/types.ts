// Types
export type Collection = any[] | Obj<any>
export type Func = (...args: any[]) => any
export type Nil = null | undefined
export type Predicate = (...args: any[]) => boolean

export type Empty = EmptyArray | EmptyObj
export type EmptyArray = never[]
export type EmptyCollection = EmptyArray | EmptyObj
export type EmptyObj = Obj<never>


// Interfaces
export interface Obj<t> {
  [key: string]: t
  [key: number]: t
}
