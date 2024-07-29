# Magic Potions

Dependencies :

- Node.js (version 18+)
- Make

## Getting started

Install dependencies:

```
npm install
```

## Configure environment

Create a `.env` file based on `.env.example`.

## Migrate database

Apply database migration scripts to the database:

```
make migrate-database
```

## Seed database

Seed initial ingredients and recipes to the database:

```
make seed-database
```

## Run tests

Run tests against an isolated, disposable database (`prisma/db.test.sqlite`):

```
make test:watch
```
