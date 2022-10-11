import axios from 'axios';
import { Router } from 'express';
import { redis } from '../dbs/redis.db';
import { RetryConfig, withRetry } from '../utils/http-retry.util';

const router = Router();
const url = 'https://data.ct.gov/resource/y6p2-px98.json?category=Fruit';

function worker() {
	return axios.get(url);
}

router.get('/', async (req, res) => {
	try {
		const { data } = await withRetry(worker, new RetryConfig());
		const value = { count: data.length, data: data };
		// cache the data
		await redis.setex(
			`${req.baseUrl}${req.path}`,
			600,
			JSON.stringify(value)
		);
		res.json(value);
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

export { router as fruitRoutes };
