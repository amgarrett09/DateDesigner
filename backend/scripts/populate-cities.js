const request = require("request");
const { JSDOM } = require("jsdom");
const { knex, insertManyIgnoreConflicts } = require("../../db");

const usStateAbbr = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY"
};

function scrapeCityNames(state) {
  const stateEncoded = state.replace(" ", "-");
  request(
    `https://www.alphalists.com/list/alphabetical-list-${stateEncoded}-cities`,
    async (err, req, body) => {
      const { window } = new JSDOM(body);

      // The html for the list of city names
      const source = window.document.querySelector(".field-item.even")
        .firstElementChild.innerHTML;

      // Pull out the city names
      const names = source.split("<br>\n").map(st => st.trim());

      // Append state abbreviation
      const withStateAbbr = names.map(name => `${name}, ${usStateAbbr[state]}`);

      // Create new records and store in database
      const records = names.map((name, i) => {
        return {
          name,
          with_state_abbr: withStateAbbr[i]
        };
      });

      await insertManyIgnoreConflicts(knex, "cities", records, [
        "with_state_abbr"
      ]);
      console.log(`${state} cities inserted`);
    }
  );
}

Object.keys(usStateAbbr).forEach(state => scrapeCityNames(state));
