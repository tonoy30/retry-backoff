import express from 'express';
import { redis } from './dbs/redis.db';
import { readThroughCache } from './middleware/cache.middleware';

import { fruitRoutes } from './routes/fruit.route';

const port = 3000;

redis.on('error', (err) => console.log('Redis Client Error', err));

const app = express();

app.use('/fruits', readThroughCache, fruitRoutes);

let hitCount = 0;

app.get('/error', (req, res) => {
	hitCount++;
	if (hitCount < 3) {
		return res.sendStatus(500);
	} else {
		return res.json({ todo: '1' });
	}
});

app.listen(port, () => {
	console.log(`server is listening on  port: ${port}`);
});
