import React from "react";
// import { GoogleMap } from "react-google-maps";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

const { REACT_APP_GOOGLE_KEY: GOOGLE_KEY } = process.env;

const CustomMap = (props) => {
  return (
    <Map
      google={props.google}
      zoom={19}
      style={{ width: "100%", height: "100%" }}
      initialCenter={{ lat: 45.299800872802734, lng: 21.88010025024414 }}
    >
      <Marker position={{ lat: 45.299800872802734, lng: 21.88010025024414 }} />
    </Map>
  );
};

// <GoogleMap
//   defaultZoom={10}
//   defaultCenter={{ lat: 45.299800872802734, lng: 21.88010025024414 }}
// />

// export default Map;

export default GoogleApiWrapper({ apiKey: GOOGLE_KEY })(CustomMap);
