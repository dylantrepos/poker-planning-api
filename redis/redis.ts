import { createClient } from 'redis';

export const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

(async () => await client.connect())();

// await client.set('key', 'value');
// const value = await client.get('key');
// console.log('value');
// await client.disconnect();