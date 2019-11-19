import Knex from "knex";
import express from "express";
type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

export function autocompleteName(knex: Knex) {
  return async function(req: Req, res: Res, next: Next) {
    try {
      const prefix = req.params.prefix;

      const result = await knex("cities")
        .select("with_state_abbr")
        .where("with_state_abbr", "ILIKE", `${prefix}%`)
        .limit(10);

      const suggestions = result.map(record => record.with_state_abbr);

      res.json({
        results: suggestions
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}
