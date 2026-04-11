import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct connection for migrations (non-pooled, port 5432)
    url: process.env["POSTGRES_URL_NON_POOLING"],
  },
});
