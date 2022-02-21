import { MethodHandler } from './handlers/types';
import { ServerResponse, /* IncomingMessage, */ STATUS_CODES} from 'http'
import { AllVars } from './types';
import * as fs from 'fs';
import {exec} from 'child_process';

var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10,
    'Content-Type': 'application/json'
};

type DataPayload = string | {
    error?: string;
    payload?: any
}

export function sendResponse(response: ServerResponse, data: DataPayload, statusCode: typeof STATUS_CODES[number] | number): void {
    statusCode = statusCode || '200';
    response.writeHead(Number(statusCode), headers);
    response.end(JSON.stringify(data));
}

export const sendError = function (response: ServerResponse, msg: string, statusCode: typeof STATUS_CODES[number] | number) {
    sendResponse(response, {error: msg}, statusCode)
}

type FlexObject = {
    [key: string]: any
}

type Validator = {
    (
        /* an array of required properties */
        // p: (keyof AllVars)[], 
        p: string[], 
        /* the given object */
        obj: FlexObject, 
        /* perform strict checks or not */
        strict?: boolean
    ): boolean
}

// accepts an array of strings, and object
export const validator: Validator = function (properties, object, strict = false) {
    // object guard: to use keys() object must be non-zero length

    // strict means both required and gotten object must be same length
    if (strict && properties.length !== Object.keys(object).length) return false;
    // 0 length means nothing to compare -> is valid
    if (properties.length === 0) return true;

    for (let key of properties) {
        if (!object[key]) return false;
    }
    return true;
}

type RunCommand = {
    // (input: BuildPubVars | BuildPubSubVars | BuildGenVars, command: string): MethodHandler
    (input: (keyof AllVars)[], command: string): MethodHandler
}

// accepts and array of required JSON property keys and command
export const runCommand: RunCommand = (input, command) => (req, res) => {

    // get data stream on req data event
    const requestBody: any[] = [];
    req.on('data', (chunks) => {
        requestBody.push(chunks);
    });

    // for await (const chunk of req) {
    //     buffers.push(chunk);
    // }

     // validate and run command on data end
    req.on('end', () => {
        if (!requestBody || requestBody.length === 0) return;

        // add body chunks to buffer
        const requestData = Buffer.concat(requestBody).toString(); 

        // validate properties
        const received = JSON.parse(requestData);
        if (!validator(input, received)) return;
        
        try {
            // run method
            console.info("Received body: ", received)
            exec(command, { encoding: 'utf-8' }, (err, stdout, stderr) => {
                console.error(stderr);
                if (err) sendError(res, "Command failed to run", 500);
                else {
                    sendResponse(res, {payload: stdout}, 200)
                }
            });
        } catch (e) {
            console.error
            sendResponse(res, { error: "Unknown error occurred" }, 500);
        }
    })
}
export function getFile(localPath: string, mimeType: string, res: ServerResponse) {
    // read the file in and return it, or return a 500 if it can't be read
    fs.readFile(localPath, function(err, contents: any) {
      if (!err) {
        res.writeHead(200, {
          "Content-Type": mimeType,
          "Content-Length": contents.length
        });
        res.end(contents);
      } else {
        console.log('file');
        console.error(err);
        res.writeHead(500);
        res.end();
      }
    });
}

export function filterObject<T>(obj: T, filter: (Extract<keyof T, string>)[]) {
	
    if (!filter) return {}

	const newObject = {} as {[key: string]: T[keyof T]}
	filter.forEach(name => {
		newObject[name] = obj[name]
	})

    return newObject;
}

