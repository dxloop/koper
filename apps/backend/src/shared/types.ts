export type PromiseType<T> = T extends Promise<infer U> ? U : T
