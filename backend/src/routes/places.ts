import Knex from "knex";
import express from "express";
import { insertManyIgnoreConflicts, KnexRawResponse } from "../db";
import { Result, ResultType, ok, err } from "../lib/result";
import { fetchPlaceData, PlaceData } from "../places-api";
import * as config from "../config";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

const CITY_NAME_VALIDATOR = /[A-Z]{1}.+, [A-Z]{2}/g;
const PLACES_KEY = process.env.PLACES_KEY || config.placesKey;
if (!PLACES_KEY) throw new Error("You need to supply the Places API key!");

export function getByCity(knex: Knex) {
  return async function(req: Req, res: Res, next: Next) {
    try {
      const cityName = decodeURIComponent(req.params.city);
      const match = cityName.match(CITY_NAME_VALIDATOR);

      if (!match || !match[0] || match[0] !== cityName) {
        res.status(400).json({
          code: 400,
          message: "Invalid city name."
        });

        return next();
      }

      const dbPlaceData = await queryPlacesByCity(knex, cityName);

      // If we find data, return that
      if (dbPlaceData.length > 0) {
        res.json({
          results: dbPlaceData
        });

        return next();
      }

      // If we don't find records, check to make sure the city is in the DB
      const cityRecord = await knex("cities")
        .select("id")
        .where("with_state_abbr", cityName);

      if (cityRecord.length === 0) {
        res.status(404).json({
          code: 404,
          message: "City not found."
        });

        return next();
      }

      const cityID = cityRecord[0].id;

      // Fetch data from the Google Places API
      const placesResult: Result<PlaceData[]> = await fetchPlaceData(
        cityName,
        PLACES_KEY
      );
      if (placesResult.type === ResultType.Err) {
        res.status(500).json({
          code: 500,
          message: "There was a problem on our end. Please try again later."
        });

        return next();
      }

      const apiPlaceData = placesResult.value;

      // Filter out records that aren't from this city
      const filtered = apiPlaceData.filter(record =>
        record.formatted_address.includes(cityName)
      );

      // Format to fit with database schema
      const formattedPlaceData = filtered.map(place => {
        return {
          city_id: cityID,
          name: place.name,
          address: place.formatted_address,
          icon_url: place.icon,
          photo_reference: place.photos ? place.photos[0].photo_reference : "",
          types: place.types.join(","),
          has_gnb: 0,
          has_no_gnb: 0,
          is_wheelchair_accessible: 0,
          is_not_wheelchair_accessible: 0,
          google_user_rating: place.rating || -1,
          price_level: place.price_level || -1
        };
      });

      await insertManyIgnoreConflicts(knex, "places", formattedPlaceData, [
        "name",
        "address"
      ]);

      // Get results back from DB so we get access to IDs
      const results = await queryPlacesByCity(knex, cityName);

      res.json({
        results
      });

      next();
    } catch (err) {
      next(err);
    }

    async function queryPlacesByCity(knex: Knex, cityName: string) {
      const dbPlaceData = await knex("places")
        .innerJoin("cities", "places.city_id", "cities.id")
        .select(
          "places.id",
          "places.name",
          "address",
          "icon_url",
          "photo_reference",
          "types",
          "has_gnb",
          "has_no_gnb",
          "is_wheelchair_accessible",
          "is_not_wheelchair_accessible",
          "google_user_rating",
          "price_level"
        )
        .where("with_state_abbr", cityName)
        .orderBy("google_user_rating", "desc");

      return dbPlaceData;
    }
  };
}

export function getById(knex: Knex) {
  return async function(req: Req, res: Res, next: Next) {
    try {
      const id = req.params.id;
      const results = await knex("places")
        .select()
        .where("id", id);

      res.json({
        results
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}

interface Patch {
  params: PatchParams;
  body: PatchBody;
}
interface PatchParams {
  id: number;
}
interface PatchBody {
  op: Operation;
  field: ValidField;
}
enum Operation {
  add = "add"
}
enum ValidField {
  hasGnb = "has_gnb",
  noGnb = "has_no_gnb",
  wheelchairAccessible = "is_wheelchair_accessible",
  notWheelchairAccessible = "is_not_wheelchair_accessible"
}

function parsePatchReq(req: Req): Result<Patch> {
  if (!req.params || !req.params.id) return err("Missing request params");
  if (!req.body || !req.body.op || !req.body.field)
    return err("Must supply operation and field");

  const id = parseInt(req.params.id);
  if (isNaN(id)) return err("Id is not a number");

  const op = req.body.op;
  if (!Object.values(Operation).includes(op)) return err("Invalid operation");

  const field = req.body.field;
  if (!Object.values(ValidField).includes(field)) return err("Invalid field");

  return ok({
    params: {
      id
    },
    body: {
      op,
      field
    }
  });
}

export function patch(knex: Knex) {
  return async function(req: Req, res: Res, next: Next) {
    try {
      const patchResult = parsePatchReq(req);
      if (patchResult.type === ResultType.Err) {
        res.status(400).json({
          code: 400,
          message: patchResult.message
        });

        return next();
      }

      const patch = patchResult.value;

      const { id } = patch.params;
      const { field } = patch.body;

      // Update the record and return the updated version
      const updated: KnexRawResponse = await knex.raw(
        `UPDATE "places" 
           SET ?? = ?? + 1
           WHERE id = ? RETURNING *`,
        [field, field, id]
      );

      res.json({
        results: updated.rows
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}
