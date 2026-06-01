import express from "express";
import { NextFunction, Request, Response } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerSaveMetrics } from "./api/metrics.js";
import { handlerResetMetrics } from "./api/reset.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser, handlerUpdateEMailAndPassword } from "./api/users.js";
import { handlerCreateChirps, handlerGetChirps, handlerGetChirpById, handlerDeleteChirpById } from "./api/chirps.js";
import { handlerLogin } from "./api/login.js";
import { handlerRefresh } from "./api/refresh.js";
import { handlerRevoke } from "./api/revoke.js";
import { handlerWebhookChirpyRed } from "./api/polka/webhooks.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = config.api.port;

app.use(middlewareLogResponses);
app.use(express.json());
app.get("/api/healthz", handlerReadiness);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerSaveMetrics);
app.post("/admin/reset", asyncHandler(handlerResetMetrics));
app.post("/api/users", asyncHandler(handlerCreateUser));
app.put("/api/users", asyncHandler(handlerUpdateEMailAndPassword));
app.post("/api/chirps", asyncHandler(handlerCreateChirps));
app.get("/api/chirps", asyncHandler(handlerGetChirps));
app.get("/api/chirps/:chirpId", asyncHandler(handlerGetChirpById));
app.delete("/api/chirps/:chirpId", asyncHandler(handlerDeleteChirpById));
console.log("registring login route...");
app.post("/api/login", asyncHandler(handlerLogin));
app.post("/api/refresh", asyncHandler(handlerRefresh));
app.post("/api/revoke", asyncHandler(handlerRevoke));
app.post("/api/polka/webhooks", asyncHandler(handlerWebhookChirpyRed));
app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function asyncHandler(fn: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}