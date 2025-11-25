![Node.js](https://img.shields.io/badge/node-24.11.1-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-^5.9.3-blue.svg)
![@nestjs/core](https://img.shields.io/badge/@nestjs/core-^11.1.9-red.svg)
![@nestjs/cli](https://img.shields.io/badge/@nestjs/cli-^11.0.12-red.svg)
![Jest](https://img.shields.io/badge/jest-^30.2.0-purple.svg)

# 🌾 Buenro Harvester 🚜

Collects data from multiple sources, processes it, and exposes the results through an REST API.

## 🎛️ Running the app

### Set up your `.env`

```env
# ⬢⬢⬢ Application ⬢⬢⬢
APP_NAME="buenro-harvester"
APP_PORT="3000"
NODE_ENV="local"
CORS_ORIGIN="http://localhost:3000,https://production-example.com"

# ⬢⬢⬢ MongoDB ⬢⬢⬢
# MONGODB_HOST="localhost"
MONGODB_HOST="127.0.0.1"
MONGODB_PORT="27017"
MONGODB_USERNAME=""
MONGODB_PASSWORD=""
MONGODB_DATABASE="buenro_harvester"

# ⬢⬢⬢ Buenro Materials API ⬢⬢⬢
BUENRO_MATERIALS_API_BASE_URL="https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com"
BUENRO_MATERIALS_API_REQUEST_TIMEOUT_MS="120000"
BUENRO_MATERIALS_API_RETRY_ATTEMPTS="3"

# ⬢⬢⬢ Cache ⬢⬢⬢
CACHE_TTL_IN_SECONDS="5"

# ⬢⬢⬢ Throttler ⬢⬢⬢
THROTTLER_LIMIT="100"
THROTTLER_TTL_IN_SECONDS="60"
```

### Set the correct Node.js version via the `.nvmrc` file

```sh
nvm use
```

### Rise the containers

```sh
docker compose up -d
```

### Run the app on watch mode

```sh
npm run start:dev
```

### Harvesting process

The data harvest process will be triggered in the very moment you bootstrap the App and in an interval of every 4 hours after that. If you wanna change that go to class `JobsService`.

**⚠️ PLEASE WAIT FOR THE 1M RECORDS TO BE IN PLACE IN ORDER TO MAKE QUERIES ⚠️**

### You can check the app health

```sh
curl --request GET \
  --url http://localhost:3000/health
```

### You can make searchs on Stays (`Stays` = `Stays Profiles` + `Stays Summaries`)

```sh
curl --request GET \
  --url 'http://localhost:3000/stays/search?<QUERY_PARAMS_HERE>'
```

### Optionally, if you wanna bring the containers down and drop volumes

```sh
docker compose down -v
```

## 🧪 Query Params to test `/stays/search`

```txt
--------------------------
[TEST 1] Partial Text + Pagination

text  = Ocean Breeze (or Ocean Breeze)
limit = 10
skip  = 0

Partial Text Filtering ($text): Finds results where name, city, or country contains the words "Grand" or "Hotel." This tests the multi-field text index across both schemas.
--------------------------
[TEST 2] Numeric Range + Common Filter

minPrice    = 500
maxPrice    = 750
isAvailable = true

Numeric Range Filtering: Filters all documents (both sources) where pricePerNight is between $500 and $750. Common Field Filtering: Further filters results to only show records where the base field isAvailable is true.
--------------------------
[TEST 3] Discriminator 1 (Stays Profiles) Filter

country       = France
sortBy        = name
sortDirection = DESC

Specific Field Filtering: Filters exclusively for StayProfile documents, as only they contain the country field. This confirms filtering on non-base attributes.
--------------------------
[TEST 4] Discriminator 2 (Stays Summaries) Filter

priceSegment = high
limit        = 50
sortBy       = pricePerNight

Specific Field Filtering: Filters exclusively for StaySummary documents, as only they contain the priceSegment field. This tests a filter on the second discriminator.
--------------------------
[TEST 5] Compound Filter (Mixed)

city         = London
priceSegment = medium
limit        = 10

Compound Filtering: Filters the entire collection by the base field city (London), and then implicitly narrows the result to only StaySummary documents where priceSegment is "medium."
--------------------------
```

## 🧹 Code Quality and Readability

I followed best practices to write **C**lean, **S**ustainable, and **S**calable code — what I like to call CSS. I prioritize clarity and maintainability so others can easily understand and extend the codebase. Plus, I:

- Consistently named variables and functions with purpose and precision to reflect their intent.
- Modularized logic into reusable, single-responsibility functions and components.
- Minimized side effects and embraced predictable patterns by structuring code using consistent, well-known approaches, making debugging and collaboration easier.

## 💡 Very useful data that helped me to develop

- **NestJS**
  - [**MongoDB Techniques**](https://docs.nestjs.com/techniques/mongodb)
- **Mongoose**
  - [**Connections**](https://mongoosejs.com/docs/connections.html#connections)
  - [**TLS/SSL Connections**](https://mongoosejs.com/docs/tutorials/ssl.html#tlsssl-connections)
  - [**Options**](https://mongoosejs.com/docs/guide.html#options)
  - [**Schema Types**](https://mongoosejs.com/docs/schematypes.html#schematypes)
  - [**Discriminators**](https://mongoosejs.com/docs/discriminators.html#discriminators)
  - [**Medium Post (Discriminators**)](https://medium.com/@sepehr.gouran/using-mongoose-discriminators-in-nest-js-7b715eee76eb)
  - [**TypeScript Support**](https://mongoosejs.com/docs/typescript.html#typescript-support)
  - [**Schemas in TypeScript**](https://mongoosejs.com/docs/typescript/schemas.html#schemas-in-typescript)
  - [**Hydrate**](https://mongoosejs.com/docs/api/model.html#Model.hydrate())
- **GOT**
  - [**Repository**](https://github.com/sindresorhus/got)
  - [**Promise API**](https://github.com/sindresorhus/got/blob/main/documentation/1-promise.md#promise-api)
  - [**Retry API**](https://github.com/sindresorhus/got/blob/main/documentation/7-retry.md#retry-api)
  - [**Stream API**](https://github.com/sindresorhus/got/blob/main/documentation/3-streams.md#stream-api)
  - [**Hooks API**](https://github.com/sindresorhus/got/blob/main/documentation/9-hooks.md#hooks-api)
  - [**Options**](https://github.com/sindresorhus/got/blob/main/documentation/2-options.md#options)
  - [**Timeout Options**](https://github.com/sindresorhus/got/blob/main/documentation/6-timeout.md#timeout-options)
  - [**Errors**](https://github.com/sindresorhus/got/blob/main/documentation/8-errors.md#errors)
  - [**Tips**](https://github.com/sindresorhus/got/blob/main/documentation/tips.md#tips)

## 🧱 Project Architecture

```txt
src/
├── constants/
├── filters/
├── helpers/
├── interceptors/
├── middlewares/
├── modules/
│   ├── app/
│   ├── buenro/
│   ├── cache/
│   ├── harvester/
│   ├── health_check/
│   ├── jobs/
│   └── stays/
├── pipes/
├── utils/
└── main.ts
```

I designed the project with a clear, modular folder structure to ensure maintainability and scalability. The `src` directory is organized by responsibility — separating concerns like config, logging, database models/schemas, workers (could also fit queues if necessary) — which keeps logic isolated and easy to navigate.

## 🧠 Tech Choices and Design Decisions

### 🧩 Why NestJS?

I chose NestJS because it's my favorite Node.js framework. It’s like Express or Fastify on steroids (both of which NestJS can run on top of as underlying HTTP platforms, combining their speed with it’s own powerful abstraction layer) — built with TypeScript, powered by strong architecture principles, and backed by an amazing community. NestJS comes with built-in support for modules, decorators, guards, interceptors, DI, testing tools, and much more. The number of out-of-the-box features that NestJS provides significantly accelerates development, allowing you to focus on business logic rather than boilerplate or infrastructure concerns.

### 🌐 CORS and Throttling

I configured CORS globally to ensure that the backend safely accepts requests from trusted frontends. This protects the API from unwanted cross-origin calls, especially in browser environments.

Global throttling limits help mitigate brute-force attacks, spamming, or resource exhaustion, offering basic rate limiting out-of-the-box across all routes.

### 🐳 Docker Setup

I added a `docker-compose.yml` to:

* Quickly bootstrap the project with MongoDB.
* Simplify onboarding for reviewers or other developers.
* Ensure consistency across environments (no “works on my machine” issues).

This makes local development and production deployment easier, faster, and reproducible.

### ⚡ The Raw Performance Metric

| **Metric**           | **Value**                            |
| -------------------- | ------------------------------------ |
| **Total Entries**    | `1.001.000`                          |
| **Total Time**       | `~1m20s` / `~1m30s`                  |
| **Throughput (OPS)** | `~12.512` / `~11.122` upserts/second |
