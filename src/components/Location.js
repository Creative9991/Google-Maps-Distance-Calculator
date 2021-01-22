import React , {Component} from 'react';
import { Input,Card, Row, Col} from 'antd';
import {GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import * as api from '../services/api';

const { REACT_APP_GOOGLE_API, REACT_APP_API_URL} = process.env;

export class GoogleMap extends Component { 
    constructor(props) {
        super(props)
        this.state = {
          loading: true,
          error: false,
          startAddress : '',
          endAddress: '',
          startLocationlatLng:{},
          endLocationlatLng: {},
          distance: '',
          distances : [],
          historydata : []
        };
      }

      handleStartLocationChange = (startAddress , startLocationlatLng) => {
        this.setState({ startAddress, startLocationlatLng});
      };

      handleEndLocationChange = (endAddress , endLocationlatLng) => {
        this.setState({  endAddress, endLocationlatLng });
      }


     
      handleStartLocationSelect = startAddress => {
        geocodeByAddress(startAddress)
          .then(results => getLatLng(results[0]))
          .then(startLocationlatLng => {
                console.log('Success', startLocationlatLng);
                this.setState({ startAddress, startLocationlatLng })
                this.measuringLatLng();
            })
          .catch(error => console.error('Error', error));
      }; 

      handleEndLocationSelect =  endAddress => {

        geocodeByAddress(endAddress)
          .then(results => getLatLng(results[0]))
          .then(endLocationlatLng => {
              console.log('Success', endLocationlatLng);
              this.setState({ endAddress, endLocationlatLng });
              this.measuringLatLng();
            })
          .catch(error => console.error('Error', error));
      }; 


measuringLatLng = () =>{

    let { startLocationlatLng, endLocationlatLng} = this.state;
    //starting Location Lantitude
    let slat = startLocationlatLng.lat;
    //Start Location Longitude
    let slng = startLocationlatLng.lng;
    //Ending Location Lantitude
    let elat = endLocationlatLng.lat;
    //Ending Location Lantitude
    let elng = endLocationlatLng.lng;

    if( !slat || !slng || !elat || !elng ){
        return;
    }

    //Post call to get the travel time and distance between the two search location

    axios.post(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${slat},${slng}&destinations=${elat},${elng}&key=${REACT_APP_GOOGLE_API}`,this.state)
    .then(response => {
      if(response.data.rows[0].elements[0].status === 'OK'){
        this.setState({
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text
        });

        //Post request to save the searched history in the Mongodb database.


        axios.post(`${REACT_APP_API_URL}/historydata`, this.state)
        .then(response => {
            console.log(response);
        })
        .catch (err =>{
            console.log(err);
        })
      }else{
        this.setState({
            distance: 'Cannot calculate the distance between above two locations based on google maps',
            duration: 'Cannot calculate the duration between above two locations based on the google maps'
        });
      }
      
      
    })
    .catch (err =>{
      console.log(err); 
    })
}

//get request to get the history data from the mongodb and showing those data in the search history

async componentDidMount(){
    try {
        const historydata = await api.getHistorydata();
        this.setState({ historydata , loading: false});
    } catch (err) {
        this.setState({ loading: false, error: true });
    }

}

    
    render() {

        let { startAddress, historydata, loading, error,  endAddress , distance, duration} =  this.state;

      return (
          <div>
              <Row>
      <Col span={12}>
          <h1 className="header-main"> Find out the distance between any two locations</h1>
       <Card  className="card-container" size="small">
          <p>Start Location</p>
        <PlacesAutocomplete
        value={startAddress}
        onChange={this.handleStartLocationChange}
        onSelect={this.handleStartLocationSelect}
        onClick={this.handleStartLocationSelect}
        >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Input
              {...getInputProps({
                placeholder: 'start Location',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
       </PlacesAutocomplete>
         <p>End Location</p>
       <PlacesAutocomplete
        value={endAddress}
        onChange={this.handleEndLocationChange}
        onSelect={this.handleEndLocationSelect}
        onClick={this.handleEndLocationSelect}
       >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Input
              {...getInputProps({
                placeholder: 'End Location',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
             <p className="distance">Distance Between two locations: 
             <span className="distance-miles">{ distance } </span>
             </p> 
    
             <p className="time">Time required to travel between two locations: 
             <span className="distance-duration"> { duration } </span></p>
        
       </Card>
      </Col>
      <Col span={12}> 
            <h1 className="header-main">Search Histroy :</h1>
                { loading &&
                <h2>Loading Data..</h2>
                }
                { error &&
                <h2>Error getting Data</h2>
                }
                { !loading && !error &&
                historydata.map(currenthistory  => {
                    return (
                    <Card key={currenthistory._id}>
                    <div className="search-location-history">
                    <p> Start Address :   {currenthistory.startAddress}</p>
                    <p> End Address :     {currenthistory.endAddress}</p>
                    <p> Travel Distance : {currenthistory.distance}</p>
                    <p> Travel Duration:  {currenthistory.duration}</p>
                    </div>
                    </Card>
                    )
                })
                }
      
      </Col>
    </Row>
          </div>  
      )
    }
  }
  export default GoogleApiWrapper({
    apiKey: (`${REACT_APP_GOOGLE_API}`),
  })(GoogleMap)

