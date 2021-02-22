import {Inject, Injectable, OnDestroy} from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import {CityWeather} from './cityWeather';
import {removeSummaryDuplicates} from '@angular/compiler';

const STORAGE_KEY = 'cities';

@Injectable({
  providedIn: 'root'
})

export class WeatherDataService{
  public MaxCities = 9;

  getCities(): CityWeather[] {
    return this.storage.get(STORAGE_KEY);
  }

  storeCities(cities: CityWeather[]): void {
    this.storage.set(STORAGE_KEY, cities);
  }

  getCityWeather(index: number, city: string): any {
    const url = `${environment.openWeatherMapApiUrl}?q=${city}&appid=${environment.openWeatherMapToken}`;
    return this.http.get(url).toPromise();
  }

  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {
    let cities = this.storage.get(STORAGE_KEY);
    if (typeof(cities) === 'undefined') {
      cities = new Array(this.MaxCities);
      for (let i = 0; i < this.MaxCities; i++) {
        cities[i] = {id: i, city: '', error: ''};
      }
    }
    this.storeCities(cities);
  }
}
