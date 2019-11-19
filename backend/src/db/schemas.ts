import Knex from "knex";

export async function createCitiesTable(knex: Knex) {
  const exists = await knex.schema.hasTable("cities");
  if (!exists) {
    try {
      await knex.raw(`
          CREATE TABLE cities (
            id BIGSERIAL NOT NULL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            with_state_abbr VARCHAR(100) NOT NULL UNIQUE
          ) 
        `);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export async function createPlacesTable(knex: Knex) {
  const exists = await knex.schema.hasTable("places");
  if (!exists) {
    try {
      await knex.raw(`
        CREATE TABLE places (
          id BIGSERIAL NOT NULL PRIMARY KEY,
          city_id BIGSERIAL NOT NULL REFERENCES cities(id),
          name VARCHAR(200) NOT NULL,
          address VARCHAR(300) NOT NULL,
          icon_url VARCHAR(200),
          photo_reference VARCHAR(200),
          types VARCHAR(200) NOT NULL,
          has_gnb INT NOT NULL,
          has_no_gnb INT NOT NULL,
          is_wheelchair_accessible INT NOT NULL,
          is_not_wheelchair_accessible INT NOT NULL,
          google_user_rating FLOAT,
          price_level INT,
          UNIQUE(name, address)
        )
      `);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export async function createSchedulesTable(knex: Knex) {
  const exists = await knex.schema.hasTable("schedules");
  if (!exists) {
    try {
      await knex.raw(`
        CREATE TABLE schedules (
          id  BIGSERIAL NOT NULL PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          hash VARCHAR(200) NOT NULL UNIQUE,
          json JSON NOT NULL  
        );
      `);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
