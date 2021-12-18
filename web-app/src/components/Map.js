import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";

import { getReportDetails, getUserPersonalInformation } from "../lib/api";

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

                        const reportDetailsDateTime = reportDetails.dateTime;

                        const selectedReportParsedDateTime =
                          (reportDetailsDateTime.day < 10
                            ? "0" + reportDetailsDateTime.day
                            : reportDetailsDateTime.day) +
                          "/" +
                          (reportDetailsDateTime.month < 10
                            ? "0" + reportDetailsDateTime.month
                            : reportDetailsDateTime.month) +
                          "/" +
                          reportDetailsDateTime.year +
                          " " +
                          (reportDetailsDateTime.hour < 10
                            ? "0" + reportDetailsDateTime.hour
                            : reportDetailsDateTime.hour) +
                          ":" +
                          (reportDetailsDateTime.minute < 10
                            ? "0" + reportDetailsDateTime.minute
                            : reportDetailsDateTime.minute) +
                          ":" +
                          (reportDetailsDateTime.second < 10
                            ? "0" + reportDetailsDateTime.second
                            : reportDetailsDateTime.second);

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
