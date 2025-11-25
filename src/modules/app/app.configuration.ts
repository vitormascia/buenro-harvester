import { AppConfig } from "./@types/app.interfaces.js";

const configuration = (): AppConfig => {
	return {
		app: {
			port: +process.env.APP_PORT!,
			name: process.env.APP_NAME!,
			environment: process.env.NODE_ENV!,
			corsOrigin: process.env.CORS_ORIGIN!,
			throttler: {
				limit: +process.env.THROTTLER_LIMIT!,
				ttl: +process.env.THROTTLER_TTL_IN_SECONDS!,
			},
			cache: {
				ttl: +process.env.CACHE_TTL_IN_SECONDS!,
			},
		},
		databases: {
			mongodb: {
				host: process.env.MONGODB_HOST!,
				port: process.env.MONGODB_PORT!,
				username: process.env.MONGODB_USERNAME!,
				password: process.env.MONGODB_PASSWORD!,
				database: process.env.MONGODB_DATABASE!,
			},
		},
		buenroMaterialsApi: {
			baseURL: process.env.BUENRO_MATERIALS_API_BASE_URL!,
			requestTimeoutMs: +process.env.BUENRO_MATERIALS_API_REQUEST_TIMEOUT_MS!,
			retryAttempts: +process.env.BUENRO_MATERIALS_API_RETRY_ATTEMPTS!,
		},
	};
};

export default configuration;
