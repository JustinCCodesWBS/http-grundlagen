import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import type { Drink } from './types/drink.ts';
import { readJsonBody } from './http/readJsonBody.ts';

let drinks: Drink[] = [
    { id: '604', name: 'Wasser' },
    { id: '605', name: 'Eistee' },
];

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const method = req.method;
    const url = new URL(req.url ?? '/', 'http://localhost:3000');
    const path = url.pathname;

    console.log(method, path);

    if (method === 'GET' && path === '/drinks') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(drinks));
        return;
    }

    if (method === 'POST' && path === '/drinks') {
        const body = await readJsonBody(req);
        const drink: Drink = { id: randomUUID(), name: body.name };
        drinks.push(drink);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Location', '/drinks/' + drink.id);
        res.end(JSON.stringify(drink));
        return;
    }
    // /drinks/604 
    const parts = path.split('/');
    const id = parts[2];

    if (method === 'GET' && parts[1] === 'drinks' && parts.length === 3) {
        const drink = drinks.find(drink => drink.id === id);
        if (!drink) {
            res.statusCode = 404;
            res.end('Drink nicht gefunden.');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(drink));
        return;
    }

    if (method === 'DELETE' && parts[1] === 'drinks' && parts.length === 3) {
        drinks = drinks.filter(drink => drink.id !== id);
        res.statusCode = 204;
        res.end();
        return;
    }

    res.statusCode = 404;
    res.end('Route nicht gefunden.');
}
