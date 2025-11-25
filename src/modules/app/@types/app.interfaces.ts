export interface AppConfig {
	app: {
		port: number;
		name: string;
		environment: string;
		corsOrigin: string;
		throttler: {
			limit: number;
			ttl: number;
		};
		cache: {
			ttl: number;
		};
	};
	databases: {
		mongodb: {
			host: string;
			port: string;
			username: string;
			password: string;
			database: string;
		};
	};
	buenroMaterialsApi: {
		baseURL: string;
		requestTimeoutMs: number;
		retryAttempts: number;
	};
}
