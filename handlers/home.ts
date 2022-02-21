import { sendError } from '../helper';
import { readFile } from 'fs';
import {HttpMethods, RouteHandler} from './types';

const httpMethods: HttpMethods = {
    'GET': (_, res ) => {
        try {
            readFile("./client/app.html", (error, result) => {
                if (error) {
                    sendError(res, "Not such content.", 404)
                    return;
                }

                // send back html content
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(result);
                res.end();
            })
        } catch (e) {
            console.error
            sendError(res, "Unknown error occurred", 500);
        }
    }
}

export const home: RouteHandler = function (req, res) {
    if (!req || !req.method) return;

    const action = httpMethods[req.method];
    if (!action) {
        sendError(res, 'Invalid HTTP Method.', 501);
        return;
    }
    // on accepted http method, run it
    action(req, res);
}

// function sendResponse(_res: ServerResponse, _arg1: { error: string; }, _arg2: number) {
//     throw new Error('Function not implemented.');
// }
