import React, { useEffect, useState } from 'react'
import {
  useParams
} from "react-router-dom";
import { BackTop } from 'antd';
import moment from 'moment';

import MenuBar from '../components/MenuBar';
import {
  getCountryDetail,
  getCountryStats,
} from '../fetcher'
import CountryDetailChart from '../components/CountryDetailChart';
import { Col, Row, Button } from 'shards-react';

const CountryDetail = () => {
  const { country } = useParams();
  const [countryDetail, setCountryDetail] = useState([]);
  const [dates, setDates] = useState([]);
  const [newCaseData, setNewCaseData] = useState([]);
  const [newDeathCaseDat, setNewDeathCaseData] = useState([]);
  useEffect(() => {
    getCountryDetail(country).then((res) => {
      console.log(res.results, 'res.results')
      setCountryDetail(res.results);
    })

    getCountryStats(country).then((res) => {
      setDates(res.results.map((each) => moment(each.Date).calendar()));
      setNewCaseData(res.results.map((each => each.New_Cases)));
      setNewDeathCaseData(res.results.map((each => each.New_Deaths)));
    })
  }, []);

  return (
    <div >
      <MenuBar />
      <div style={{ paddingLeft: 40, paddingRight: 0, paddingTop:30 }}>
        <Row >
        <Col span= {16}>{countryDetail.length && <h4>COVID Statistics and Travel Restriction in <b>{countryDetail[0].Country_Name}</b></h4>}</Col>
        <Col span= {8} align = 'right'><Button style={{ marginTop: '0vh', marginRight: '3vw', width: '20vw'}} theme="primary" size='sm' outline onClick={()=>window.location =`/international`}>Back to International Statistics</Button></Col>
        </Row>
        {/* <h1>{countryDetail[0].Country_Name}</h1> */}
      </div>
      <div style={{
        display: 'flex',
        margin: '0 30px'
      }}>
        <div style={{ width: '50%' }}>
          <CountryDetailChart dates={dates} seriesData={newCaseData} caseType="New Cases" />
        </div>
        <div style={{ width: '50%' }}>
          <CountryDetailChart dates={dates} seriesData={newDeathCaseDat} caseType="New Death Cases" />
        </div>
      </div>

      {
        countryDetail.length && <div style={{ margin: 30 }}>
          {
            [1, 2, 3].map((index) =>
              <div
                style={{ padding: 20, margin: 6, border: '2px solid black' }}
                dangerouslySetInnerHTML={{ __html: countryDetail[0][`Details${index}`] }} />
            )
          }
          
        </div>
      }
      
      <BackTop/>
    </div>
  )
}
export default CountryDetail;