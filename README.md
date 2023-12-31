# Shopware End-to-End Test Demo Project

This repository contains a Shopware 6 demo project with end-to-end tests.

## Requirements

* [PHP](https://www.php.net/) 8.2 with [extensions required by Shopware](https://docs.shopware.com/en/shopware-6-en/first-steps/system-requirements#environment)
* [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/it) 18.x with [npm](https://www.npmjs.com/)
* [Symfony CLI](https://symfony.com/download)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Installation

Install PHP dependencies:

```bash
composer install
```

Install Node.js dependencies:

```bash
npm install
```

Create a `docker-compose.override.yml` file like the following and adapt it to fit your system:

```yaml
version: '3'

services:
###> symfony/mailer ###
  mailer:
    image: schickling/mailcatcher
    ports: ["1025:1025", "1080:1080"]
###< symfony/mailer ###

###> shopware/core ###
  database:
    ports:
      - "3306:3306"
    labels:
      com.symfony.server.service-ignore: true
###< shopware/core ###

###> shopware/elasticsearch ###
  opensearch:
    ports:
      - "9200:9200"
###< shopware/elasticsearch ###

```

Start development services with:

```bash
composer dev:start
```

This command will:

1. Start Docker Compose
2. Start Symfony CLI proxy
3. Start a Symfony CLI server for development on port `8000`
4. Start a Symfony CLI server for end-to-end tests on port `8005`

Create an `.env.local` file like the following and adapt it to fit your system:

```
MAILER_DSN=smpt://127.0.0.1:1025
APP_ENV=dev
APP_URL=http://127.0.0.1:8000
APP_SECRET=ChangeMe
BLUE_GREEN_DEPLOYMENT=0
DATABASE_URL=mysql://shopware:!ChangeMe!@127.0.0.1/shopware
OPENSEARCH_URL=http://127.0.0.1:9200
SHOPWARE_ES_ENABLED=1
SHOPWARE_ES_INDEXING_ENABLED=1

```

Install Shopware on development database with:  

```bash
bin/console system:install --basic-setup
```

If you enabled Elasticsearch, you need to run the following command to create the index:

```bash
bin/console es:index
```

## Prepare for end-to-end tests

Create an `.env.e2e.local` file like the following and adapt it to fit your system:

```
DATABASE_URL=mysql://root:!ChangeMe!@127.0.0.1:3306/shopware_e2e

```

The `DATABASE_URL` env var in this file should point to a different database to use with end-to-end tests.

Then prepare end-to-end tests database and dump with:

```bash
composer test:e2e:prepare
```

This command will:

1. Install Shopware on end-to-end tests database
2. Disable first run wizard on that database
3. Dump the end-to-end database to `var/dumps`. This dump will be imported before each end-to-end test run to isolate tests.

## Run end-to-end tests

When you have end-to-end database prepared you can run end-to-end tests with:

```bash
composer test:e2e
```
