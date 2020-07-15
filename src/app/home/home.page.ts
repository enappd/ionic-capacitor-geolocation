import { Component, NgZone } from '@angular/core';
import { Capacitor, Plugins } from "@capacitor/core";
import { LocationService } from '../location.service';
const { Geolocation, Toast } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lat: any;
  lng: any;
  watchId: any;
  constructor(public ngZone: NgZone, private locationService: LocationService) {
    this.lat = 12.93448;
    this.lng = 77.6192;
  }

  async getMyLocation() {
    const hasPermission = await this.locationService.checkGPSPermission();
    if (hasPermission) {
      if (Capacitor.isNative) {
        const canUseGPS = await this.locationService.askToTurnOnGPS();
        this.postGPSPermission(canUseGPS);
      }
      else { this.postGPSPermission(true); }
    }
    else {
      const permission = await this.locationService.requestGPSPermission();
      if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
        if (Capacitor.isNative) {
          const canUseGPS = await this.locationService.askToTurnOnGPS();
          this.postGPSPermission(canUseGPS);
        }
        else { this.postGPSPermission(true); }
      }
      else {
        await Toast.show({
          text: 'User denied location permission'
        })
      }
    }
  }

  async postGPSPermission(canUseGPS: boolean) {
    if (canUseGPS) { this.watchPosition(); }
    else {
      await Toast.show({
        text: 'Please turn on GPS to get location'
      })
    }
  }

  async watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        this.ngZone.run(() => {
          if (err) { console.log('err', err); return; }
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude
          this.clearWatch();
        })
      })
    }
    catch (err) { console.log('err', err) }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }
}
