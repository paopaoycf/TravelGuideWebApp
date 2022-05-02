
const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();



// ********************************************
//               DOMESTIC QUERY
// ********************************************

// Route for all states data
async function all_states(req, res) {
    // With a given date, search for domestic COVID stats by state.
    // In reality, the date will always be passed in, because its part of the url.
    const date = req.query.date ? req.query.date : '2022-04-26'
    // use this date encoding in the query to furnish the correct results

    // we have implemented this for you to see how to return results by querying the database
    connection.query(`WITH covid_selected_day AS (
        SELECT State, Total_Case, New_Case, Total_Death, New_Death
        FROM Covid_Stats_State
        WHERE Date = '${date}'
    ), vaccine_selected_day AS (
        SELECT State, SUM(First_Dose) AS Dose1, SUM(Series_Complete) AS Dose2, SUM(Booster) AS Booster
        FROM Vaccine_Stats_County
        WHERE Date = '${date}'
        GROUP BY State
    ), safe_county AS (
        SELECT n.State, COUNT(1) AS Safe_Counties
        FROM Risk_Level_County r JOIN State_Name n ON r.State = n.Full_State
        WHERE Date = '${date}'
          AND (Community_Trans_Level = 'low' OR Community_Trans_Level = 'moderate')
        GROUP BY State
    ), mask AS (
        SELECT State, Face_Mask_Required, Source_URL, Citation
        FROM Mask_Mandates_State
        WHERE Date = '${date}'
    )
    SELECT n.mid,
           c.State,
           c.Total_Case,
           c.New_Case,
           c.Total_Death,
           c.New_Death,
           v.Dose1,
           v.Dose2,
           v.Booster,
           s.Safe_Counties,
           m.Face_Mask_Required,
           m.Source_URL,
           m.Citation
    FROM covid_selected_day c
             LEFT OUTER JOIN vaccine_selected_day v ON c.State = v.State
             LEFT OUTER JOIN safe_county s ON c.State = s.State
             LEFT OUTER JOIN mask m ON c.State = m.State
             JOIN State_Name n ON c.State = n.State
    ORDER BY Safe_Counties DESC`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Route for single state data
async function state(req, res) {
    // With a chosen state and date
    const date = req.query.date ? req.query.date : '2022-04-26';
    const state = req.query.state ? req.query.state : 'CA';
    const fullname = req.query.fullname ? req.query.fullname : 'California';
    connection.query(`WITH risk AS (SELECT County, Cases_Per_100k, Positiveness_Percent, Community_Trans_Level
            FROM Risk_Level_County
            WHERE Date = '${date}' AND State = '${fullname}'),
    vaccine AS (SELECT County, First_Dose AS Dose1
            FROM Vaccine_Stats_County
            WHERE Date = '${date}' AND State = '${state}'),
    census AS (SELECT County, Census2019 AS Population
            FROM Population_County
            WHERE State = '${state}')
    SELECT r.County, 
           r.Cases_Per_100K, 
           r.Positiveness_Percent, 
           r.Community_Trans_Level, 
           v.Dose1, 
           c.Population
    FROM risk r 
            JOIN vaccine v ON r.County = v.County 
            JOIN census c ON v.County = c.County`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


// ********************************************
//         PROVIDERS & FACILITIES QUERY
// ********************************************
async function search_providers(req, res) {
    const zip = (req.query.zip && !isNaN(req.query.zip)) ? req.query.zip : 0
    const medicine = (req.query.medicine && !isNaN(req.query.medicine)) ? req.query.medicine : '00000'
    const instock = req.query.instock ? req.query.instock : ''   
    connection.query(`SELECT center_lat, center_lon FROM USZipCenter WHERE zip = ${zip}`, function (error, results, fields) {
        if(!results || results.length == 0){
            res.json({ results: results})
        } else if (results){
            const lat_c = results[0]["center_lat"]
            const lon_c = results[0]["center_lon"]
            connection.query(`WITH NearestArea AS(
                SELECT zip, center_lat, center_lon, ACOS(COS(RADIANS(zc.center_lat)) * COS(RADIANS(${lat_c})) * COS(RADIANS(zc.center_lon) - RADIANS(${lon_c})) + SIN(RADIANS(zc.center_lat)) * SIN(RADIANS(${lat_c}))) AS miles
                FROM ProviderZipCenter zc
                ORDER BY miles
                LIMIT 50
            ),
            NearestProviders AS (
                SELECT vp.guid, name, street, city, state, vp.zip, phone, walkins_accepted, insurance_accepted, sunday_hours, saturday_hours, prescreen_link, lat, lon
                FROM VaccineProvider vp JOIN NearestArea na on vp.zip = na.zip
            )
            SELECT np.guid, 0 as idx, p.in_stock, ${lat_c} as lat_c, ${lon_c} as lon_c, name, street, city, state, zip, phone, insurance_accepted, walkins_accepted, sunday_hours, saturday_hours, prescreen_link, lat, lon, TRUNCATE(69.0 * DEGREES(ACOS(COS(RADIANS(np.lat)) * COS(RADIANS(${lat_c})) * COS(RADIANS(np.lon) - RADIANS(${lon_c})) + SIN(RADIANS(np.lat)) * SIN(RADIANS(${lat_c})))),2) AS miles
            FROM NearestProviders np JOIN Provides p ON np.guid = p.guid
            WHERE p.ndc_code = ${medicine} AND p.in_stock LIKE '%%'
            ORDER BY miles
            LIMIT 50`, function (error, resultsss, fields) {
                if(error){
                    console.log(error)
                    res.json({ error: error })
                } else if (resultsss){
                    res.json({ results: resultsss})
                }
            });          
        }           
    });
}

async function provider_detail(req, res) {
    const id = req.query.id
    connection.query(`SELECT * FROM VaccineProvider WHERE guid = '${id}'`, function (error, results, fields) {
        if(error){
            console.log(error)
            res.json({ error: error })
        } else if (results){
            res.json({ results: results})
        }           
    });     
}

async function provider_instock(req, res) {
    const id = req.query.id
    connection.query(`SELECT * FROM Provides WHERE guid = '${id}'`, function (error, results, fields) {
        if(error){
            console.log(error)
            res.json({ error: error })
        } else if (results){
            res.json({ results: results})
        }           
    });     
}

async function facility_all_states(req, res){
    connection.query(`SELECT Distinct (state) FROM CareFacility ORDER BY state`, function (error, results, fields) {
        if(error){
            console.log(error)
            res.json({ error: error })
        } else if (results){
            res.json({ results: results})
        }           
    });     
}

async function facility_counties(req,res){
    const state = req.query.state
    connection.query(`SELECT Distinct (county) FROM CareFacility WHERE state = '${state}' ORDER BY county;`, function (error, results, fields) {
        if(error){
            console.log(error)
            res.json({ error: error })
        } else if (results){
            res.json({ results: results})
        }           
    });  

}

// async function all_facilities(req, res) {
//     const psize = (req.query.pagesize && !isNaN(req.query.pagesize)) ? req.query.pagesize : 10
//     if (req.query.page && !isNaN(req.query.page)) {
//         connection.query(`SELECT * FROM CareFacility
//         ORDER BY id
//         LIMIT ${psize}
//         OFFSET ` + ((req.query.page - 1) * psize).toString(), function (error, results, fields) {
//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
//     } else {
//         connection.query(`SELECT * FROM CareFacility
//         ORDER BY id`, function (error, results, fields) {
//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });        
//     }  
// }

async function search_facilities(req, res) {
    const state = req.query.State ? req.query.State : ''
    const county = req.query.County ? req.query.County : ''
    const kw = req.query.Keyword? req.query.Keyword : ''
    const psize = (req.query.pagesize && !isNaN(req.query.pagesize)) ? req.query.pagesize : 10
    const latLow = (req.query.LatLow && !isNaN(req.query.LatLow)) ? req.query.LatLow : 17.0
    const latHigh = (req.query.LatHigh && !isNaN(req.query.LatHigh)) ? req.query.LatHigh : 65.0
    const lonLow = (req.query.LonLow && !isNaN(req.query.LonLow)) ? req.query.LonLow : -159.0
    const lonHigh = (req.query.LonHigh && !isNaN(req.query.LonHigh)) ? req.query.LonHigh : -65.0
    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(`SELECT * FROM CareFacility
        WHERE state LIKE '%${state}%' AND lower(county) LIKE lower('%${county}%')
        AND (lower(name) LIKE lower('%${kw}%') OR lower(address) LIKE lower('%${kw}%') OR lower(city) LIKE lower('%${kw}%') OR lower(county) LIKE lower('%${kw}%'))
        AND (lat <= ${latHigh} AND lat >= ${latLow} AND lon <= ${lonHigh} AND lon >= ${lonLow})
        LIMIT ${psize}
        OFFSET ` + ((req.query.page - 1) * psize).toString(), function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    } else {
        connection.query(`SELECT * FROM CareFacility
        WHERE state LIKE '%${state}%' AND lower(county) LIKE lower('%${county}%')
        AND (lower(name) LIKE lower('%${kw}%') OR lower(address) LIKE lower('%${kw}%') OR lower(city) LIKE lower('%${kw}%') OR lower(county) LIKE lower('%${kw}%'))
        AND (lat <= ${latHigh} AND lat >= ${latLow} AND lon <= ${lonHigh} AND lon >= ${lonLow})`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });        
    }
}

async function facility_detail(req, res) {
    if(!req.query.id){
        return res.json({error: "Missing input id"})
    }else if(isNaN(req.query.id)){
        return res.json({error: "Id must be a number"})
    }else{
        const id = req.query.id
        connection.query(`SELECT lat, lon FROM CareFacility WHERE id = ${id}`, function (error, results, fields) {
            if(results.length == 0){
                res.json({ results: results})
            } else if (results){
                const lat_c = results[0]["lat"]
                const lon_c = results[0]["lon"]
                connection.query(`SELECT id, name, telephone, address, city, county, state, zip, directions, lat, lon, TRUNCATE(69.0 * DEGREES(ACOS(COS(RADIANS(cf.lat)) * COS(RADIANS(${lat_c}))
                * COS(RADIANS(cf.lon) - RADIANS(${lon_c})) + SIN(RADIANS(cf.lat)) * SIN(RADIANS(${lat_c})))),2) AS miles
                FROM CareFacility cf
                WHERE cf.state IN (SELECT state FROM CareFacility WHERE id = ${id})
                ORDER BY miles
                LIMIT 50`, function (error, resultsss, fields) {
                    if(error){
                        console.log(error)
                        res.json({ error: error })
                    } else if (resultsss){
                        res.json({ results: resultsss})
                    }
                });          
            }           
        });
    }
}



// ********************************************
//               INTERNATIONAL QUERY
// ********************************************

// async function all_countries_international_travel_controls(req, res) {
//     connection.query(`SELECT c.ISO_Code, c.Country_Name, c.Country_Latitude, c.Country_Longitude, b.Rating, b.Description
//     FROM Country_Current_Policy_Rating a
//     INNER JOIN Current_Policy_Rating b ON a.RatingType = b.RatingType AND a.Rating = b.Rating
//     INNER JOIN Country c on a.Country_Code = c.ISO_Code
//     WHERE b.RatingType = 'INTERNATIONAL_TRAVEL_CONTROLS'`, function (error, results, fields) {
//         if (error) {
//             console.log(error)
//             res.json({ error: error })
//         } else if (results) {
//             res.json({ results: results })
//         }
//     });
// }


async function select_country_overview(req, res) {
    connection.query(`WITH INTERNATIONAL_TRAVEL_CONTROLS AS (
        SELECT a.Country_Code,
               b.Rating,
               b.Description
        FROM Country_Current_Policy_Rating a
                 INNER JOIN Current_Policy_Rating b ON a.RatingType = b.RatingType AND a.Rating = b.Rating
        WHERE b.RatingType = 'INTERNATIONAL_TRAVEL_CONTROLS'
    ),
    CANCEL_PUBLIC_EVENTS AS (
        SELECT a.Country_Code,
               b.Rating,
               b.Description
        FROM Country_Current_Policy_Rating a
                 INNER JOIN Current_Policy_Rating b ON a.RatingType = b.RatingType AND a.Rating = b.Rating
        WHERE b.RatingType = 'CANCEL_PUBLIC_EVENTS'
    ),
    FACIAL_COVERINGS AS (
        SELECT a.Country_Code,
               b.Rating,
               b.Description
        FROM Country_Current_Policy_Rating a
                 INNER JOIN Current_Policy_Rating b ON a.RatingType = b.RatingType AND a.Rating = b.Rating
        WHERE b.RatingType = 'FACIAL_COVERINGS'
    ),
    RESTRICTION_ON_GATHERINGS AS (
        SELECT a.Country_Code,
               b.Rating,
               b.Description
        FROM Country_Current_Policy_Rating a
                 INNER JOIN Current_Policy_Rating b ON a.RatingType = b.RatingType AND a.Rating = b.Rating
        WHERE b.RatingType = 'RESTRICTION_ON_GATHERINGS'
    ),
    VACCINATION_POLICY AS (
        SELECT a.Country_Code,
               b.Rating,
               b.Description
        FROM Country_Current_Policy_Rating a
                 INNER JOIN Current_Policy_Rating b ON a.RatingType = b.RatingType AND a.Rating = b.Rating
        WHERE b.RatingType = 'VACCINATION_POLICY'
    )
    SELECT a.ISO_Code,
           a.Country_Name,
           a.Country_Latitude,
           a.Country_Longitude,
           b.Description AS CURRENT_CANCEL_PUBLIC_EVENTS_POLICY,
           c.Description AS CURRENT_FACIAL_COVERINGS_POLICY,
           d.Description AS CURRENT_RESTRICTION_ON_GATHERINGS_POLICY,
           e.Description AS CURRENT_VACCINATION_POLICY,
           f.Rating AS INTERNATIONAL_TRAVEL_CONTROLS_RATING,
           f.Description AS CURRENT_INTERNATIONAL_TRAVEL_CONTROLS_POLICY
    FROM Country a
    LEFT OUTER JOIN CANCEL_PUBLIC_EVENTS b ON a.ISO_Code = b.Country_Code
    LEFT OUTER JOIN FACIAL_COVERINGS c ON a.ISO_Code = c.Country_Code
    LEFT OUTER JOIN RESTRICTION_ON_GATHERINGS d ON a.ISO_Code = d.Country_Code
    LEFT OUTER JOIN VACCINATION_POLICY e ON a.ISO_Code = e.Country_Code
    LEFT OUTER JOIN INTERNATIONAL_TRAVEL_CONTROLS f ON a.ISO_Code = f.Country_Code`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


async function select_country_detail(req, res) {
    connection.query(`SELECT a.Country_Code, 
           b.Country_Name,
           b.Country_Latitude,
           b.Country_Longitude,
           a.Published_Date, 
           a.Sources, 
           a.Details1, 
           a.Details2, 
           a.Details3
    FROM Country_Current_Travel_Details a 
    INNER JOIN Country b ON a.Country_Code = b.ISO_Code
    WHERE b.ISO_Code = '${req.query.Country}'`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


async function select_country_stats(req, res) {
    connection.query(`
    SELECT a.Country_Code,
           b.Country_Name,
           b.Country_Latitude,
           b.Country_Longitude,
           DATE_FORMAT(Date, '%Y-%m-01') AS Date,
           a.New_Cases,
           a.New_Deaths
    FROM Country_Covid_Stats a 
    INNER JOIN Country b ON a.Country_Code = b.ISO_Code
    WHERE b.ISO_Code = '${req.query.Country}'
    GROUP BY a.Country_Code, b.Country_Name, b.Country_Latitude, b.Country_Longitude, DATE_FORMAT(Date, '%Y-%m-01')`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


async function select_top_5_country_by_cases(req, res) {
    connection.query(`SELECT a.Country_Code,
           b.Country_Name,
           b.Country_Latitude,
           b.Country_Longitude,
           SUM(a.New_Cases) AS Total_Cases
    FROM Country_Covid_Stats a 
    INNER JOIN Country b ON a.Country_Code = b.ISO_Code
    GROUP BY a.Country_Code, b.Country_Name, b.Country_Latitude, b.Country_Longitude
    ORDER BY SUM(a.New_Cases) DESC
    LIMIT 5`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


async function cumulative_case_count_worldwide(req, res) {
    connection.query(`WITH TOTAL_CASES AS (
    SELECT DATE_FORMAT(Date, '%Y-%m-01') AS Date,
    SUM(New_Cases) AS Total_Cases
    FROM Country_Covid_Stats
    GROUP BY DATE_FORMAT(Date, '%Y-%m-01')
)
SELECT Date,
SUM(Total_Cases) OVER (ORDER BY Date RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS Total_Cases
FROM TOTAL_CASES`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


module.exports = {
    all_states,
    state,
    search_providers,
    provider_detail,
    provider_instock,
    facility_all_states,
    facility_counties,
    search_facilities,
    // all_facilities,
    facility_detail,
    // all_countries_international_travel_controls,
    select_country_overview,
    select_country_detail,
    select_country_stats,
    select_top_5_country_by_cases,
    cumulative_case_count_worldwide
}
