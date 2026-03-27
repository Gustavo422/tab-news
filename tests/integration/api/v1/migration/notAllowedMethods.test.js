import database from "infra/database";

beforeAll(cleanDatabase);
async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const notAllowedMethods = ["HEAD", "PUT", "DELETE", "OPTIONS", "PATCH"];

test.each(notAllowedMethods)(
  "%s to /api/v1/migrations should return status 405",
  async (method) => {
    const response = await fetch("http:localhost:3000/api/v1/migrations", {
      method: method,
    });

    expect(response.status).toBe(405);
  },
);
