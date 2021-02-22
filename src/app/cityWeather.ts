export interface CityWeather {
  id: number;
  city: string;
  weather?: WeatherData;
  error: string;
}

type WeatherData = {
  id: number;
  main: string;
  description: string;
};
