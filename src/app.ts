import { createServer } from 'node:http';
import { handleRequest } from './drinkHandler.ts';

const server = createServer(handleRequest);

server.listen(3000, 'localhost', () => {
    console.log('http://localhost:3000');
});
