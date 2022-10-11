import Redis from 'ioredis';

export const redis = new Redis('redis://default:redispw@localhost:49153');
