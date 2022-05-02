const express = require('express');
const mysql = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route for domestic stats
app.get('/domestic', routes.all_states)
app.get('/state', routes.state)

// Route for providers and facilities
app.get('/findproviders', routes.search_providers)
app.get('/provider', routes.provider_detail)
app.get('/providerinstock', routes.provider_instock)
app.get('/facilitystate', routes.facility_all_states)
app.get('/facilitycounty', routes.facility_counties)
app.get('/findfacilities', routes.search_facilities)
app.get('/facility', routes.facility_detail)

// Route for international queries
// app.get('/intltravelcontrols', routes.all_countries_international_travel_controls)
app.get('/countryoverview', routes.select_country_overview)
app.get('/countrydetail', routes.select_country_detail)
app.get('/countrystats', routes.select_country_stats)
app.get('/top5countries', routes.select_top_5_country_by_cases)
app.get('/cumulativecases', routes.cumulative_case_count_worldwide)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
