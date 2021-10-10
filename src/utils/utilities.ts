export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export function applyMixins (derivedCtor: any, constructors: any[]): void {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        (Object.getOwnPropertyDescriptor(baseCtor.prototype, name) != null) ||
            Object.create(null)
      )
    })
  })
}
