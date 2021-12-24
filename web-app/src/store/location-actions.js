// Redux
import { locationActions } from "./location-slice";

export const fetchCurrentLocation = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch("http://ip-api.com/json/?fields=223");

      if (!response.ok) {
        throw new Error("Couldn't fetch your location!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const locationData = await fetchData();

      dispatch(
        locationActions.setAdminLocation({
          newLocation: {
            latitude: locationData.lat,
            longitude: locationData.lon,
          },
        })
      );
    } catch (error) {
      console.log("Couldn't fetch your location!");
    }
  };
};
