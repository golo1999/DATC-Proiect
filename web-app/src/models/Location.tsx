class Location {
  city!: string;
  country!: string;
  countryCode!: string;
  latitude: number;
  longitude: number;
  region!: string;
  regionName!: string;

  constructor(
    latitude: number,
    longitude: number,
    city?: string,
    country?: string,
    countryCode?: string,
    region?: string,
    regionName?: string
  ) {
    this.latitude = latitude;
    this.longitude = longitude;

    if (city && country && countryCode && region && regionName) {
      this.city = city;
      this.country = country;
      this.countryCode = countryCode;
      this.region = region;
      this.regionName = regionName;
    }
  }
}

export default Location;
