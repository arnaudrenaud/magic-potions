start-dev:
	npm run dev

test-watch:
	npm run push-schema-to-test-database
	npm run test:watch

migrate-database:
	npx prisma migrate deploy

seed-database:
	npx prisma db seed