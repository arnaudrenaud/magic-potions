install:
	npm install
	npx prisma generate

start-dev:
	npm run dev

start-prod:
	npm run build
	npm run start

test-watch:
	npm run push-schema-to-test-database
	npm run test:watch

generate-migrate-database:
	npx prisma migrate dev

migrate-database:
	npx prisma migrate deploy

seed-database:
	npx prisma db seed