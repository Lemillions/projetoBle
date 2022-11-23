import React, { useEffect } from 'react';
import Button from '@ant-design/react-native/lib/button';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import useBle from './useBle';


const App = () => {

  const { requestPermission, scanForDevices, allDevices, connectToDevice, isScanning, connectedDevice, disconnectDevice, sendData } = useBle();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  
  const scannear = () => {
    console.log('scannear');
    requestPermission((result: boolean) => {
      if (result) {
        scanForDevices();
      }
    });
  }


  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Button onPress={()=>{scannear()}} loading={isScanning} type="primary" >
        Scanear
      </Button>
      <View style={styles.dispositivosEncontrados}>
      {allDevices.map((device: Device) => (
        <Button onPress={()=>{connectToDevice(device)}} activeStyle={{ backgroundColor: 'green' }} key={device.id}>
          {device.name}
        </Button>
      ))}
      </View>
      {
        connectedDevice && (
          <View>
            <Text>Conectado a: {connectedDevice.name}</Text>
            <Button
              type="primary"
              onPress={() => sendData("SA==")}>
              Enviar Dados
            </Button>
            <Button onPress={()=>{disconnectDevice()}} type="warning" >
              Desconectar
            </Button>
          </View>
        )
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    paddingTop: 32,
  },
  dispositivosEncontrados: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  comandosTela: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'black',
  }
});

export default App;
