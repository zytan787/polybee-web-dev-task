import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {WeatherDataService} from '../weather-data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  modalRef: BsModalRef = new BsModalRef<any>();
  cities = this.weatherDataService.getCities();
  dismissible = true;

  openModal(template: TemplateRef<any>, index: number): void {
    this.modalRef = this.modalService.show(template);
    const inputField = document.getElementById(`cityname-${index}`);
    if (inputField !== null) {
      inputField.focus();
    }
  }

  getCityWeather(index: number): void {
    this.updateCityWeather(index);
    this.modalRef.hide();
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
                const weatherDesc = resp['weather'][0]['main'];
                switch (weatherDesc) {
                  case 'Thunderstorm':
                  case 'Drizzle':
                  case 'Rain':
                    this.cities[index] = {city: resp['name'], weather: 'rainy', error: ''};
                    break;
                  case 'Clear':
                    this.cities[index] = {city: resp['name'], weather: 'sunny', error: ''};
                    break;
                  case 'Clouds':
                    this.cities[index] = {city: resp['name'], weather: 'cloudy', error: ''};
                    break;
                  default:
                    this.cities[index] = {city, weather: '', error: 'Weather is not rainy/sunny/cloudy'};
                    break;
                }
              } catch (e) {
                this.cities[index] = {city, weather: '', error: 'Error extracting weather from the response'};
              }
            } else {
              this.cities[index] = {city, weather: '', error: resp['message']};
            }
          })
          .catch((err: any) => {
            this.cities[index] = {city, weather: '', error: err['error']['message']};
          });
      } catch (e) {
        this.cities[index] = {city, weather: '', error: e.message};
      }
    }
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
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    const source = interval(30000);
    this.subscription = source.subscribe(val => this.update());
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
