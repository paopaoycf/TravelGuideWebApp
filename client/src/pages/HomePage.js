import React from 'react';
import MenuBar from '../components/MenuBar';
import { Carousel, Col, Row } from 'antd';
import Texty from 'rc-texty';
import './index.css';
import TweenOne from 'rc-tween-one';

const contentStyle1 = {
  width: '100%',
  height: '100%',
  color: '#fff',
  fontWeight: 'heavy',
  lineHeight: '40vh',
  textAlign: 'center',
  background: '#FFF url("https://hms.harvard.edu/sites/default/files/media/GlobalCOVID850.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};

const contentStyle2 = {
  width: '100%',
  height: '100%',
  color: '#fff',
  fontWeight: 'heavy',
  lineHeight: '40vh',
  textAlign: 'center',
  background: '#FFF url("https://assets.medpagetoday.net/media/images/95xxx/95957.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};

const contentStyle3 = {
  width: '100%',
  height: '100%',
  color: '#fff',
  fontWeight: 'heavy',
  lineHeight: '40vh',
  textAlign: 'center',
  background: '#FFF url("https://www.nih.gov/sites/default/files/styles/floated_media_breakpoint-large/public/news-events/news-releases/2020/20200922-JJ-COVID-19-vaccine.jpg?itok=RvgUC0du&timestamp=1600787951")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};

const contentStyle4 = {
  width: '100%',
  height: '100%',
  color: '#fff',
  fontWeight: 'heavy',
  lineHeight: '40vh',
  textAlign: 'center',
  background: '#FFF url("https://ichef.bbci.co.uk/news/976/cpsprodpb/81BB/production/_119911233_gettyimages-1255592872.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};


class HomePage extends React.Component {
  state = {
    show: true,
  }

  textyOnClick = (e) =>{
    // console.log("clicked")
    this.setState({
      show: false,
    }, () => {
      this.setState({
        show: true
      });
    });
  }
  geInterval = (e) => {
    switch (e.index) {
      case 0:
        return 0;
      case 1:
        return 150;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 150 + 450 + (e.index - 2) * 10;
      default:
        return 150 + 450 + (e.index - 6) * 150;
    }
  }
  getEnter = (e) => {
    const t = {
      opacity: 0,
      scale: 0.8,
      y: '-100%',
    };
    if (e.index >= 2 && e.index <= 6) {
      return { ...t, y: '-30%', duration: 150 };
    }
    return t;
  }

  getSplit = (e) => {
    const t = e.split(' ');
    const c = [];
    t.forEach((str, i) => {
      c.push((
        <span key={`${str}-${i}`}>
          {str}
        </span>
      ));
      if (i < t.length - 1) {
        c.push(<span key={` -${i}`}> </span>);
      }
    });
    return c;
  }

  render() {
    return (
      <div className="homepage">
      <MenuBar/>
      <div className="combined-wrapper">
        {this.state.show && (
          <div className="combined">
            <div className="combined-shape">
              <div className="shape-left">
                <TweenOne
                  animation={[
                    { x: 270, type: 'from', ease: 'easeInOutQuint', duration: 600 },
                    { x: -271, ease: 'easeInOutQuart', duration: 450, delay: -150 },
                  ]}
                />
              </div>
              <div className="shape-right">
                <TweenOne
                  animation={[
                    { x: -270, type: 'from', ease: 'easeInOutQuint', duration: 600 },
                    { x: 270, ease: 'easeInOutQuart', duration: 450, delay: -150 },
                  ]}
                />
              </div>
            </div>
            <Texty
              className="title"
              type="mask-top"
              delay={400}
              enter={this.getEnter}
              interval={this.geInterval}
              component={TweenOne}
              componentProps={{
                animation: [
                  { x: 130, type: 'set' },
                  { x: 100, delay: 500, duration: 450 },
                  {
                    ease: 'easeOutQuart',
                    duration: 300,
                    x: 0,
                  },
                  {
                    letterSpacing: 0,
                    delay: -300,
                    scale: 0.9,
                    ease: 'easeInOutQuint',
                    duration: 1000,
                  },
                  { scale: 1, width: '100%', delay: -300, duration: 1000, ease: 'easeInOutQuint' },
                ],
              }}
              onClick={this.textyOnClick}
            >
              Travel Guide in Covid
            </Texty>
            <TweenOne
              className="combined-bar"
              animation={{ delay: 2000, width: 0, x: 158, type: 'from', ease: 'easeInOutExpo' }}
            />
            <Texty
              className="content"
              type="bottom"
              split={this.getSplit}
              delay={2200}
              interval={30}
            >
              Help you get prepared for a safe trip during the pandemic.
            </Texty>
          </div>
        )}
      </div>
      <Row style ={{height: "56vh" , marginLeft:"6vw", marginRight:"6vw"}}>

      <Col span = {12}>
        <Row style = {{height: "20vh", marginTop: "3vh"}}>
          <Col span = {10}>
          <div className='internationalPicture'>
          </div>
          </Col>
          <Col span = {14}>
          <div className = 'contentHomepage'>
              <h5>International Travel</h5>
              <li><b>Plan your trip: </b></li> 
              &nbsp;&nbsp;&nbsp;&nbsp; <a href="/international">check COVID situation and travel restrictions</a>
              <li><b>Before your trip: </b></li> 
              &nbsp;&nbsp;&nbsp;&nbsp; <a href="/findproviders">get fully vaccinated against COVID-19</a>
           </div>
          </Col>       
        </Row>
        <Row style = {{height: "24vh", marginTop: "2vh"}}>
        <Col span = {10}>
          <div className='domesticPicture'>
          </div>
          </Col>
          <Col span = {14}>
          <div className = 'contentHomepage'>
              <h5>U.S. Domestic Travel</h5>
              <li><b>Plan your trip: </b></li> 
              &nbsp;&nbsp;&nbsp;&nbsp; <a href="/domestic">check COVID situation and travel restrictions</a>
              <li><b>Before your trip: </b></li> 
              &nbsp;&nbsp;&nbsp;&nbsp; <a href="/findproviders">get fully vaccinated against COVID-19</a>
              <li><b>During your trip: </b></li> 
              &nbsp;&nbsp;&nbsp;&nbsp; <a href="/findfacilities">find urgent care facility if you need help</a>
           </div>
          </Col>
        </Row>

      </Col>
      {/* <Col span = {1} style ={{marginTop:"3vh"}}></Col> */}
      <Col span = {12} style ={{marginTop:"3vh"}}>
      <Carousel autoplay>
          <div>
            <h3 style={contentStyle1} onClick={() => window.location = '/international'}>International Covid Statstics</h3>
          </div>
          <div>
            <h3 style={contentStyle2} onClick={() => window.location = '/domestic'}>U.S. Covid Statstics</h3>
          </div>
          <div>
            <h3 style={contentStyle3} onClick={() => window.location = '/findproviders'}>Find COVID-19 Vaccines</h3>
          </div>
          <div>
            <h3 style={contentStyle4} onClick={() => window.location = '/findfacilities'}>Need Urgent Care</h3>
          </div>
        </Carousel>
      </Col>
      </Row>
      </div>
    );
  }
}

export default HomePage
