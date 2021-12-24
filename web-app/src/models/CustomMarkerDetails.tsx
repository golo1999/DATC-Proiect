// Models
import MapCenterCoordinates from "./MapCenterCoordinates";

class CustomMarkerDetails {
  id: string;
  category: number;
  name: string;
  position: MapCenterCoordinates;

  constructor(
    id: string,
    category: number,
    name: string,
    position: MapCenterCoordinates
  ) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.position = position;
  }
}

export default CustomMarkerDetails;
