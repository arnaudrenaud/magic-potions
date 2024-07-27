export default async () => {
  process.env.DATABASE_URL = "file:./db.test.sqlite";
};
