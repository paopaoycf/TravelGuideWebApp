
import React, { useEffect, useState } from 'react';
import MenuBar from '../components/MenuBar';
import DatePicker from 'react-datepicker';
import MapChart from "../components/MapChart";
import ReactTooltip from "react-tooltip";
import 'antd/dist/antd.css';
import { Table, BackTop, Divider, Row } from 'antd';
import { getAllStates } from '../fetcher'
const convert = require('us-state-converter');

const stateColumns = [
  {
    title: 'State',
    dataIndex: 'State',
    key: 'State',
    sorter: (a, b) => a.State.localeCompare(b.State),
    render: text => <a style={{color:"#1890ff"}}>{text}</a>
  },
  {
    title: 'Total_Case',
    dataIndex: 'Total_Case',
    key: 'Total_Case',
    sorter: (a, b) => a.Total_Case - b.Total_Case
  },
  {
    title: 'New_Case',
    dataIndex: 'New_Case',
    key: 'New_Case',
    sorter: (a, b) => a.New_Case - b.New_Case
  },
  {
    title: 'Total_Death',
    dataIndex: 'Total_Death',
    key: 'Total_Death',
    sorter: (a, b) => a.Total_Case - b.Total_Case
  },
  {
    title: 'New_Death',
    dataIndex: 'New_Death',
    key: 'New_Death',
    sorter: (a, b) => a.New_Case - b.New_Case
  },
  {
    title: 'Dose1',
    dataIndex: 'Dose1',
    key: 'Dose1',
    sorter: (a, b) => a.Dose1 - b.Dose1
  },
  {
    title: 'Dose2',
    dataIndex: 'Dose2',
    key: 'Dose2',
    sorter: (a, b) => a.Dose2 - b.Dose2
  },
  {
    title: 'Booster',
    dataIndex: 'Booster',
    key: 'Booster',
    sorter: (a, b) => a.Booster - b.Booster
  },
  {
    title: 'Safe_Counties',
    dataIndex: 'Safe_Counties',
    key: 'Safe_Counties',
    sorter: (a, b) => a.Safe_Counties - b.Safe_Counties
  },
  {
    title: 'Mask_Required',
    dataIndex: 'Face_Mask_Required',
    key: 'Face_Mask_Required'
  },
  {
    title: 'Citation',
    dataIndex: 'Citation',
    key: 'Citation'
  }
];

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else if (num > 1000){
    return Math.round(num / 100) / 10 + "K";
  } else {
    return num;
  }
};

const DisplayToolTip = ({ State, New_Case, New_Death, Safe_Counties, Face_Mask_Required }) => {
  return (
    <div>
      <p>{State===undefined?'no data here':convert.fullName(State)}</p>
      <p>{New_Case===undefined?'':`New Case: `+rounded(New_Case)}</p>
      <p>{New_Death===undefined?'':`New Death: `+rounded(New_Death)}</p>
      <p>{Safe_Counties===undefined?'':`Safe Counties: `+Safe_Counties}</p>
    </div>
  )
}

function DomesticPage() {
    const [allStatesResults, setAllStatesResults] = useState([]);
    const [date, setDate] = useState(new Date(2022, 3, 26));
    const [content, setContent] = useState("");

    const goToState = (state) => {
      window.location = `/state?date=${date.toISOString().split('T')[0]}&state=${state}&fullname=${convert.fullName(state)}`
    };

    const dateOnChange = (date) => {
      // On clicking to change the date, this callback will quest for stats of all states.
      setDate(date);
      getAllStates(date.toISOString().split('T')[0]).then(res => {
        setAllStatesResults(res.results)
        // console.log(res.results) // DB
      })
    };

    useEffect(() => {
      console.log("CHECK 1");
      getAllStates(date.toISOString().split('T')[0]).then(res => {
        setAllStatesResults(res.results);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div>
        <MenuBar />

        <div style={{ width: '80vw', margin: '0 auto', marginLeft:'20vw', marginTop: '4vh' }}>
          <label><b>Choose Date Here &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></label>
          <DatePicker selected={date} onChange={dateOnChange} />
        </div>

        <div style={{ width: '60vw', margin: '0 auto', marginTop: '-6vh' }}>
          <MapChart allStatesResults={allStatesResults} setTooltipContent={setContent} date={date}/>
          <ReactTooltip>
            <DisplayToolTip {...content} />
          </ReactTooltip>
        </div>

        <div style={{ width: '90vw', margin: '0 auto', marginTop: '-5vh' }}>
        <Divider orientation='center' style={{marginTop: '0vh', marginBottom: '0vh'}}><Row style={{marginTop: '3vh', marginBottom: '2vh'}}><h4>Covid Stats By States</h4></Row></Divider>
          <Table onRow={(record, rowIndex) => {
            return {
              onClick: event => {goToState(record.State)} // clicking a row takes the user to a detailed view of the state page
            };
          }} dataSource={allStatesResults} columns={stateColumns} />
        </div>
        <BackTop/>
      </div>
    );
}

export default DomesticPage
