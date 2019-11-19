import express from "express";
import bodyParser from "body-parser";
import { knex, initializeTables, deleteOldScheduleRecords } from "./db";
import * as places from "./routes/places";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

const server: express.Application = express();
const PORT = process.env.PORT || 5000;
const helmet = require("helmet");

const schedules = require("./routes/schedules");
const cities = require("./routes/cities");

server.use(
  bodyParser.json({
    limit: 10240
  })
);
server.use(helmet());
// CORS setup; only used in development, since in production, the frontend is on same domain
if (process.env.NODE_ENV !== "production") {
  const cors = require("cors");
  server.use(cors());
}

initializeTables(knex);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Delete week-old schedule records on an interval
const _interval = setInterval(async () => {
  try {
    await deleteOldScheduleRecords(knex);
  } catch (err) {
    console.log(err);
  }
}, 21600000);

// Routes
server.get(
  "/api/v1/cities/autocomplete/:prefix",
  cities.autocompleteName(knex)
);

server.get("/api/v1/places/byCity/:city", places.getByCity(knex));

server.get("/api/v1/places/:id", places.getById(knex));

server.patch("/api/v1/places/:id", places.patch(knex));

server.post("/api/v1/schedules", schedules.post(knex));

server.get("/api/v1/schedules/:hash", schedules.getByHash(knex));

// Handler for errors that routes fail to handle
server.use(function(err: Error, _req: Req, res: Res, _next: Next) {
  console.log(err.stack);
  res.status(500).json({
    code: 500,
    message: "There was a problem on our end. Please try again later."
  });
});
