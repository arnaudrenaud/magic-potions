# Magic Potions

Dependencies :

- Node.js (version 18+)
- Make

## Run app

### Install dependencies

```
make install
```

### Configure environment

Create a `.env` file based on `.env.example`.

### Migrate database

Apply database migration scripts to the database:

```
make migrate-database
```

### Seed database

Seed initial ingredients and recipes to the database:

```
make seed-database
```

### Start production server

```
make start-prod
```

## Develop

### Start development server

```
make start-dev
```

### Generate and apply new database migration

After updating database schema (`prisma/schema.prisma`):

```
make generate-migrate-database
```

### Run tests

Run tests against an isolated, disposable database (`prisma/db.test.sqlite`):

```
make test:watch
```
