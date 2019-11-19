import Knex from "knex";
import express from "express";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

const hashObject = require("object-hash");
const moment = require("moment-timezone");

export function post(knex: Knex) {
  return async function(req: Req, res: Res, next: Next) {
    try {
      if (!req.body || !req.body.schedule) {
        res.status(400).json({
          code: 400,
          message: "Missing schedule data."
        });
        return next();
      }

      let json;
      try {
        json = JSON.stringify(req.body.schedule);
      } catch (err) {
        res.status(400).json({
          code: 400,
          message: "Invalid request body."
        });
        return next();
      }

      const record = {
        created_at: moment(),
        json,
        hash: undefined
      };

      record.hash = hashObject(record);

      const results = await knex("schedules")
        .insert(record)
        .returning("*");

      res.json({
        results
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}

export function getByHash(knex: Knex) {
  return async function(req: Req, res: Res, next: Next) {
    try {
      const hash = req.params.hash;

      const records = await knex("schedules")
        .select("json")
        .where("hash", hash);

      if (records.length === 0) {
        res.status(404).json({
          code: 404,
          message: "No record found."
        });
        return next();
      }

      const schedule = records[0].json;

      res.json({
        results: [schedule]
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}
