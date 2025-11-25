import helmet from "@fastify/helmet";
import {
	ConsoleLogger, Logger, NestApplicationOptions, ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { COMMA } from "./constants/symbols.constants.js";
import { HttpExceptionFilter } from "./filters/http_exception.filters.js";
import { AppConfig } from "./modules/app/@types/app.interfaces.js";
import { AppModule } from "./modules/app/app.module.js";
import { TrimPipe } from "./pipes/trim.pipes.js";

async function bootstrap(): Promise<void> {
	const fastifyAdapter = new FastifyAdapter({
		logger: true,
		trustProxy: true,
		maxParamLength: 200,
	});

	const options: NestApplicationOptions = {
		rawBody: true,
		logger: new ConsoleLogger({
			logLevels: ["debug", "log", "verbose", "warn", "error", "fatal"],
			prefix: "BuenroHarvester",
			timestamp: true,
			colors: true,
			sorted: true,
		}),
	};

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		fastifyAdapter,
		options,
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		transform: true,
	}));
	app.useGlobalPipes(new TrimPipe());

	const configService = app.get<ConfigService<AppConfig, true>>(ConfigService);

	const corsOrigin = configService.get("app.corsOrigin", { infer: true });

	app.enableCors({
		origin: corsOrigin.split(COMMA),
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	});

	await app.register(helmet);

	const appConfig = {
		name: configService.get("app.name", { infer: true }),
		port: configService.get("app.port", { infer: true }),
		environment: configService.get("app.environment", { infer: true }),
		corsOrigin,
		throtller: {
			limit: configService.get("app.throttler.limit", { infer: true }),
			ttl: configService.get("app.throttler.ttl", { infer: true }),
		},
		cache: {
			ttl: configService.get("app.cache.ttl", { infer: true }),
		},
	};
	const mongoDbConfig = {
		host: configService.get("databases.mongodb.host", { infer: true }),
		port: configService.get("databases.mongodb.port", { infer: true }),
		username: configService.get("databases.mongodb.username", { infer: true }),
		password: configService.get("databases.mongodb.password", { infer: true }),
		database: configService.get("databases.mongodb.database", { infer: true }),
	};
	const buenroMaterialsApiConfig = {
		baseURL: configService.get("buenroMaterialsApi.baseURL", { infer: true }),
		requestTimeoutMs: configService.get("buenroMaterialsApi.requestTimeoutMs", { infer: true }),
		retryAttempts: configService.get("buenroMaterialsApi.retryAttempts", { infer: true }),
	};

	const logger = new Logger();

	try {
		await app.listen(appConfig.port);

		logger.debug("RUNNING_APP", {
			app: appConfig,
			databases: {
				mongodb: mongoDbConfig,
			},
			buenroMaterialsApi: buenroMaterialsApiConfig,
		});
	} catch (error: any) {
		logger.error("BOOTSTRAP_APP_ERROR", {
			appConfig,
			mongoDbConfig,
			buenroMaterialsApiConfig,
			error: error instanceof Error
				? {
					cause: error.cause,
					message: error.message,
					name: error.name,
					stack: error.stack,
				}
				: { message: String(error) },
		});

		process.exit(1);
	}

	const gracefulShutdown = async (): Promise<void> => {
		try {
			logger.debug("SHUTTING_DOWN_SERVER");

			await app.close();

			process.exit(0);
		} catch (error: any) {
			logger.error("SHUTTING_DOWN_SERVER_ERROR", {
				error: error instanceof Error
					? {
						cause: error.cause,
						message: error.message,
						name: error.name,
						stack: error.stack,
					}
					: { message: String(error) },
			});

			process.exit(1);
		}
	};

	/* Listen for termination signal (e.g., `kill` command) */
	process.on("SIGTERM", gracefulShutdown);
	/* Listen for interrupt signal (e.g., Ctrl+C in terminal) */
	process.on("SIGINT", gracefulShutdown);
}

void bootstrap();
