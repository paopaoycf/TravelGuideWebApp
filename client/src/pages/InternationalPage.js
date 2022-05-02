import React, { useEffect, useState } from 'react'
import ReactTooltip from "react-tooltip";
import { Table as ReactstrapTable } from "reactstrap";
import moment from 'moment';

import InternationalMapChart from "../components/InternationalMapChart";
import CountryDetailChart from '../components/CountryDetailChart';

import MenuBar from '../components/MenuBar';
import { getCumulativeCases, getTop5countries } from '../fetcher';

const DisplayToolTip = ({ Country_Name, INTERNATIONAL_TRAVEL_CONTROLS_RATING ,CURRENT_RESTRICTION_ON_GATHERINGS_POLICY, CURRENT_FACIAL_COVERINGS_POLICY, CURRENT_VACCINATION_POLICY }) => {
  return (
    <div style={{maxWidth: 300}}>
      <div style={{ marginBottom: 5, fontWeight: 'bold' }}>{Country_Name} - {INTERNATIONAL_TRAVEL_CONTROLS_RATING || 'No data'}</div>
      <div style={{ fontWeight: 'bold' }}>Current Restriction on Gathering Policy:</div>
      <div style={{marginBottom: 5}}>{CURRENT_RESTRICTION_ON_GATHERINGS_POLICY || 'No data'}</div>
      <div style={{ fontWeight: 'bold' }}>Current Facial Covering Policy:</div>
      <div style={{marginBottom: 5}}>{CURRENT_FACIAL_COVERINGS_POLICY || 'No data'}</div>
      <div style={{ fontWeight: 'bold' }}>Current Vaccination Policy:</div>
      <div >{CURRENT_VACCINATION_POLICY || 'No data'}</div>
    </div>
  )
}

const InternationalPage = () => {
  const [content, setContent] = useState({});
  const [top5Data, setTop5Data] = useState([]);
  const [dates, setDates] = useState([]);
  const [newCaseData, setNewCaseData] = useState([]);

  useEffect(() => {
    getTop5countries().then((res) => {
      setTop5Data(res.results)
    });
    getCumulativeCases().then((res) => {
      setDates(res.results.map((each) => moment(each.Date).calendar()));
      setNewCaseData(res.results.map((each => each.Total_Cases)));
    });
  }, [])

  return (
    <div>
      <MenuBar />
      <div style={{
        display: 'flex',
        margin: '20px 20px 0 20px',
      }}>
        <div style={{
          width: '33.3%',
        }}>

          <div style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 4 }}>The Travel Control Level of Each Country</div>
          <div style={{
            background: '#e9ecef',
            border: '10px solid white',
            height: '19%',
            // overflow: 'scroll',
            paddingLeft: '5%',
            paddingTop: '2%'
          }}>
            <div style={{ marginLeft: 12}}>0 - No Measures</div>
            <div style={{ marginLeft: 12}}>1 - Screening</div>
            <div style={{ marginLeft: 12}}>2 - Quarantine Arrivals from High-Risk Regions</div>
            <div style={{ marginLeft: 12}}>3 - Ban on High-Risk Regions</div>
            <div style={{ marginLeft: 12}}>4 - Total Border Closure</div>
            <div style={{ marginLeft: 12}}>No Data - Blank</div>
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ fontWeight: 'bold', marginTop: 4 }}>Live Cases by Country</div>
            <div style={{
              height: '40%',
              overflow: 'auto'
            }}>
              <ReactstrapTable striped>
                <tbody>
                  {top5Data.map((country) => (
                    <tr key={country.Country_Name}>
                      <td>{country.Country_Name}</td>
                      <td
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {country.Total_Cases.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ReactstrapTable>
            </div>
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ fontWeight: 'bold' }}>Cumulative Covid Cases</div>
            <div style={{
              height: '40%',
              overflow: 'auto'
            }}>
              <CountryDetailChart dates={dates} seriesData={newCaseData} caseType="Total Cases" />
            </div>
          </div>
        </div>
        <div style={{
          width: '66.6%',
        }}>
          <InternationalMapChart setTooltipContent={setContent} />
          <ReactTooltip>
            <DisplayToolTip {...content} />
          </ReactTooltip>
        </div>
      </div>
    </div >
  )
}

export default InternationalPage;