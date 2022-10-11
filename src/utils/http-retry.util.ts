import { AxiosError, AxiosResponse } from 'axios';

export class RetryConfig {
	reties: number;
	backOff: number;
	backOffFactor: number;
	retryOnStatusCodes: number[];
	constructor() {
		this.reties = 3;
		this.backOff = 300;
		this.backOffFactor = 2;
		this.retryOnStatusCodes = [408, 500, 504];
	}
}

export const wait = (delay: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), delay);
	});
};

export const withRetry = async (
	fn: Function,
	config: RetryConfig
): Promise<AxiosResponse> => {
	return fn().catch(async (err: AxiosError) => {
		console.log(`Retry: ${config.reties} and BackOff: ${config.backOff}`);
		if (
			config.reties > 0 &&
			config.retryOnStatusCodes.includes(err.response?.status || 0)
		) {
			// Wait for the exponentially increasing delay period before retrying again.
			await wait(config.backOff);
			config.reties -= 1;
			config.backOff *= config.backOffFactor;
			return withRetry(fn, config);
		}
		return Promise.reject(err);
	});
};
