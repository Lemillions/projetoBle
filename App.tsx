import React, { useEffect } from 'react';
import Button from '@ant-design/react-native/lib/button';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import useBle from './useBle';


const App = () => {

  const { 
    requestPermission,
    scanForDevices, 
    allDevices, 
    connectToDevice,
    isScanning, 
    connectedDevice, 
    disconnectDevice, 
    sendData 
  } = useBle();
  
  const scannear = () => {
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
        <Button onPress={()=>{connectToDevice(device)}} style={{ backgroundColor: '#059e1f', marginBottom: 10 }} key={device.id}>
          <Text style={{ color:"white", fontWeight:"800"}}>
            {device.name? device.name : device.id}
          </Text>
        </Button>
      ))}
      </View>

      <Modal
        animationType="slide"
        visible={connectedDevice !== null}
        onRequestClose={() => {
          disconnectDevice();
        }}
        style={styles.modal}
      >
        <View style={styles.modalView}>
          <View>
            <Text style={{fontWeight: "800", fontSize: 16, color: "green"}} >
              Conectado a {connectedDevice?.name? connectedDevice.name : connectedDevice?.id}
            </Text>
          </View>
          
          <View style={styles.modalComandos}>
            <Button
              type="primary"
              onPress={() => sendData("OA==")}
            >
              &uarr;
            </Button>
            <View style={styles.modalLinha}>
            <Button
              type="primary"
              onPress={() => sendData("NA==")}
            >
              &larr;
            </Button>
            <Button
              type="warning"
              onPress={() => sendData("NQ==")}
            >
              &#x02298;
            </Button>
            <Button
              type="primary"
              onPress={() => sendData("Ng==")}
            >
              &rarr;
            </Button>
            </View>
            <Button
              type="primary"
              onPress={() => sendData("Mg==")}
            >
              &darr;
            </Button>
          </View>

          <View style={{padding:10}}>
            <Button onPress={()=>{disconnectDevice()}} type="warning" size='large' >
              Desconectar
            </Button>
          </View>
          
        </View>
      </Modal>
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
  modal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'black',
    height: '100%',
  },
  modalView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalComandos: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: 20,
    height: '50%',
  },
  modalLinha: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  }
});

export default App;
