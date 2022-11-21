import { useState } from 'react';
import { PermissionsAndroid } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'
const manager = new BleManager()

type PermissionCallback = (result:boolean) => void;

interface BluetoothLowEnergyApi {
    requestPermission: (callback: PermissionCallback) => Promise<void>;
    scanForDevices: () => void;
    allDevices: Device[];
    connectToDevice: (device: Device) => Promise<void>;
}


export default function useBle():BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([])
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null) 

    const requestPermission = async (callback:PermissionCallback) => {
        // ...
        const grantedStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permissçaõ de localização',
                message: 'Bluetooth low energy precisa da permissão de localização',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancelar',
                buttonNeutral: 'Mais tarde',
            }
        );
        callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    }

    const duplicateDevice = (devices:Device[], nextDevice:Device) => {
        return devices.findIndex((device) => device.id === nextDevice.id) > -1
    }


    const scanForDevices = () => {
        console.log('scanning for devices')
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log("Ocorreu um erro durante o scan", error);
                return;
            }
            if (device) {
                setAllDevices((devices) => {
                    if (!duplicateDevice(devices, device)) {
                        return [...devices, device]
                    }
                    return devices
                }
                )
            }
        });
    }

    const connectToDevice = async (device:Device) => {
        console.log('Conectando a ', device.name);
        try {
            const deviceConnection = await manager.connectToDevice(device.id)
            setConnectedDevice(deviceConnection)
            manager.stopDeviceScan()
        }
        catch (error) {
            console.log("Ocorreu um erro ao conectar ao dispositivo", error)
        } 
    }

    return { requestPermission, scanForDevices, allDevices, connectToDevice };

}