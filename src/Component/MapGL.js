import React from 'react';
import ReactMapboxGl, {
  Layer, Feature,
  Popup,
  Marker,
  ZoomControl,
  RotationControl,
} from 'react-mapbox-gl';
import { MdStar } from 'react-icons/md';
import Data from './Data';
import {Card} from 'reactstrap'


const Map = ReactMapboxGl({
  maxZoom: 25,
  minZoom: 14,
  accessToken:
    'pk.eyJ1IjoiYWtpbnllbWkxNDcyIiwiYSI6ImNrMXoyNW92dDBsZ2UzaG12Mm9xNGhmdGcifQ.RlIm2uIf_39XH1hbaG4C7A',
});
const StyledPopup = {
  background: "white",
  color: "#3f618c",
  fontSize: 10 ,
  fontWeight: 400,
  padding: "5px",
  borderRadius: "2px",
  width: '25em'

}
const flyToOptions = {
  speed: 0.8
};
const mapStyle = {
  flex: 1
};

let index = 0;

class MapGL extends React.Component {
  state = {
    lng: 8.5601,
    lat: 11.991,
    zoom: [13],
    loading: true,
    restuarant: [],
    stations: {},
    data: Data,
    station: undefined,
    fitBounds: undefined,
    center: [],
    name: ''
  };

 
  onNameChange = event => {
    this.setState({
      name: event.target.value,
    });
  };

  addItem = () => {
    const { name, station } = this.state;
    let newb = station.ratings.concat({
      stars: 5,
      comment: name
  })
    this.setState(prev => ({
      station: {
        ...prev.station,
        ratings: newb
      }
    }));
   
  };
 markerClick = (station) => {
   console.log(station)
    this.setState({
      center:[this.state.lng, this.state.lat],
      station
    });
  };

 onStyleLoad = (map) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  onDrag = () => {
    if (this.state.data) {
      this.setState({ data: undefined });
    }
  };


  handInputSubmit = (e) => {
    e.preventDefault()
    console.log("Hello World")
  };
  _onClickMap = (map, evt)=> {
    console.log(evt.lngLat);
    this.setState(prev => ({
      data: [
        ...prev.data,
        {
          restaurantName: '',
          address: '',
          lat: evt.lngLat.wrap().lat,
          lng: evt.lngLat.wrap().lng,
          picURL: '',
          ratings: [],
        },
      ],
    }))
  }


  render() {
    const image = new Image();
    image.src=`${require('../marker.png')}`
    const images= ['marker', image];
    const layoutLayer = { 'icon-image': 'marker' }
    const { items, name, zoom, station, data } = this.state;
    return (
      <Map
        onClick={this._onClickMap}
        onStyleLoad={this.onMapLoad}
        center={[this.state.lng, this.state.lat]}
        zoom={[this.state.zoom]}
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '140vh',
          width: '64vw',
        }}
        >
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{' '}
            {this.state.zoom}
          </div>
          
        </div>

        <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
          {data.map((item, index) =>
          <Feature coordinates={[item.lng, item.lat]} 
          key={index}
          onClick={() => this.markerClick(item)}
          />
          )}
    </Layer>
          
      {station &&(
          <Popup
            key={station.id}
            anchor="bottom-right"
            coordinates={[station.lng, station.lat]}
            onClick={() => this.handtoggle}
            style={StyledPopup}
           >
              
            <div>
              <img src={station.picURL} width="180" />
              <h4>{station.restaurantName} </h4>
              <p> {station.address}</p>
              <div className="d-flex ">
                <input
                  value={name} onChange={this.onNameChange}
                  className="form-control"
                  type="text"
                  placeholder="Add your review"
                />
                <button className="btn btn-success" onClick={this.addItem}>Add</button>
              </div>
            {station.ratings.map(item => 
              <li>
                  {item.comment} <MdStar />
                  {item.stars}
                </li>
            )}           
                
          
            </div>
          
          </Popup>
         
        )} 
        
        

        <ZoomControl />
        <RotationControl />
      </Map>
    );
  }
}

export default MapGL;
