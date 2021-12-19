import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";

import { getReportDetails, getUserPersonalInformation } from "../lib/api";

import {
  getFormattedCategoryName,
  getFormattedDateTime,
} from "../utility/custom-methods";

import CustomModal from "./CustomModal";

const Map = withScriptjs(
  withGoogleMap((props) => {
    const [modalIsVisible, setModalIsVisible] = useState(false);

    const [selectedReport, setSelectedReport] = useState({});

    const [selectedReportDateTime, setSelectedReportDateTime] = useState();

    const [selectedUserDetails, setSelectedUserDetails] = useState({});

    const centerCoordinates = props.centerCoordinates;

    const selectedReportLocation = selectedReport.location;

    const reportsLocation = props.reportsLocation;

    const closeModalHandler = () => {
      if (modalIsVisible) {
        setModalIsVisible(false);
      }
    };

    return (
      <GoogleMap defaultCenter={centerCoordinates} defaultZoom={18}>
        {props.isMarkerShown && <Marker position={centerCoordinates} />}
        {reportsLocation &&
          reportsLocation.map((location, index) => (
            <Marker
              key={index}
              label={{
                color: "gold",
                fontSize: "large",
                fontWeight: "bold",
                text: getFormattedCategoryName(location.category).substring(
                  0,
                  1
                ),
              }}
              onClick={() => {
                if (!modalIsVisible) {
                  const reportDetailsPromise = getReportDetails(
                    reportsLocation[index].id
                  );

                  reportDetailsPromise
                    .then((reportDetails) => {
                      if (reportDetails && reportDetails !== {}) {
                        const userPersonalInformationPromise =
                          getUserPersonalInformation(reportDetails.userId);

                        userPersonalInformationPromise
                          .then((userPersonalInformation) => {
                            if (
                              userPersonalInformation &&
                              userPersonalInformation !== {}
                            ) {
                              setSelectedUserDetails(userPersonalInformation);
                            }
                          })
                          .catch((error) => {
                            console.log(error.message);
                          });

                        setSelectedReport(reportDetails);

                        const selectedReportParsedDateTime =
                          getFormattedDateTime(reportDetails.dateTime);

                        setSelectedReportDateTime(selectedReportParsedDateTime);
                      }
                    })
                    .catch((error) => {
                      console.log(error.message);
                    });

                  setModalIsVisible((previousValue) => !previousValue);
                }
              }}
              position={location.position}
              title={location.name}
            />
          ))}

        <CustomModal
          visible={modalIsVisible}
          closeHandler={closeModalHandler}
          selectedReport={selectedReport}
          selectedReportLocation={selectedReportLocation}
          selectedReportDateTime={selectedReportDateTime}
          selectedUserDetails={selectedUserDetails}
        />
      </GoogleMap>
    );
  })
);

export default React.memo(Map);
