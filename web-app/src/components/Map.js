import React from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";

const Map = withScriptjs(
  withGoogleMap((props) => {
    const centerCoordinates = props.centerCoordinates;

    const reportsLocation = props.reportsLocation;

    return (
      <GoogleMap defaultCenter={centerCoordinates} defaultZoom={18}>
        {props.isMarkerShown && <Marker position={centerCoordinates} />}
        {reportsLocation &&
          reportsLocation.map((location, index) => (
            <Marker
              key={index}
              // icon={
              //   {
              //     // url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
              //   }
              // }
              label={{
                text:
                  location.category === 0
                    ? "D"
                    : location.category === 1
                    ? "G"
                    : location.category === 2
                    ? "P"
                    : "V",
              }}
              onClick={() => {
                alert("ez");
              }}
              position={location.position}
              title={location.name}
            />
          ))}
      </GoogleMap>
    );
  })
);

export default React.memo(Map);
