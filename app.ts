import { RouteHandler } from './handlers/types';
import http from 'http';
import { buildPubSub, home, buildGen } from './handlers/index.js';
import { getFile, sendError } from './helper.js';
import * as path from 'path';
import * as fs from 'fs';
const hostname = '127.0.0.1';
const port = 1234;

enum Endpoints {
    buildPubSub = '/build-pub-sub',
    buildGen = '/build-gen', 
    home = '/'
}

type Routes = {
    [key: Endpoints[number]]: RouteHandler;
};

const routes: Routes = {
    '/build-pub-sub': buildPubSub,
    '/build-gen': buildGen,
    '/': home
}

const staticExt = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    // support source map
    ".map": "application/json",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon"
};

// create a server that handles HTTP requests 
const server = http.createServer((req, res) => {

    // possible req or res is undefined
    if (!req || !res) return;

    // select route based on parsed url
    const reqURL = new URL(req.url as string, 'http://' + hostname + '/')
    const pathname = reqURL.pathname;
    const route = routes[pathname as Endpoints];

    const staticRoute = path.dirname(req.url as string)
    const fileName = path.basename(req.url as string)
    const fileExt = path.extname(fileName)
    
    const staticPath = new URL(path.dirname(import.meta.url) + '/static/');
    const filePath = (staticPath.pathname.substring(1) + fileName) //.replace(/\//g, '\\',)
    const extension = staticExt[fileExt as keyof typeof staticExt]
    // console.log(pathname)
    
    // call route handler
    if (route) {
        route(req, res);
    } else if (staticRoute) {
        // console.log(filePath)
        if (fs.existsSync('./static/')) {
            getFile(filePath, extension, res);
        } else {
            console.log(filePath+" not found");
            res.writeHead(404);
            res.end();
        }
    } else {
        sendError(res, "Path not found.", 404); // if not handled
        return;
    }
});

// have server start listening to port
server.listen(port, hostname, () => {
    // run this on listen
    console.log(`Server running at http://${hostname}:${port}/`);
});
