// Common functions for geolocation functionality
// This file can be copied to any of the modules and can be used as such
// These functions use two ionic native plugins
// 1. Android permissions plugin
// 2. Location accuracy plugin
// Make sure you install these plugins in the Capacitor way, before using these functionalities in your Capacitor app

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Capacitor } from "@capacitor/core";

const LocationService = {

    askToTurnOnGPS: async (): Promise<boolean> => {
        return await new Promise((resolve, reject) => {
            LocationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => {
                            console.log('1');
                            resolve(true);
                        },
                        error => {
                            resolve(false);
                            console.log('Error requesting location permissions', error)
                        }
                    );
                }
                else {
                    resolve(false);
                    console.log('Error requesting location permissions')
                }

            });
        })
    },
    // Check if application having GPS access permission
    checkGPSPermission: async (): Promise<boolean> => {
        return await new Promise((resolve, reject) => {
            if (Capacitor.isNative) {
                AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                    result => {
                        console.log(result);
                        if (result.hasPermission) {
                            // If having permission show 'Turn On GPS' dialogue
                            console.log('has permission');
                            resolve(true);
                        } else {
                            // If not having permission ask for permission
                            console.log('has no permission');
                            resolve(false);
                        }
                    },
                    err => {
                        alert(err);
                    }
                );
            }
            else {
                resolve(true);
            }
        })
    },

    requestGPSPermission: async (): Promise<string> => {
        return await new Promise((resolve, reject) => {
            LocationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    console.log('can request');
                    resolve('CAN_REQUEST');
                } else {
                    // Show 'GPS Permission Request' dialogue
                    AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                        .then(
                            (result) => {
                                console.log(result);
                                if (result.hasPermission) {
                                    // call method to turn on GPS
                                    console.log('got permission');
                                    resolve('GOT_PERMISSION');
                                } else {
                                    console.log('denied permission');
                                    resolve('DENIED_PERMISSION');
                                }
                            },
                            error => {
                                // Show alert if user click on 'No Thanks'
                                alert('requestPermission Error requesting location permissions ' + error);
                            }
                        );
                }
            });
        })

    }
}
export default LocationService;
