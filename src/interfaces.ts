
export interface AvailableTypes {
    [key: string]: (body: object) => string | Buffer
}
