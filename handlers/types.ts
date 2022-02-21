import { IncomingMessage, METHODS, ServerResponse } from "http"

export type Method = typeof METHODS[number]
export type MethodHandler = (_: IncomingMessage, res: ServerResponse) => void | undefined
export type HttpMethods = {
    [key: Method]: MethodHandler
}

export type RouteHandler = {
    (req: IncomingMessage, res: ServerResponse): void | undefined
}