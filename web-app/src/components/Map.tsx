// NPM
import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";

// APIs
import { getReportDetails, getUserPersonalInformation } from "../lib/api";

// Models
import CustomMarkerDetails from "../models/CustomMarkerDetails";
import MapCenterCoordinates from "../models/MapCenterCoordinates";
import Report from "../models/Report";
import UserPersonalInformation from "../models/UserPersonalInformation";

// Utility
import {
  getFormattedCategoryName,
  getFormattedDateTime,
} from "../utility/custom-methods";
import {
  DEFAULT_REPORT,
  DEFAULT_USER_PERSONAL_INFORMATION,
} from "../utility/custom-variables";

// Custom components
import CustomModal from "./CustomModal";

type Props = {
  centerCoordinates: MapCenterCoordinates;
  isMarkerShown: boolean;
  markerDetailsList?: CustomMarkerDetails[];
};

const Map = withScriptjs(
  withGoogleMap(
    ({ centerCoordinates, isMarkerShown, markerDetailsList }: Props) => {
      const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

      const [selectedReport, setSelectedReport] =
        useState<Report>(DEFAULT_REPORT);

      const [selectedReportDateTime, setSelectedReportDateTime] =
        useState<string>();

      const [selectedUserDetails, setSelectedUserDetails] =
        useState<UserPersonalInformation>(DEFAULT_USER_PERSONAL_INFORMATION);

      const closeModalHandler = () => {
        if (modalIsVisible) {
          setModalIsVisible(false);
        }
      };

      return (
        <GoogleMap defaultCenter={centerCoordinates} defaultZoom={18}>
          {isMarkerShown && <Marker position={centerCoordinates} />}
          {markerDetailsList &&
            markerDetailsList.map(
              (location: CustomMarkerDetails, index: number) => (
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
                        markerDetailsList[index].id
                      );

                      reportDetailsPromise
                        .then((reportDetails: Report) => {
                          if (
                            reportDetails &&
                            reportDetails !== DEFAULT_REPORT
                          ) {
                            const userPersonalInformationPromise =
                              getUserPersonalInformation(reportDetails.userId);

                            userPersonalInformationPromise
                              .then((userPersonalInformation) => {
                                if (
                                  userPersonalInformation &&
                                  userPersonalInformation !==
                                    DEFAULT_USER_PERSONAL_INFORMATION
                                ) {
                                  setSelectedUserDetails(
                                    userPersonalInformation
                                  );
                                }
                              })
                              .catch((error) => {
                                console.log(error.message);
                              });

                            setSelectedReport(reportDetails);

                            const selectedReportParsedDateTime =
                              getFormattedDateTime(reportDetails.dateTime);

                            setSelectedReportDateTime(
                              selectedReportParsedDateTime
                            );
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
              )
            )}

          <CustomModal
            visible={modalIsVisible}
            closeHandler={closeModalHandler}
            selectedReport={selectedReport}
            selectedReportLocation={selectedReport.location}
            selectedReportDateTime={selectedReportDateTime}
            selectedUserDetails={selectedUserDetails}
          />
        </GoogleMap>
      );
    }
  )
);

export default React.memo(Map);
