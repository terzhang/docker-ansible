import { sendError, runCommand } from '../helper';
import { HttpMethods, RouteHandler } from './types';

const httpMethods: HttpMethods = {
    'POST': runCommand(
        ['apic_namespace', 'env', 'apis', 'apic_space', 'consumers'],
        "echo 'POST request to run build-gen'"
    )
}

export const buildGen: RouteHandler = function (req, res) {
    if (!req || !req.method) return;

    const action = httpMethods[req.method];
    if (!action) {
        sendError(res, 'Invalid HTTP Method.', 501);
        return;
    }
    // on accepted http method, run it
    action(req, res);
}