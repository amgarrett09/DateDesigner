/**
 * Exports a default knex instance so that knex queries can be made in
 * other modules. Also contains some functions which abstract over
 * queries which are repeated often and/or are complex or tedious.
 * @module db
 */

import Knex from "knex";
import {
  createCitiesTable,
  createPlacesTable,
  createSchedulesTable
} from "./schemas";
import * as config from "../config";

const moment = require("moment-timezone");

const knexConfig = {
  client: "pg",
  connection: {
    host: "localhost",
    user: "admin",
    password: config.dbPassword,
    database: "date_designer"
  }
};
const knexInstance: Knex = Knex(knexConfig);
export { knexInstance as knex };

export interface KnexRawResponse {
  rows: any[];
}

/**
 * Creates database tables if they do not already exist.
 * @param {Object} knex - The knex instance
 */
export async function initializeTables(knex: Knex) {
  await createCitiesTable(knex);
  await createPlacesTable(knex);
  await createSchedulesTable(knex);
}

/**
 * Inserts an array of records in a given table, in a single transaction.
 * If constraints on specified columns cause a conflict, the query will
 * be ignored and the transaction will continue.
 * @param {Object} knex - The knex instance
 * @param {string} table - The table to insert into
 * @param {Array} records - The records to insert
 * @param {Array} conflictTarget - An array of one or more column names that have a single constraint
 */
export function insertManyIgnoreConflicts(
  knex: Knex,
  table: string,
  records: any[],
  conflictTarget: string[]
) {
  // Generate 'on conflict do nothing' queries for each record
  const queries = records.map(record => {
    const baseQuery = knex(table)
      .insert(record)
      .toString();

    const columnNames = conflictTarget.join(", ");
    return `${baseQuery} ON CONFLICT(${columnNames}) DO NOTHING`;
  });

  // Start a transaction that contains all queries
  return knex
    .transaction(trx => {
      Promise.all(queries.map(query => knex.raw(query).transacting(trx)))
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => console.error(err));
}

/**
 * Deletes week-old schedule records
 * @param {Object} knex - The knex instance
 */
export function deleteOldScheduleRecords(knex: Knex) {
  const weekOldTime = moment().subtract(1, "week");

  return knex("schedules")
    .where("timeCreated", "<", weekOldTime)
    .del();
}
