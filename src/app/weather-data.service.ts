import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import {CityWeather} from './cityWeather';

@Injectable({
  providedIn: 'root'
})

export class WeatherDataService {
  public MaxCities = 9;
  cities;

  getCities(): CityWeather[] {
    return this.cities;
  }

  getCityWeather(index: number, city: string): any {
    const url = `${environment.openWeatherMapApiUrl}?q=${city}&appid=${environment.openWeatherMapToken}`;
    return this.http.get(url).toPromise();
  }

  constructor(
    private http: HttpClient
  ) {
    const cities = new Array(this.MaxCities);
    for (let i = 0; i < this.MaxCities; i++) {
      cities[i] = {id: i, city: '', error: ''};
    }
    this.cities = cities;
  }
}
