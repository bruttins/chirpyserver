import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { saveMetrics } from "./api/metrics.js";
import { resetMetrics } from "./api/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.get("/healthz", handlerReadiness);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use("/metrics", saveMetrics);
app.use("/reset", resetMetrics);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});