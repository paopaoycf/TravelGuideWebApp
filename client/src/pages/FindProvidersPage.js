// author: paopaoycf (Chenfei Yu)
import React from 'react';
import { Form, FormInput} from "shards-react";
import { SearchOutlined, CarTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import VirtualList from 'rc-virtual-list';
import {
    Row,
    Col,
    Divider,
    Radio,
    Space,
    Button,
    Alert,
    List,
    Avatar,
    Collapse,
    Tag,
    Switch
} from 'antd'

// import { format } from 'd3-format';
import './index.css';


import MenuBar from '../components/MenuBar';
import { getProviderDetail, getProvidersSearch } from '../fetcher'

const { Panel } = Collapse;


class FindProvidersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            zipQuery: '',
            medicineQuery: 0,
            instockQuery: '',
            mapCenter: [39.8283, -98.5795],
            mapZoom: 4,
            selectedProviderId: window.location.search ? window.location.search.substring(1).split('=')[1] : '',
            // '9fe36871'
            selectedProviderDetails: null,
            providersResults: [],
            activeMarker: {},
            showInfoWindow: true,
            validZip: true,
            existZip: true,
            validMedicine: true,
            initialSearch: true,
            selectedMarkerInfo: {}
        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleZipQueryChange = this.handleZipQueryChange.bind(this)
        this.handleMedicineQueryChange = this.handleMedicineQueryChange.bind(this)
        this.handleInstockQueryChange = this.handleInstockQueryChange.bind(this)
        this.handleProviderSelect = this.handleProviderSelect.bind(this)
        this.handleClearSearch = this.handleClearSearch.bind(this)
        this.updateSearchByAppointment = this.updateSearchByAppointment.bind(this)

    }


    handleZipQueryChange(event) {
        this.setState({ zipQuery: event.target.value })
        this.setState({ instockQuery: ''})
        if(isNaN(event.target.value) || event.target.value > 99999 || event.target.value <= 0){
            this.setState({validZip: false, existZip: true})
        }else{
            this.setState({validZip: true, existZip: true})
        }
    }

    handleMedicineQueryChange(event) {
        this.setState({ medicineQuery: event.target.value})
        this.setState({ instockQuery: ''})
        this.setState({validMedicine: true})
    }

    handleInstockQueryChange(check) {
        if(!check){         
            this.setState({ instockQuery: '' });
            // this.updateSearchResults();
        }else{
            this.setState({ instockQuery: 'TRUE' });
            // this.updateSearchResults();
        }
        console.log(`switch to ${this.state.instockQuery}, ${check}`);
    }

    updateSearchByAppointment(check){
        if(check){
            getProvidersSearch(this.state.zipQuery, this.state.medicineQuery, 'TRUE').then(res=>{
                this.setState({instockQuery: 'TRUE'})
                var arr_temp = res.results
                          
                if(arr_temp.length > 0){
                    var arr = []
                    for (var i = 0; i < arr_temp.length; i++){
                        if(arr_temp[i]["in_stock"] === 'TRUE')
                        arr.push(res.results[i])
                    }
                    
                    i= 1
                    arr.forEach(v => v.idx = i++)
                    this.setState({ providersResults: arr})
                    this.setState({mapCenter: [arr[0].lat_c, arr[0].lon_c ]})
                    this.setState({selectedMarkerInfo: {}, activeMarker: null, showInfoWindow: false})
                    var max_distance = arr[arr.length-1].miles
                    if(max_distance <= 6){
                        this.setState({mapZoom: 13})
                    }else if(max_distance <= 10){
                        this.setState({mapZoom: 12})
                    }else if(max_distance <= 20){
                        this.setState({mapZoom: 11})
                    }else if (max_distance <= 60){
                        this.setState({mapZoom: 10})
                    }else if (max_distance <= 70){
                        this.setState({mapZoom: 9})
                    }else{
                        this.setState({mapZoom: 8})
                    }
                }
            })
        }else{
            getProvidersSearch(this.state.zipQuery, this.state.medicineQuery, '').then(res=>{
                this.setState({instockQuery: ''})
                var arr = res.results
                if(arr.length > 0){
                    var i= 1
                    arr.forEach(v => v.idx = i++)
                    this.setState({ providersResults: arr})
                    this.setState({mapCenter: [arr[0].lat_c, arr[0].lon_c ]})
                    this.setState({selectedMarkerInfo: {}, activeMarker: null, showInfoWindow: false})
                    var max_distance = arr[arr.length-1].miles
                    if(max_distance <= 6){
                        this.setState({mapZoom: 13})
                    }else if(max_distance <= 10){
                        this.setState({mapZoom: 12})
                    }else if(max_distance <= 20){
                        this.setState({mapZoom: 11})
                    }else if (max_distance <= 60){
                        this.setState({mapZoom: 10})
                    }else if (max_distance <= 70){
                        this.setState({mapZoom: 9})
                    }else{
                        this.setState({mapZoom: 8})
                    }
                }  
            })  
        }
    }

    handleProviderSelect(value){
        this.setState({selectedProviderId: value})
        getProviderDetail(value).then(res => {
            this.setState({ selectedProviderDetails: res.results })
            console.log("provider updated")
        })
    }

    handleClearSearch(){
        this.setState({ 
            zipQuery: '', medicineQuery: 0, instockQuery: '', mapCenter: [39.8283, -98.5795], mapZoom: 4, 
            providersResults: [], selectedMarkerInfo: {}, activeMarker: null, showInfoWindow: false
            // activeMarker: {},
            // showInfoWindow: true,
            // validZip: true,
            // validMedicine: true,
            // initialSearch: true,
            // selectedMarkerInfo: {}
        })
        console.log("updated")
    }

    updateSearchResults() {
        if(this.state.medicineQuery === 0){
            console.log("set F")
            this.setState({validMedicine: false})
        }else{
            console.log("set T")
            this.setState({validMedicine: true})
        }

        getProvidersSearch(this.state.zipQuery, this.state.medicineQuery, this.state.instockQuery).then(res=>{
            var arr = res.results
            if(arr.length > 0){
                var i= 1
                arr.forEach(v => v.idx = i++)
                this.setState({ providersResults: arr})
                this.setState({mapCenter: [arr[0].lat_c, arr[0].lon_c ]})
                var max_distance = arr[arr.length-1].miles
                if(max_distance <= 6){
                    this.setState({mapZoom: 13})
                }else if(max_distance <= 10){
                    this.setState({mapZoom: 12})
                }else if(max_distance <= 20){
                    this.setState({mapZoom: 11})
                }else if (max_distance <= 60){
                    this.setState({mapZoom: 10})
                }else if (max_distance <= 70){
                    this.setState({mapZoom: 9})
                }else{
                    this.setState({mapZoom: 8})
                }
                // var median_distance = arr[Math.trunc(arr.length / 2)].miles
                // this.setState({mapZoom: 13 - Math.min(Math.trunc(max_distance/10), 2 + Math.trunc(median_distance/10))})
                console.log("zoom:", this.state.mapZoom, "length:", arr.length)
            }else{
                this.setState({ providersResults: arr})
                if(this.state.validMedicine){
                    this.setState({validZip: true, existZip: false})
                }else(
                    this.setState({validZip: true, existZip: true})
                )        
            }

        })
    
        // console.log("zip:", this.state.validZip, "medi:", this.state.validMedicine, this.state.medicineQuery)
    }


    onMarkerClick = (props, marker, event) =>{
        this.handleProviderSelect(props.guid);
        console.log("clicked", this.state.selectedProviderDetails, this.state.selectedProviderId, props)
        this.setState({selectedMarkerInfo: props, activeMarker: marker, showInfoWindow: true}) 
    };

    onInfoWindowClose = () =>
        this.setState({ activeMarker: null, showInfoWindow: false });


    componentDidMount() {
        getProvidersSearch(this.state.zipQuery, this.state.medicineQuery, this.state.instockQuery).then(res=>{
            var arr = res.results
            var i= 1
            arr.forEach(v => v.idx = i++)
            this.setState({ providersResults: arr })
        })
    
        getProviderDetail(this.state.selectedProviderId).then(res => {
            this.setState({ selectedProviderDetails: res.results })
        })

    }

    render() {

        return (

            <div>
                <MenuBar />
 
                {/* For Project*/}
                <Form style={{ width: '90vw', height: '100vh', margin: '0 auto', marginTop: '0vh' }}>
                <Row align='left' sytle={{height: '100vh'}}>
                {this.state.providersResults.length===0?
                <Col span={10} >      
                    <Row >
                        <Form  style={{ width: '30vw', height: '17vh', margin: '0 auto', marginTop: '4vh' }}>
                        <label><b>5-digit Zip Code</b></label>
                        <FormInput style={{ width: '20vw'}} placeholder="Zip" value={this.state.zipQuery} onChange={this.handleZipQueryChange} />
                        {(this.state.validZip && this.state.existZip)? <Alert message="Please fill in a 5-digit number" type="info" showIcon closable style={{ width: '20vw', height: '4vh', marginTop: '1vh' }}/> : null}
                        {(!this.state.existZip)? <Alert message="Zip code not found" type="error" showIcon style={{ width: '20vw', height: '4vh', marginTop: '1vh' }}/> : null}
                        {(!this.state.validZip)? <Alert message="Invalid zip code" type="error" showIcon style={{ width: '20vw', height: '4vh', marginTop: '1vh' }}/> : null}
                        </Form>
                    </Row>
                    <Row>                   
                        <Form  style={{ width: '30vw', height: '12vh', margin: '0 auto', marginTop: '0vh' }}>
                        <Row><label><b>Choose a COVID-19 Vaccine</b></label></Row>
                        <Radio.Group onChange={this.handleMedicineQueryChange} value={this.state.medicineQuery}>
                            <Space direction="horizontal">
                            <Radio value={"59267"}>Pfizer-BioNTech</Radio>
                            <Radio value={"80777"}>Moderna</Radio>
                            <Radio value={"59676"}>Johnson/Janssen</Radio></Space>
                        </Radio.Group>
                        {!this.state.validMedicine? <Alert message="You must select a COVID-19 Vaccine name" type="error" showIcon style={{ width: '20vw', height: '4vh', marginTop: '1vh' }}/> : null}
                        </Form>                   
                    </Row>
                        <Form  style={{ width: '40vw', height: '4vh', margin: '0 auto', marginTop: '3vh' }}>
                            <Row align='left'> 
                            <Col style={{ marginLeft: '8vh', marginTop: '0vh' }}>
                            <Button style={{ width: '20vw'}} type="primary" icon={<SearchOutlined/>} shape = 'round'  onClick={this.updateSearchResults}>Search for COVID-19 Vaccines</Button>                 
                            </Col>
                            <Col style={{ marginLeft: '5vh', marginTop: '0vh' }}>
                            </Col>
                            </Row>
                        </Form>
                    <Divider style={{ width: '30vw', height: '1vh', margin: '0 auto', marginTop: '2vh' }}/>
                    <Row align ='left'>
                        {this.state.providersResults.length===0? 
                          <Collapse defaultActiveKey={['0']} onChange={()=>{return true}} style={{ width: '35vw', margin: '0 auto', marginLeft: '0vw', marginTop: '2vh' }}>
                          <Panel header="View key details about which vaccine you should get &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(recommended by CDC)" key="1">
                            <p>
                            <ul>
                                <li>If unvaccinated, Pfizer-BioNTech or Moderna (mRNA vaccines) are recommended.</li>
                            </ul>
                            
                            <b>Booster shots for those fully vaccinated:</b>
                            <ul>
                                <li>Most adults 18+, regardless of which vaccine they first received, should get Pfizer-BioNtech or Moderna (mRNA vaccines) for their booster dose.</li>
                                <li>People ages 12-17 should get the Pfizer-BioNTech booster.</li>                        
                            </ul>
                            <b>People who are moderately or severely immunocompromised:</b>
                            <ul>
                                <li>Children 5-11 should get: 
                                <ul><li>3 doses of Pfizer-BioNtech to complete their primary series.</li></ul>
                                </li>
                                <li>Anyone 12+ should get:
                                <ul><li>3 doses of mRNA vaccine to complete their primary series,</li>
                                <li>a booster shot 3 months after their last dose for a total of 4 doses.</li>
                                <li>Anyone who received the J&#38;J COVID-19 vaccine should get a second dose of an mRNA vaccine, and a booster shot 2 months later for a total of 3 shots.</li></ul>
                                </li>                        
                            </ul>
                            </p>
                          </Panel>
                        </Collapse>
                        : null}
                    </Row>
                </Col>
                :
                <Col span={10}>
                    <Row><Button style={{ marginTop: '2vh', width: '10vw'}} type="default" shape = 'round' icon={<ArrowLeftOutlined/>} onClick={this.handleClearSearch}>Back to Search</Button> </Row>
                    <Row style={{ marginTop: '3vh'}}><h5>COVID-19 vaccine provider locations near zip {this.state.zipQuery}&nbsp; </h5><br></br>
                    {this.state.medicineQuery==="59267"? <h6>with Pfizer-BioNTech </h6>:null}
                    {this.state.medicineQuery==="59676"? <h6>with Johnson/Janssen </h6>:null}
                    {this.state.medicineQuery==="80777"? <h6>with Moderna </h6>:null}
                    </Row>
                    <Row style={{ marginTop: '1vh'}}>  
                    <label><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Only show appointments available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></label><Switch defaultCheck = {false} onChange={this.updateSearchByAppointment} />
                    {this.state.instockQuery==='TRUE'? <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.providersResults.length} results are filtered</label>:<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50 results are shown</label>}
                    
                    </Row>
                    <Row>        
                    <List style={{ width: '36vw', height: '100%', margin: '0 auto', marginLeft: '0vw', marginTop: '1vh' }} bordered = {true}>
                        <VirtualList
                            data={this.state.providersResults}
                            height={700}
                            itemHeight={110}
                            itemKey="guid"
                        >
                        {item => (
                            <List.Item key={item.guid}>
                            <List.Item.Meta
                                avatar={<Avatar size={40}>{item.idx}</Avatar>}
                                title={<a href={`/provider?id=${item.guid}`}  target = "_blank" rel="noreferrer">{item.name}</a>}
                                description={<div><i>{item.street}, {item.city}, {item.state} {item.zip}</i>
                                                
                                                    <br></br>
                                                    {item.insurance_accepted==='TRUE'? <Tag color="geekblue">insurance</Tag>: null}
                                                    {item.walkins_accepted==='TRUE'? <Tag color="green">walkin</Tag>: null} 
                                                    {/* {item.prescreen_link? <Tag color="gold">prescreen</Tag>: null} */}
                                                    {item.in_stock==='TRUE'? <Tag color="gold">in_stock</Tag>: null}
                                                    {(item.sunday_hours&&item.sunday_hours!=="Closed"&&item.saturday_hours&&item.saturday_hours!=="Closed")? <Tag color="volcano">weekends</Tag>: null}
                                                    
                                                    </div>}
                                                    
                                />
                            <div><h6>{item.miles} mi &nbsp;&nbsp;<CarTwoTone type='large'/> <a href={`https://google.com/maps/search/${item.street}+${item.city}`} target="_blank" rel="noreferrer">Go</a></h6></div>
                            
                        
                            </List.Item>
                             )}
                        </VirtualList>
                        </List>           
                        </Row>      

                </Col>}
                <Col span={14} align='right' style = {{width: '57vw', height: '90vh', textAlign: 'left'}}>
                    <Map google = {this.props.google} style = {{width: '57vw', height: '100%', textAlign: 'left'}} zoom = {this.state.mapZoom} 
                                        center={{lat:this.state.mapCenter[0], lng:this.state.mapCenter[1]}}>
                                            {this.state.providersResults? this.state.providersResults.map((p, index) => ( 
                                                <Marker key = {index} position = {{lat: p.lat, lng: p.lon}} label = {{text:p.idx.toString(), color:'#fff'}}
                                                guid = {p.guid}
                                                idx = {p.idx}
                                                title = {p.name}
                                                name = {p.name}
                                                address = {p.street}
                                                city = {p.city}
                                                state = {p.state}
                                                zip = {p.zip}
                                                onClick={this.onMarkerClick}>
                                                </Marker> 
                                            )): null}

                                            {this.state.selectedMarkerInfo && <InfoWindow
                                                marker={this.state.activeMarker}
                                                onClose={this.onInfoWindowClose} 
                                                visible = {this.state.showInfoWindow}
                                                >
                                                <div>
                                                    <h6>{this.state.selectedMarkerInfo.name}</h6>                   
                                                    {this.state.selectedMarkerInfo.address}, {this.state.selectedMarkerInfo.city}, {this.state.selectedMarkerInfo.state} {this.state.selectedMarkerInfo.zip}
                                                    <h6><i>
                                                        <a href={`/provider?id=${this.state.selectedMarkerInfo.guid}`} target ="_blank" rel="noreferrer">View Details</a>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <a href={`https://google.com/maps/search/${this.state.selectedMarkerInfo.address}+${this.state.selectedMarkerInfo.city}`} target ="_blank" rel="noreferrer">Directions</a>
                                                        </i></h6>
                                                </div>                                             
                                            </InfoWindow>}

                    </Map> 
                </Col>
                </Row>
                </Form>
                <br></br>
            </div>
        )
    }
}


export default GoogleApiWrapper({apiKey:"AIzaSyAaW7cVSC2nL1kP7mjxAetGqlugZrUEkIw"})(FindProvidersPage)
