import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import {CityWeather} from './cityWeather';

@Injectable({
  providedIn: 'root'
})

export class WeatherDataService {
  public MaxCities = 9;
  cities: CityWeather[] = Array(this.MaxCities).fill({city: '', weather: '', error: ''});

  getCities(): CityWeather[] {
    return this.cities;
  }

  getCityWeather(index: number, city: string): any {
    const url = `${environment.openWeatherMapApiUrl}?q=${city}&appid=${environment.openWeatherMapToken}`;
    return this.http.get(url).toPromise();
  }

  constructor(
    private http: HttpClient
  ) { }
}
