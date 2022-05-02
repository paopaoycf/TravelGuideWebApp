
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button } from "shards-react";
import 'antd/dist/antd.css';
import { Table, Select, Row, Col, Divider, Tag } from 'antd';
// import { format } from 'd3-format';

import MenuBar from '../components/MenuBar';
import { getState } from '../fetcher'
// const wideFormat = format('.3r');
const { Option } = Select;
const convert = require('us-state-converter');

const countyColumns = [
    {
        title: 'County',
        dataIndex: 'County',
        key: 'County',
        sorter: (a, b) => a.County.localeCompare(b.County)
    },
    {
        title: 'Cases_Per_100k',
        dataIndex: 'Cases_Per_100k',
        key: 'Cases_Per_100k',
        sorter: (a, b) => a.Cases_Per_100k - b.Cases_Per_100k
    },
    {
        title: 'Positiveness_Percent',
        dataIndex: 'Positiveness_Percent',
        key: 'Positiveness_Percent',
        sorter: (a, b) => a.Positiveness_Percent - b.Positiveness_Percent
    },
    {
      title: 'Community_Transmission_Level',
      dataIndex: 'Community_Trans_Level',
      key: 'Community_Trans_Level',
      render: level => {
            let color = 'white';
            if (level === 'high') {
              color = 'red';
            }else if (level === 'substantial'){
                color = 'yellow';
            }else if (level === 'moderate'){
                color = 'green';
            }else{
                color = 'blue';
            }
            return (
              <Tag color={color} key={level}>
                {level?level.toUpperCase():""}
              </Tag>
            );
      }
    },
    {
      title: 'Population (Census 2019)',
      dataIndex: 'Population',
      key: 'Population',
      sorter: (a, b) => a.Population - b.Population
      
    }
];

function StatePage() {
    const params = window.location.search.substring(1).split('&');
    let d = new Date(params[0].split('=')[1]);
    d.setDate(d.getDate() + 1);
    const[date, setDate] = useState(d);
    const[state, setState] = useState(params[1].split('=')[1]);
    const[fullname, setFullname] = useState(params[2].split('=')[1].replace('%20',' '));
    const[showstate, setShowstate] = useState(params[2].split('=')[1].replace('%20',' '));
    const[countyresults, setCountyresults] = useState([]);
    
    const handleDateChange = (date)=> {
        setDate(date);
    };

    const handleStateChange = (value)=> {
        setState(value);
        setFullname(convert.fullName(value));
    };

    const updateSearchResults = () => {
        setShowstate(fullname);
        getState(date.toISOString().split('T')[0], state, fullname).then(res => {
            setCountyresults(res.results)
        })
    };

    useEffect(() => {
        console.log("CHECK 2"); // DB
        getState(date.toISOString().split('T')[0], state, fullname).then(res => {
            setCountyresults(res.results);
            console.log(res.results); // DB
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (

        <div>

            <MenuBar />
            <Form style={{ width: '70vw', height: '60vh', margin: '0 auto', marginTop: '5vh' }}>
                <Row style={{ width: '80vw', margin: '0 auto', marginTop: '5vh', marginLeft:'0vw' }}>
                    <Col flex={2} span={8}>
                        <Row>
                        <Col style={{marginLeft:'2vw'}}><label>Choose Date Here</label></Col>
                        <Col style={{marginLeft:'1vw'}}><DatePicker selected={date} onChange={handleDateChange} /></Col>
                        </Row>
                   </Col>
                    <Col span={8} flex={2}>
                        <Row>
                        <Col span = {3} style={{marginLeft:'2vw'}}><label>State</label></Col>
                        <Col span = {5} style={{marginLeft:'0vw'}}>
                        <Select style={{ width: 120 }} onChange={handleStateChange}>
                            <Option value="AL">Alabama</Option>
                            <Option value="AK">Alaska</Option>
                            <Option value="AZ">Arizona</Option>
                            <Option value="AR">Arkansas</Option>
                            <Option value="CA">California</Option>
                            <Option value="CO">Colorado</Option>
                            <Option value="CT">Connecticut</Option>
                            <Option value="DE">Delaware</Option>
                            <Option value="FL">Florida</Option>
                            <Option value="GA">Georgia</Option>
                            <Option value="HI">Hawaii</Option>
                            <Option value="ID">Idaho</Option>
                            <Option value="IL">Illinois</Option>
                            <Option value="IN">Indiana</Option>
                            <Option value="IA">Iowa</Option>
                            <Option value="KS">Kansas</Option>
                            <Option value="KY">Kentucky</Option>
                            <Option value="LA">Louisiana</Option>
                            <Option value="ME">Maine</Option>
                            <Option value="MD">Maryland</Option>
                            <Option value="MA">Massachusetts</Option>
                            <Option value="MI">Michigan</Option>
                            <Option value="MN">Minnesota</Option>
                            <Option value="MS">Misssissippi</Option>
                            <Option value="MO">Missouri</Option>
                            <Option value="MT">Montana</Option>
                            <Option value="NE">Nebraska</Option>
                            <Option value="NV">Nevada</Option>
                            <Option value="NH">New Hampshire</Option>
                            <Option value="NJ">New Jersey</Option>
                            <Option value="NM">New Mexico</Option>
                            <Option value="NY">New York</Option>
                            <Option value="NC">North Carolina</Option>
                            <Option value="ND">North Dakota</Option>
                            <Option value="OH">Ohio</Option>
                            <Option value="OK">Oklahoma</Option>
                            <Option value="OR">Oregon</Option>
                            <Option value="PA">Pennsylvania</Option>
                            <Option value="PR">Puerto Rico</Option>
                            <Option value="RI">Rhode Island</Option>
                            <Option value="SC">South Carolina</Option>
                            <Option value="SD">South Dakota</Option>
                            <Option value="TN">Tennessee</Option>
                            <Option value="TX">Texas</Option>
                            <Option value="UT">Utah</Option>
                            <Option value="VT">Vermont</Option>
                            <Option value="VA">Virginia</Option>
                            <Option value="WA">Washington</Option>
                            <Option value="WV">West Virginia</Option>
                            <Option value="WI">Wisconsin</Option>
                            <Option value="WY">Wyoming</Option>
                        </Select>
                        
                        </Col>
                        </Row>
                    </Col>
                    <Col flex={2} span={4}>
                        <Row>
                        <Button style={{ marginTop: '0vh' }} onClick={updateSearchResults}>Search</Button>
                        </Row>
                    </Col>
                </Row>
            
            <Divider style={{ width: '70vw', margin: '0 auto', marginTop: '2vh', marginBottom: '4vh' }}/>
            {/* Demonstrate COVID risk level statistics by county within the given state. */}
            {/* <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}> */}
                <h4>Covid Risk Level Distribution in {showstate}</h4>
                <Table dataSource={countyresults} columns={countyColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 10, showQuickJumper:true }}/>
            {/* </div> */}
            <Divider />
            </Form>


        </div>
    );
    
}

export default StatePage
