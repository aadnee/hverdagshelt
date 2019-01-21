import { sync } from '../src/models';

async () => await sync;

console.log('Database initialized.');

process.exit();
