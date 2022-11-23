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
    isScanning: boolean;
    connectedDevice: Device | null;
    disconnectDevice: () => void;
    sendData: (date: string) => void;
}


export default function useBle():BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([])
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null) 
    const [isScanning, setIsScanning] = useState<boolean>(false)

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
        manager.startDeviceScan(null, null, (error, device) => {
            setIsScanning(true)
            if (error) {
                console.log("Ocorreu um erro durante o scan", error);
                setIsScanning(false);
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
        try {
            console.log('Conectado a ', device);
            const deviceConnection = await manager.connectToDevice(device.id)
            setConnectedDevice(deviceConnection)
            setIsScanning(false)
            console.log('Conectado a ', device);
            manager.stopDeviceScan()
        }
        catch (error) {
            console.log("Ocorreu um erro ao conectar ao dispositivo", error)
        } 
    }

    const disconnectDevice = async () => {
        try {
            if (connectedDevice) {
                await manager.cancelDeviceConnection(connectedDevice.id)
                setConnectedDevice(null)
            }
        }
        catch (error) {
            console.log("Ocorreu um erro ao desconectar do dispositivo", error)
        }
        finally {
            setConnectedDevice(null)
        }
    }
    
    // send data to device arduino module bluetooth hm10
    const sendData = async (data: string) => {
        try {
            if (connectedDevice) {
                await manager.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id)
                await connectedDevice.writeCharacteristicWithResponseForService(
                    '0000ffe0-0000-1000-8000-00805f9b34fb',
                    '0000ffe1-0000-1000-8000-00805f9b34fb',
                    data
                ).then((characteristic) => {
                    console.log('Enviado com sucesso', characteristic.value);
                })
                .catch((error) => {
                    console.log('Erro ao enviar', error);
                })
            }
        }
        catch (error) {
            console.log("Ocorreu um erro ao enviar dados para o dispositivo", error)
        }
    }


    return { requestPermission, scanForDevices, allDevices, connectToDevice, isScanning, connectedDevice, disconnectDevice, sendData };

}