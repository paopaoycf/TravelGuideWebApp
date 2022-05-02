import React, { memo } from "react";
import { geoCentroid } from "d3-geo";
import { scaleQuantize } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
const convert = require('us-state-converter');

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const colorScale = scaleQuantize()
  .domain([1, 10])
  .range([
    "#fff1f0",
    "#ffccc7",
    "#ffa39e",
    "#ff7875",
    "#ff4d4f",
    "#f5222d",
    "#cf1322",
    "#a8071a",
    "#820014"
  ]);

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const goToState = (date, name) => {
  window.location = `/state?date=${date.toISOString().split('T')[0]}&state=${convert.abbr(name)}&fullname=${name}`
};

const MapChart = ( props ) => {
  const {allStatesResults , setTooltipContent, date} = props;
  return (
    
    <ComposableMap data-tip="" projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map(geo => {
              const cur = allStatesResults.find(s => s.mid === geo.id);
              return (<Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  const cur = allStatesResults.find(s => s.mid === geo.id);
                  if(!cur) return;
                  setTooltipContent(cur);
                }}
                onMouseDown={() => {
                  const { name } = geo.properties;
                  goToState(date, name);
                }}
                onMouseLeave={() => {
                  setTooltipContent({});
                }}
                style={{
                  default: {
                    stroke: "#FFF",
                    fill: cur ? colorScale(cur.New_Case / 1000): "#DDD",
                    outline: "none"
                  },
                  hover: {
                    fill: "#feffe6",
                    outline: "none"
                  },
                  pressed: {
                    fill: "#feffe6",
                    outline: "none"
                  }
                }}
              />);
            })}
            {geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const cur = allStatesResults.find(s => s.mid === geo.id);
              return (
                <g key={geo.rsmKey + "-name"}>
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.State) === -1 ? (
                    <Marker coordinates={centroid} onMouseEnter={() => {
                      const cur = allStatesResults.find(s => s.mid === geo.id);
                      setTooltipContent(cur);
                    }}
                    onMouseDown={() => {
                      const { name } = geo.properties;
                      goToState(date, name);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent({});
                    }}>
                      <text y="2" fontSize={14} textAnchor="middle">
                        {cur.State}
                      </text>
                    </Marker>
                  ) : (
                    <Annotation
                      subject={centroid}
                      dx={offsets[cur.State][0]}
                      dy={offsets[cur.State][1]}
                      onMouseEnter={() => {
                        const cur = allStatesResults.find(s => s.mid === geo.id);
                        setTooltipContent(cur);
                      }}
                      onMouseDown={() => {
                        const { name } = geo.properties;
                        goToState(date, name);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent({});
                      }}
                    >
                      <text x={4} fontSize={14} alignmentBaseline="middle">
                        {cur.State}
                      </text>
                      </Annotation>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
    
  );
};

export default memo(MapChart);

