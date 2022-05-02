import React, { useEffect, useState, memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { getCountryOverview } from '../fetcher'

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLinear()
  .domain([0, 4])
  .range(["#ffedea", "#ff2400"])
  .unknown("#e9ecef");

const MapChart = ({ setTooltipContent }) => {
  const [countryMapData, setcountryMapData] = useState([]);

  useEffect(() => {
    getCountryOverview().then(res => {
      setcountryMapData(res.results);
    });
  }, []);

  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {

                const d = countryMapData.find((s) => {
                  return s.ISO_Code === geo.properties.ISO_A3
                });
                return <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    window.location.replace(`/country-detail/${d.ISO_Code}`);
                  }}
                  onMouseEnter={() => {
                    if (!d) return
                    setTooltipContent(d)
                  }}
                  onMouseLeave={() => {
                    setTooltipContent({});
                  }}
                  style={{
                    default: {
                      fill: d ? colorScale(d.INTERNATIONAL_TRAVEL_CONTROLS_RATING) : "#F5F4F6",
                      outline: "#F5F4F"
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                />
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
