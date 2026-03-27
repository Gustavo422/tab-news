import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  console.log(request.method);
  if (request.method !== "GET" && request.method !== "POST") {
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    verbose: true,
    direction: "up",
    migrationTable: "pgmigrations",
  };
  if (request.method == "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method == "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    return migratedMigrations.length > 0
      ? response.status(201).json(migratedMigrations)
      : response.status(200).json(migratedMigrations);
  }
}
