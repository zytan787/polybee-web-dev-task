import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import {CityWeather} from './cityWeather';

const STORAGE_KEY = 'cities';

@Injectable({
  providedIn: 'root'
})

export class WeatherDataService {
  public MaxCities = 9;

  getCities(): CityWeather[] {
    console.log('getting cities...');
    console.log(this.storage.get(STORAGE_KEY));
    return this.storage.get(STORAGE_KEY);
  }

  storeCities(cities: CityWeather[]): void {
    this.storage.set(STORAGE_KEY, cities);
    console.log('storing cities...');
    console.log(this.storage.get(STORAGE_KEY));
  }

  getCityWeather(index: number, city: string): any {
    const url = `${environment.openWeatherMapApiUrl}?q=${city}&appid=${environment.openWeatherMapToken}`;
    return this.http.get(url).toPromise();
  }

  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {
    const cities = this.storage.get(STORAGE_KEY);
    // const cities = new Array(this.MaxCities);
    // for (let i = 0; i < this.MaxCities; i++) {
    //   cities[i] = {id: i, city: '', error: ''};
    // }
    this.storeCities(cities);
  }
}
