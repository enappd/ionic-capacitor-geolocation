import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  coords: any;
  address: any;
  constructor(private nativeGeocoder: NativeGeocoder) { }
  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
    this.coords = coordinates.coords;
  }
  async reverseGeocode() {
    if (!this.coords) {
      const coordinates = await Geolocation.getCurrentPosition();
      this.coords = coordinates.coords;
    }
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(this.coords.latitude, this.coords.longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log(result);
        this.address = result[0];
      })
      .catch((error: any) => console.log(error));
  }
}
