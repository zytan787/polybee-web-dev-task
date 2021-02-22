import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {WeatherDataService} from '../weather-data.service';
import {interval, Subscription} from 'rxjs';
import {CityWeather} from '../cityWeather';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  cities: CityWeather[];
  editCity = Array(this.weatherDataService.MaxCities).fill(false);

  showForm(index: number): void {
    if (this.cities[index].weather) {
      return;
    }
    const form = document.getElementById(`form-${index}`);
    if (form != null) {
      form.classList.remove('hidden');
    }
  }

  changeCity(index: number): void {
    this.cities[index] = {id: index, city: this.cities[index].city, error: ''};
    this.editCity[index] = true;
  }

  async updateCityWeather(index: number): Promise<any> {
    const inputField = document.getElementById(`cityname-${index}`) as HTMLInputElement;
    if (inputField !== null) {
      const city = inputField.value;
      try {
        this.weatherDataService.getCityWeather(index, city as string)
          .then((resp: any) => {
            if (resp.hasOwnProperty('weather')) {
              try {
                const weatherData = resp.weather[0];
                this.cities[index] = {id: index, city: resp.name, weather: weatherData, error: ''};
                this.weatherDataService.storeCities(this.cities);
              } catch (e) {
                this.cities[index] = {id: index, city, error: 'Error extracting weather from the response'};
                this.weatherDataService.storeCities(this.cities);
              }
            } else {
              this.cities[index] = {id: index, city, error: resp.message};
              this.weatherDataService.storeCities(this.cities);
            }
          })
          .catch((err: any) => {
            this.cities[index] = {id: index, city, error: err.error.message};
            this.weatherDataService.storeCities(this.cities);
          });
      } catch (e) {
        this.cities[index] = {id: index, city, error: e.message};
        this.weatherDataService.storeCities(this.cities);
      }
    }
    this.editCity[index] = false;
  }

  update(): void {
    console.log('running update...');
    for (let i = 0; i < this.weatherDataService.MaxCities; i++) {
      const city = this.cities[i];
      if (city.city && !city.error) {
        this.updateCityWeather(i);
        console.log('Updated!');
      }
    }
  }

  constructor(
    private weatherDataService: WeatherDataService,
  ) {
    this.cities = this.weatherDataService.getCities();
  }

  ngOnInit(): void {
    const source = interval(30000);
    this.subscription = source.subscribe(val => this.update());
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
