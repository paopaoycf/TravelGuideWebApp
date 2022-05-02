// author: paopaoycf (Chenfei Yu)
import React from 'react';
import { Form} from "shards-react";
import Icon, { PhoneFilled, CarTwoTone, MinusCircleTwoTone, CloseCircleTwoTone, CheckCircleTwoTone} from '@ant-design/icons';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
// import {GoogleMap, Marker} from "react-google-map";
// import { Loader } from "@googlemaps/js-api-loader";
import {
    Row,
    Col,
    Divider,
    Button,
    BackTop,
} from 'antd'
// import { format } from 'd3-format';
import './index.css';

import MenuBar from '../components/MenuBar';
import { getProviderDetail, getProviderInStock } from '../fetcher'
// const wideFormat = format('.3r');

class ProviderDetailPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedProviderId: window.location.search ? window.location.search.substring(1).split('=')[1] : "01995d18",
            vaccModernaStock: '',
            vaccPfizerStock: '',
            vaccJanssenStock: '',
            selectedProviderDetail: [],
            activeMarker: {},
            showInfoWindow: false
        }
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
        getProviderDetail(this.state.selectedProviderId).then(res => {
            this.setState({ selectedProviderDetail: res.results[0]})
            console.log(this.state.selectedProviderDetail)
        })

        getProviderInStock(this.state.selectedProviderId).then(res => {
            var arr = res.results
            if(arr && arr.length > 0){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i].ndc_code==="59267"){ this.setState({ vaccPfizerStock: arr[i].in_stock}) }
                    if(arr[i].ndc_code==="59676"){ this.setState({ vaccJanssenStock: arr[i].in_stock}) }
                    if(arr[i].ndc_code==="80777"){ this.setState({ vaccModernaStock: arr[i].in_stock}) }                            
                }
            }
            console.log("Pfi:", this.state.vaccPfizerStock, "Jas:", this.state.vaccJanssenStock, "Mdna:", this.state.vaccModernaStock)
        })

    }

    render() {

        const zoom_setting = 15
    
        return (
            <div>
                <MenuBar />
                <Form style={{ width: '70vw', margin: '0 auto', marginTop: '5vh', marginLeft:'16vw', marginRight:'16vw' }}>
                    <Row>
                    <Col span={10} align='left'>
                        <Row><h3>{this.state.selectedProviderDetail.name}</h3></Row>
                        <Row>{this.state.selectedProviderDetail.street}, {this.state.selectedProviderDetail.city}, {this.state.selectedProviderDetail.state} {this.state.selectedProviderDetail.zip}</Row>
                        <Row align = 'middle'>
                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} ><Icon component={CarTwoTone}/> &nbsp;</Col>
                            <Col style={{verticalAlign: 'middle'}} ><a href={`https://google.com/maps/search/${this.state.selectedProviderDetail.street}+${this.state.selectedProviderDetail.zip}`} target = "_blank" rel="noreferrer">Direction</a></Col>
                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} ><Icon component={PhoneFilled}/> &nbsp;</Col>
                            <Col style={{verticalAlign: 'middle'}} >{this.state.selectedProviderDetail.phone}</Col>                       
                        </Row>
                        <Row style={{marginTop: '2vh'}}><h5><b>COVID-19 Vaccines and Boosters at This Location</b></h5></Row>
                        <div className="site-card-wrapper22">
                        <Row>
                            <Col span={18}>                              
                                <Divider orientation="left" orientationMargin="0">Pfizer-BioNTech</Divider>
                                <Divider orientation="left" orientationMargin="0">Moderna</Divider>
                                <Divider orientation="left" orientationMargin="0">Johnson/Janssen</Divider>
                            </Col>
                            <Col span={6} align='right'>                               
                                    {this.state.vaccPfizerStock===''? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<MinusCircleTwoTone twoToneColor="#969595"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >Not Provide</Col></Row>: null}
                                    {this.state.vaccPfizerStock==='FALSE'? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<CloseCircleTwoTone twoToneColor="#eb2f5b"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >Out of Stock</Col></Row>: null}
                                    {this.state.vaccPfizerStock==='TRUE'? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<CheckCircleTwoTone twoToneColor="#52c41a"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >In Stock</Col></Row>: null}

                                    {this.state.vaccModernaStock===''? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<MinusCircleTwoTone twoToneColor="#969595"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >Not Provide</Col></Row>: null}
                                    {this.state.vaccModernaStock==='FALSE'? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<CloseCircleTwoTone twoToneColor="#eb2f5b"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >Out of Stock</Col></Row>: null}
                                    {this.state.vaccModernaStock==='TRUE'? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<CheckCircleTwoTone twoToneColor="#52c41a"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >In Stock</Col></Row>: null}

                                    {this.state.vaccJanssenStock===''? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<MinusCircleTwoTone twoToneColor="#969595"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >Not Provide</Col></Row>: null}
                                    {this.state.vaccJanssenStock==='FALSE'? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<CloseCircleTwoTone twoToneColor="#eb2f5b"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >Out of Stock</Col></Row>: null}
                                    {this.state.vaccJanssenStock==='TRUE'? 
                                            <Row align = 'middle' style={{marginTop: '1.4vh'}}>
                                            <Col style={{verticalAlign: 'middle', marginBottom: '1vh'}} >&nbsp;&nbsp;<CheckCircleTwoTone twoToneColor="#52c41a"/> &nbsp;</Col>
                                            <Col style={{verticalAlign: 'middle'}} >In Stock</Col></Row>: null}
                            </Col>             
                        </Row>                          
                        </div>
                        {((this.state.vaccJanssenStock==='TRUE' || this.state.vaccModernaStock==='TRUE' || this.state.vaccPfizerStock==='TRUE') && this.state.selectedProviderDetail.web_link)? 
                        <Button style={{ width: '29vw', marginTop: '2vh'}} type="primary" shape = 'round' size='large' onClick={()=>window.open(`https://${this.state.selectedProviderDetail.web_link}`, "_blank")}>Make an Appointment</Button>    
                        :
                        <Button style={{ width: '29vw', marginTop: '2vh'}} type="primary" shape = 'round' size='large' disabled='true'>Appointment Not Available</Button>
                        }
                        

                    </Col>
                    <Col span={1} align = 'right'></Col>
                    <Col span={10} align = 'right'>
                        <Map google = {this.props.google} style = {{width: '28vw', height: '40vh', textAlign: 'left'}} zoom = {zoom_setting} onClick={this.onMapClicked}
                                        center={{lat:this.state.selectedProviderDetail.lat, lng:this.state.selectedProviderDetail.lon}} >
                                            <Marker position = {{lat:this.state.selectedProviderDetail.lat, lng:this.state.selectedProviderDetail.lon}} 
                                                onClick={this.onMarkerClick}
                                                animation={1}/>                                        
                                            <InfoWindow
                                                marker={this.state.activeMarker}
                                                onClose={this.onInfoWindowClose} 
                                                visible={this.state.showInfoWindow}>
                                                <div>{this.state.selectedProviderDetail.street}, {this.state.selectedProviderDetail.city}, {this.state.selectedProviderDetail.state} {this.state.selectedProviderDetail.zip}</div>
                                                
                                            </InfoWindow>                                          
                                </Map> 
                    
                    
                    </Col>
                    {/* <Form style={{marginTop: '0vh', width: '30vw'}}> */}
                    {/* </Row> */}
                    <Row style={{marginTop: '5vh', marginBottom: '2vh', width: '60vw'}}><h5><b>More Details</b></h5></Row>
                    {this.state.selectedProviderDetail.web_link? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Website</b></h6></Col>
                        <Col span={6} align = 'right'><h6><a href ={`https://${this.state.selectedProviderDetail.web_link}`} target = "_blank" rel="noreferrer">Website</a></h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '0vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    {this.state.selectedProviderDetail.prescreen_link? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Pre-screen</b></h6></Col>
                        <Col span={6} align = 'right'><h6><a href ={`https://${this.state.selectedProviderDetail.prescreen_link}`} target = "_blank" rel="noreferrer">Link</a></h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '0vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    {this.state.selectedProviderDetail.walkins_accepted==='TRUE'? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Walk-ins</b></h6></Col>
                        <Col span={6} align = 'right'><h6>Accept Walk-in</h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '0vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    {this.state.selectedProviderDetail.walkins_accepted==='FALSE'? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Walk-ins</b></h6></Col>
                        <Col span={6} align = 'right'><h6>Not Accept Walk-in</h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '0vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    {this.state.selectedProviderDetail.insurance_accepted==='TRUE'? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Insurance</b></h6></Col>
                        <Col span={6} align = 'right'><h6>Accept Insurance</h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '0vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    {this.state.selectedProviderDetail.insurance_accepted==='FALSE'? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Insurance</b></h6></Col>
                        <Col span={6} align = 'right'><h6>Not Accept Insurance</h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '0vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    {this.state.selectedProviderDetail.notes? 
                    <div>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Notes</b></h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        {this.state.selectedProviderDetail.notes}
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '1vh', marginBottom: '1.5vh'}}>
                    </Divider>
                    </Row>
                    </div>: null}

                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={18}><h6><b>Open Hours</b></h6></Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                        <Col span={12}>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Sunday</h6></Row>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Monday</h6></Row>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Tuesday</h6></Row>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Wednesday</h6></Row>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Thursday</h6></Row>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Friday</h6></Row>
                            <Row style={{marginTop: '0vh', marginBottom: '0vh'}}><h6>Saturday</h6></Row>
                        </Col>
                        <Col span={12}>
                        <Row style={{marginTop: '0vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.sunday_hours}</Row>
                            <Row style={{marginTop: '1.5vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.monday_hours}</Row>
                            <Row style={{marginTop: '1.5vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.tuesday_hours}</Row>
                            <Row style={{marginTop: '1.5vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.wednesday_hours}</Row>
                            <Row style={{marginTop: '1.5vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.thursday_hours}</Row>
                            <Row style={{marginTop: '1.5vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.friday_hours}</Row>
                            <Row style={{marginTop: '1.5vh', marginBottom: '0vh'}}>{this.state.selectedProviderDetail.saturday_hours}</Row>                           
                        </Col>
                    </Row>
                    <Row style={{marginTop: '0vh', marginBottom: '0vh', width: '50vw'}}>
                    <Divider style={{marginTop: '1vh', marginBottom: '5vh'}}>
                    </Divider>
                    </Row>
                    </Row>
                </Form>
            <BackTop/>
            </div> 

        )
    }
}


export default GoogleApiWrapper({apiKey:"AIzaSyAaW7cVSC2nL1kP7mjxAetGqlugZrUEkIw"})(ProviderDetailPage)
