import { NextFunction, Request, Response } from 'express';
import { redis } from '../dbs/redis.db';

export const readThroughCache = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const key = `${req.baseUrl}${req.path}`;
	redis.get(key, (err, data) => {
		if (err) throw err;
		if (!data) {
			next();
		} else {
			return res.json(JSON.parse(data));
		}
	});
};
