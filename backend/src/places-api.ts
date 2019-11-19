/**
 * Handles the requests to the Google Places API. This is used to populate the database
 * with places in a particular city when they don't already exist in the database.
 * @module places-api
 */

import fetch from "node-fetch";
import { Result, ok, err } from "./lib/result";
const Promise_ = require("bluebird");

interface MapsResponse {
  results: PlaceData[];
}

export interface PlaceData {
  name: string;
  formatted_address: string;
  icon: string;
  photos: MapsPhoto[];
  types: string[];
  rating: number;
  price_level: number;
}

interface MapsPhoto {
  photo_reference: string;
}

/**
 * Fetches cafes, parks, museums, restaruants, and bars in a given location.
 * Currently, this function is all or nothing. We don't want incomplete data,
 * so if any of the requests to the Places API fail, this will return null.
 * @param {string} cityName - The name of the city to search in (e.g. Detroit, MI)
 * @param {string} apiKey  - The API key for the Places API
 */
export async function fetchPlaceData(
  cityName: string,
  apiKey: string
): Promise<Result<PlaceData[]>> {
  const encodedCity = encodeURIComponent(cityName);
  try {
    const responses = await Promise_.all([
      fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+in+${encodedCity}&key=${apiKey}`
      ),
      fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=point%20of%20interest+in+${encodedCity}&type=park&key=${apiKey}`
      ),
      fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=point%20of%20interest+in+${encodedCity}&type=museum&key=${apiKey}`
      ),
      fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${encodedCity}&key=${apiKey}`
      ),
      fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+${encodedCity}&key=${apiKey}`
      )
    ]);

    const json = await Promise_.all(
      responses.map((res: Response) => res.json())
    );

    const results = json.map((obj: MapsResponse) => obj.results);

    let out: PlaceData[] = [];
    results.forEach((result: PlaceData[]) => out.push(...result));

    return ok(out);
  } catch (error) {
    return err(error.message);
  }
}
