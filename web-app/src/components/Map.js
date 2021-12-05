import React from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";

const Map = withScriptjs(
  withGoogleMap((props) => {
    const centerCoordinates = {
      lat: 45.299800872802734,
      lng: 21.88010025024414,
    };

    const containerStyle = { width: "100%", height: "500px" };

    return (
      <GoogleMap
        defaultCenter={centerCoordinates}
        defaultZoom={15}
        // mapContainerStyle={containerStyle}
      >
        {props.isMarkerShown && <Marker position={centerCoordinates} />}
      </GoogleMap>
    );
  })
);

export default React.memo(Map);
