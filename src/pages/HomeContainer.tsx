
import React, { Component } from 'react';
import HomeView from './HomeView';
import { Capacitor, Plugins, CallbackID } from "@capacitor/core";
import LocationService from './Location';

const { Geolocation, Toast } = Plugins;

class HomeContainer extends Component {
    state: any;
    watchId: CallbackID = '';
    constructor(props: any) {
        super(props);
        this.state = {
            center: {
                lat: 12.934485599999999,
                lng: 77.6192336,
            },
            latitude: 18.934485599999999,
            longitude: 87.6192336,
            loading: false
        };
    }

    checkPermissions = async () => {
        const hasPermission = await LocationService.checkGPSPermission();
        if (hasPermission) {
            if (Capacitor.isNative) {
                const canUseGPS = await LocationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else {
                this.postGPSPermission(true);
            }
        }
        else {
            console.log('14');
            const permission = await LocationService.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNative) {
                    const canUseGPS = await LocationService.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                }
                else {
                    this.postGPSPermission(true);
                }
            }
            else {
                await Toast.show({
                    text: 'User denied location permission'
                })
            }
        }
    }

    postGPSPermission = async (canUseGPS: boolean) => {
        if (canUseGPS) {
            this.watchPosition();
        }
        else {
            await Toast.show({
                text: 'Please turn on GPS to get location'
            })
        }
    }

    watchPosition = async () => {
        try {
            this.setState({
                loading: true
            })
            this.watchId = Geolocation.watchPosition({}, (position, err) => {

                if (err) {
                    return;
                }
                this.setState({
                    center: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    loading: false
                }, () => {
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
        this.setState({
            loading: false
        })
    }
    render() {
        const { center, loading } = this.state
        return (
            <HomeView
                center={center}
                latitude={center.lat}
                longitude={center.lng}
                getGeoLocation={this.checkPermissions}
                loading={loading}
            />
        );
    }
}

export default HomeContainer;