import React, { useEffect } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import useBle from './useBle';


const App = () => {

  const { requestPermission, scanForDevices, allDevices, connectToDevice } = useBle();
  
  const scannear = () => {
    console.log('scannear');
    requestPermission((result: boolean) => {
      if (result) {
        scanForDevices();
      }
    });
  }
  useEffect(() => {
    console.log('allDevices', allDevices);
  }, [allDevices])

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Pressable style={styles.sectionTitle} onPress={()=>{scannear()}}>
        <Text>Scanear</Text>
      </Pressable>
      {allDevices.map((device: Device) => (
        <Pressable key={device.id} onPressIn={()=>{connectToDevice(device)}} style={styles.sectionTitle}>
          <Text key={device.id}>{device.name}</Text>
        </Pressable>
      ))}
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
  },
  sectionTitle: {
    padding: 10,
    backgroundColor: "blue"
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
