import type { IncomingMessage } from 'node:http';

export function readJsonBody(req: IncomingMessage): Promise<{ name: string }> {
    return new Promise((resolve) => {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk: string) => {
            body += chunk;
        });
        req.on('end', () => {
            resolve(JSON.parse(body));
        });
    });
}

/*
1. Request - Line:

POST / users HTTP / 1.1

HTTP Methode, Pfad und HTTP Version


2. Headers

Content - Type: application / json
Content - Length: 26

Metadaten über die Anfrage


3. Body

{ "name": "Max Mustermann" }

Die eigentlichen Nutzdaten */