// author: paopaoycf (Chenfei Yu)
import React from 'react';
import { Form, FormInput, FormSelect, FormGroup, Card, CardBody } from "shards-react";
import { BarsOutlined, SearchOutlined} from '@ant-design/icons';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import {
    Table,
    Row,
    Col,
    Divider,
    Space,
    Button,
    Tabs,
    BackTop,
} from 'antd'
// import { format } from 'd3-format';
import './index.css';

import MenuBar from '../components/MenuBar';
import { getFacilitiesSearch, getFacility, getFacilityAllStates, getFacilityCounties } from '../fetcher'
// const wideFormat = format('.3r');

const { TabPane } = Tabs;

class FindCareFacilitiesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            initialLoading: true,
            stateQuery: '',
            countyQuery: '',
            keywordQuery: '',
            latLowQuery: 17,
            latHighQuery: 65,
            lonLowQuery: -159,
            lonHighQuery: -65,
            stateList: [],
            countyList: [],
            facilitiesResults: [],
            selectedFacilityId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedFacilityDetails: [],
            nearbyFacilityDetails: [],
            nearbyFacilityDetail1: [],
            nearbyFacilityDetail2: [],
            nearbyFacilityDetail3: [],
            nearbyFacilityDetail4: [],
            nearbyFacilityDetail5: [],
            nearbyFacilityDetail6: [],
            nearbyFacilityDetail7: [],
            nearbyFacilityDetail8: [],
            activeMarker: {},
            showInfoWindow: false
        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleStateQueryChange = this.handleStateQueryChange.bind(this)
        this.handleCountyQueryChange = this.handleCountyQueryChange.bind(this)
        this.handleStateListChange = this.handleStateListChange.bind(this)
        this.handleCountyListChange = this.handleCountyListChange.bind(this)
        this.handleKeywordQueryChange = this.handleKeywordQueryChange.bind(this)
        this.handleLatQueryChange = this.handleLatQueryChange.bind(this)
        this.handleLonQueryChange = this.handleLonQueryChange.bind(this)
        this.handleFacilitySelect = this.handleFacilitySelect.bind(this)
    }


    // handleStateQueryChange(event){
    //     this.setState({ stateQuery: event.target.value})
    //     this.setState({ keywordQuery: ''})
    // }

    handleStateQueryChange(event){
        this.setState({ stateQuery: event.target.value, countyList:[], countyQuery: '', keywordQuery: ''})
        console.log("state:", this.state.stateQuery)

    }

    handleStateListChange(){
        getFacilityAllStates().then(res => {
            this.setState({ stateList: res.results })
        })
    }

    handleCountyListChange(){
        getFacilityCounties(this.state.stateQuery).then(res => {
            this.setState({ countyList: res.results })
            console.log("countyList:", this.state.countyList)
        })
    }

    handleCountyQueryChange(event){
        this.setState({ countyQuery: event.target.value})
        this.setState({ keywordQuery: ''})
        console.log("county changed:", this.state.countyQuery)
    }

    handleKeywordQueryChange(event){
        this.setState({ keywordQuery: event.target.value}) 
        this.setState({ stateQuery: ''})
        this.setState({ countyQuery: ''}) 
    }

    handleLatQueryChange(value) {
        this.setState({ latLowQuery: value[0] })
        this.setState({ latHighQuery: value[1] })
    }

    handleLonQueryChange(value) {
        this.setState({ lonLowQuery: value[0] })
        this.setState({ lonHighQuery: value[1] })
    }

    handleFacilitySelect(value){
        this.setState({ initialLoading: false})
        getFacility(value).then(res => {
            this.setState({ selectedFacilityDetails: res.results[0] })    
            this.setState({ nearbyFacilityDetails: res.results})
            this.setState({ nearbyFacilityDetail1: res.results[1]})
            this.setState({ nearbyFacilityDetail2: res.results[2]})
            this.setState({ nearbyFacilityDetail3: res.results[3]})
            this.setState({ nearbyFacilityDetail4: res.results[4]})
            this.setState({ nearbyFacilityDetail5: res.results[5]})
            this.setState({ nearbyFacilityDetail6: res.results[6]})
            this.setState({ nearbyFacilityDetail7: res.results[7]})
            this.setState({ nearbyFacilityDetail8: res.results[8]})
            this.setState({selectedFacilityId: value})
        })
    }

    updateSearchResults() {
        getFacilitiesSearch(this.state.stateQuery, this.state.countyQuery, this.state.keywordQuery, this.state.latLowQuery, this.state.latHighQuery, this.state.lonLowQuery, this.state.latHighQuery, null, null).then(res => {
            this.setState({ facilitiesResults: res.results,  selectedFacilityId: 0, selectedFacilityDetails: [] })
            this.setState({ initialLoading: false})
        //     if(res.results && res.results.length > 0){
        //         this.setState({ selectedFacilityId: res.results[0]["id"]})
        //         this.setState({ selectedFacilityDetails: res.results[0]})
        //         console.log("select:", this.state.selectedFacilityId)
        // }   
        }) 
    }

    onMarkerClick = (props, marker) =>{
    this.setState({activeMarker: marker, showInfoWindow: true })};

    onInfoWindowClose = () =>
        this.setState({ activeMarker: null, showInfoWindow: false });

    onMapClicked = () => {
        if (this.state.showInfoWindow){
            this.setState({ activeMarker: null, showingInfoWindow: false });
        }
  };


    componentDidMount() {

        getFacilitiesSearch(this.state.stateQuery, this.state.countyQuery, this.state.keywordQuery, this.state.latLowQuery, this.state.latHighQuery, this.state.lonLowQuery, this.state.latHighQuery, null, null).then(res => {
            this.setState({ facilitiesResults: res.results })
            this.setState({ selectedFacilityId: res.results[0]["id"]})
            this.setState({ initialLoading: true})
        }) 

        getFacility(this.state.selectedFacilityId).then(res => {
            this.setState({ selectedFacilityDetails: res.results[0] })
            this.setState({ nearbyFacilityDetails: res.results})
            this.setState({ initialLoading: true})
        })


        

    }

    render() {

        const zoom_setting = 13

        const facilityColumns = [
            {
                title:"View",
                key:"action",
                render:(text, row) => (
                <Space size="small">
                <Button type="dashed" size="small" icon={<BarsOutlined/>} onClick={()=>this.handleFacilitySelect(row.id)}></Button>
                </Space>
                )
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'City',
                dataIndex: 'city',
                key: 'city',
                sorter: (a, b) => a.city.localeCompare(b.city)
            },
            {
                title: 'County',
                dataIndex: 'county',
                key: 'county',
                sorter: (a, b) => a.county.localeCompare(b.county)
            },
            {
                title: 'Zip',
                dataIndex: 'zip',
                key: 'zip',
                sorter: (a, b) => a.zip - b.zip
        
            },
            {
                title: 'State',
                dataIndex: 'state',
                key: 'state',
                sorter: (a, b) => a.state.localeCompare(b.state)
            }
        ];
        return (
            <div>
                <MenuBar />
 
                {/* For Project*/}

                <Form style={{ width: '60vw', margin: '0 auto', marginTop: '5vh' }}>
                <Tabs defaultActiveKey="1" type="card" size='large'>
                <TabPane tab="Search By County" key="1">
                    <Row>
                    <Col flex={2} span={4}><FormGroup style={{ width: '10vw', margin: '0 auto' }}>
                            <label>State</label>
                            {/* <FormInput placeholder="State" value={this.state.stateQuery} onChange={this.handleStateQueryChange} /> */}
                            
                            <FormSelect style={{ width: '10vw', size: 'large'}} onMouseEnter={this.handleStateListChange} onClick={this.handleStateQueryChange}>
                            {this.state.stateList? this.state.stateList.map((row, i) =>( <option value={row.state}>{row.state}</option>)):null}
                        </FormSelect>
                        
                        </FormGroup></Col>
                    <Col flex={2} span={14}><FormGroup style={{ width: '20vw', margin: '0 auto', marginLeft:'3vw' }}>
                            <label>County</label>
                            {/* <FormInput placeholder="County" value={this.state.countyQuery} onChange={this.handleCountyQueryChange} /> */}
                            
                            <FormSelect style={{ width: '24vw', size: 'large'}} onMouseEnter={this.handleCountyListChange}  onClick={this.handleCountyQueryChange}>
                            {this.state.countyList? this.state.countyList.map((row, i) =>( <option value={row.county}>{row.county}</option>)):null}
                        </FormSelect>
                        
                        </FormGroup></Col>
                    <Col flex={2} span={6}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '3vh' }} type="primary" icon={<SearchOutlined />} size="large" onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>  
                    </Row>
                </TabPane>
                <TabPane tab="Searcy By Keyword" key="2">
                    <Row>
                    <Col flex={2} span={18}><FormGroup style={{ width: '30vw', margin: '0 auto' }}>
                            <label>Keyword</label>
                            <FormInput placeholder="Keyword" value={this.state.keywordQuery} onChange={this.handleKeywordQueryChange} />
                        </FormGroup></Col>   
                    <Col flex={2} span={6}><FormGroup style={{ width: '10vw' }}>
                        <Button style={{ marginTop: '4vh' }} type="primary" icon={<SearchOutlined />} size="large" onClick={this.updateSearchResults}>Search</Button>
                    </FormGroup></Col>                     
                    </Row>
                </TabPane>
                </Tabs>                    
                </Form>

                
                <div style={{ width: '60vw', margin: '0 auto', marginTop: '2vh' }}>
                <Divider style = {{marginTop: '0vh'}}/>
                <Table
                dataSource={this.state.facilitiesResults} columns={facilityColumns} 
                pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}
                />
                
                <Divider orientation='center' style={{marginTop: '1vh', marginBottom: '-2vh', width: '60vw'}}><Row style={{marginTop: '1vh', marginBottom: '0vh'}}><h4>View Facility Detailed Information</h4></Row></Divider>
                {((!this.state.initialLoading) && this.state.selectedFacilityId && this.state.selectedFacilityDetails) ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                <Card style={{marginTop: '1vh', height: '42vh', width: '60vw'}} >
                        <CardBody>
                            <Row align='left' justify='center'>
                            <Col flex={2} span={12} style={{ textAlign: 'left' }}>
                                <Row gutter='10'><Col flex={2} style={{ textAlign: 'left' }}><h4>{this.state.selectedFacilityDetails.name}</h4></Col></Row>
                                <Row gutter='10'><Col flex={2} span={4} style={{ textAlign: 'left' }}><h6>Address: </h6></Col><Col flex={1} style={{ textAlign:'left'}}>{this.state.selectedFacilityDetails.address}, {this.state.selectedFacilityDetails.state} {this.state.selectedFacilityDetails.zip}</Col></Row>
                                <Row><Col flex={2} style={{ textAlign: 'left' }}><b>Directions:&nbsp; </b>{this.state.selectedFacilityDetails.directions}</Col></Row>
                                <Divider/>
                                <Row gutter='10'><Col flex={2} span={4} style={{ textAlign: 'left' }}><h6>Tel: </h6></Col><Col flex={1} style={{ textAlign:'left'}}>{this.state.selectedFacilityDetails.telephone}</Col></Row>
                                <Row gutter='10'><Col flex={2} span={6} style={{ textAlign: 'left' }}><h6>Contact How: </h6></Col><Col flex={1} style={{ textAlign:'left'}}>PHONE</Col></Row>                        
                                <Row gutter='10'><Col flex={2} style={{ textAlign: 'left' }}>URGENT MEDICAL CARE CENTERS AND CLINICS (EXCEPT HOSPITALS), FREESTANDING</Col></Row>                        
                            </Col >
                                <Col  push={0.5} span={12} flex={2} style={{ textAlign: 'right' }}>
                                <Map google = {this.props.google} style = {{width: '29vw', height: '36vh', textAlign: 'left'}} zoom = {zoom_setting} onClick={this.onMapClicked}
                                        center={{lat:this.state.selectedFacilityDetails.lat, lng:this.state.selectedFacilityDetails.lon}}>
                                            <Marker position = {{lat:this.state.selectedFacilityDetails.lat, lng:this.state.selectedFacilityDetails.lon}} 
                                                onClick={this.onMarkerClick} />                                        
                                            <InfoWindow
                                                marker={this.state.activeMarker}
                                                onClose={this.onInfoWindowClose} 
                                                visible={this.state.showInfoWindow}>
                                                <div>{this.state.selectedFacilityDetails.address}, {this.state.selectedFacilityDetails.city}, {this.state.selectedFacilityDetails.state} {this.state.selectedFacilityDetails.zip}</div>
                                                
                                            </InfoWindow>                                          
                                </Map> 
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {this.state.nearbyFacilityDetails ?<div style={{ width: '60vw', margin: '0 auto', marginTop: '2vh', marginLeft: '0vw' }}>
                    <Divider orientation='center' style={{marginTop: '3vh', marginBottom: '0vh'}}><Row style={{marginTop: '1vh', marginBottom: '0vh'}}><h4>Nearby Urgent Care Facilities</h4></Row></Divider>
                    
                    <div className="site-card-wrapper">
                        <Row gutter={16}>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail1.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail1.address}+${this.state.nearbyFacilityDetail1.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail1.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail1.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail1.address}, {this.state.nearbyFacilityDetail1.city}, {this.state.nearbyFacilityDetail1.state} {this.state.nearbyFacilityDetail1.zip}</i></Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail2.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail2.address}+${this.state.nearbyFacilityDetail2.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail2.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail2.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail2.address}, {this.state.nearbyFacilityDetail2.city}, {this.state.nearbyFacilityDetail2.state} {this.state.nearbyFacilityDetail2.zip}</i></Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail3.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail3.address}+${this.state.nearbyFacilityDetail3.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail3.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail3.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail3.address}, {this.state.nearbyFacilityDetail3.city}, {this.state.nearbyFacilityDetail3.state} {this.state.nearbyFacilityDetail3.zip}</i></Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail4.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail4.address}+${this.state.nearbyFacilityDetail4.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail4.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail4.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail4.address}, {this.state.nearbyFacilityDetail4.city}, {this.state.nearbyFacilityDetail4.state} {this.state.nearbyFacilityDetail4.zip}</i></Row>
                            </Card>
                        </Col>
                        </Row>
                        <Row gutter={16}>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail5.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail5.address}+${this.state.nearbyFacilityDetail5.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail5.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail5.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail5.address}, {this.state.nearbyFacilityDetail5.city}, {this.state.nearbyFacilityDetail5.state} {this.state.nearbyFacilityDetail5.zip}</i></Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail6.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail6.address}+${this.state.nearbyFacilityDetail6.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail6.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail6.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail6.address}, {this.state.nearbyFacilityDetail6.city}, {this.state.nearbyFacilityDetail6.state} {this.state.nearbyFacilityDetail6.zip}</i></Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail7.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail7.address}+${this.state.nearbyFacilityDetail7.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail7.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail7.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail7.address}, {this.state.nearbyFacilityDetail7.city}, {this.state.nearbyFacilityDetail7.state} {this.state.nearbyFacilityDetail7.zip}</i></Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                        <Card bordered={false} hoverable={true} style={{padding: 10, marginTop: '2vh', height: '20vh'}} >
                            <Row gutter={6} justify='center'>
                                <Col span={8} align = 'center'><Button type="primary" 
                                onClick={()=>this.handleFacilitySelect(this.state.nearbyFacilityDetail8.id)}>View</Button></Col>
                                <Col span={6} align = 'center'><Button
                                onClick={()=>window.open(`https://google.com/maps/search/${this.state.nearbyFacilityDetail8.address}+${this.state.nearbyFacilityDetail8.zip}`,"_blank")}>Go</Button></Col>
                                <Col span={10} align = 'center'><h6><u>{this.state.nearbyFacilityDetail8.miles} mi</u></h6></Col>
                            </Row>
                            <Row><b>{this.state.nearbyFacilityDetail8.name}</b></Row>
                            <Row><i>{this.state.nearbyFacilityDetail8.address}, {this.state.nearbyFacilityDetail8.city}, {this.state.nearbyFacilityDetail8.state} {this.state.nearbyFacilityDetail8.zip}</i></Row>
                            </Card>
                        </Col>
                        </Row>
                    </div>
                    <Divider/>


                    </div> : null}             
                </div> : <Row style = {{marginTop: '2vh'}}><label>Please click the icon button to select an urgent care facility</label></Row>}
                </div> 
                <BackTop/>
            </div>

        )
    }
}


export default GoogleApiWrapper({apiKey:"AIzaSyAaW7cVSC2nL1kP7mjxAetGqlugZrUEkIw"})(FindCareFacilitiesPage)
