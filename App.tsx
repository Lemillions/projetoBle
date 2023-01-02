import React, { useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import useBle from './useBle';
import Slider from '@react-native-community/slider';



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

  const [velocidade, setVelocidade] = React.useState(0.5);
  const [pisca, setPisca] = React.useState(false);

  const ligarFarois = () => {
    pisca?sendData("Tw=="):sendData("UA==");
    setPisca(!pisca);
  }


  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Pressable onPress={() => { scannear() }} disabled={isScanning} style={styles.botaoPadrao}>
        <Text style={{ color: "white", fontWeight: "600", fontSize: 20 }}>
          Scanear
        </Text>
      </Pressable>
      <View style={styles.dispositivosEncontrados}>
        {allDevices.map((device: Device) => (
          <Pressable onPress={() => { connectToDevice(device) }} style={{ backgroundColor: '#059e1f', marginBottom: 10, padding:10, borderRadius:5 }} key={device.id}>
            <Text style={{ color: "white", fontWeight: "800" }}>
              {device.name ? device.name : device.id}
            </Text>
          </Pressable>
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
            <Text style={{ fontWeight: "800", fontSize: 16, color: "green" }} >
              Conectado a {connectedDevice?.name ? connectedDevice.name : connectedDevice?.id}
            </Text>
          </View>
          <View style={styles.linhaPiscaBuzina}>
              <Pressable
                onPressIn={() => sendData("Qg==")}
                onPressOut={() => sendData("Tg==")}
                style={{ backgroundColor: "yellow", borderRadius: 50, width: 50, height: 50, display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <Image
                  source={require('./buzina.png')}
                  style={{ width: 40, height: 40 }}
                />
              </Pressable>

              <Pressable
                onPressIn={() => {ligarFarois()}}
                style={pisca?{ backgroundColor: "red", borderRadius: 50, width: 50, height: 50, display: "flex", alignItems: "center" }:{ backgroundColor: "#DC143C", borderRadius: 50, width: 50, height: 50, display: "flex", alignItems: "center" }}
              >
                <Image
                  source={require('./hazard-light.png')}
                  style={{ width: 45, height: 45 }}
                />
              </Pressable>
            </View>
          <View style={styles.modalComandos}>
            <Pressable
              style={styles.botaoComando}
              onPressIn={() => sendData("OA==")}
              onPressOut={() => sendData("MA==")}
            >
              <Text style={{fontSize:26, fontWeight:"800", width:40, height:40, textAlign: 'center'}}>
              &uarr;
              </Text>
            </Pressable>
            <View style={styles.modalLinha}>
              <Pressable
                style={styles.botaoComando}
                onPressIn={() => sendData("NA==")}
                onPressOut={() => sendData("MA==")}
              >
                <Text style={{fontSize:26, fontWeight:"800", width:40, height:40, textAlign: 'center', marginBottom:2}}>
                &larr;
                </Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor: "red", borderRadius: 50, width: 50, height: 50, display: "flex", justifyContent: "center", alignItems: "center" }}
                onPress={() => sendData("MA==")}
              >
                <Text style={{fontSize:36, fontWeight:'700', color:"black"}}>
                &#x02298;
                </Text>
              </Pressable>
              <Pressable
                style={styles.botaoComando}
                onPressIn={() => sendData("Ng==")}
                onPressOut={() => sendData("MA==")}
              >
                <Text style={{fontSize:26, fontWeight:"800", width:40, height:40, textAlign: 'center', marginBottom:2}}>
                &rarr;
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.botaoComando}
              onPressIn={() => sendData("Mg==")}
              onPressOut={() => sendData("MA==")}
            >
              <Text style={{fontSize:26, fontWeight:"800", width:40, height:40, textAlign: 'center'}}>
              &darr;
              </Text>
            </Pressable>
          </View>

          <View style={{ width: "100%", padding: 20 }}>
            <Slider
              minimumValue={0.1}
              maximumValue={0.9}
              step={0.2} value={velocidade} onValueChange={(value) => {
                console.log(value.toFixed(1));
                setVelocidade(value);
                switch (value.toFixed(1)) {
                  case "0.1":
                    sendData("MQ==");
                    break;
                  case "0.3":
                    sendData("Mw==");
                    break;
                  case "0.5":
                    sendData("NQ==");
                    break;
                  case "0.7":
                    sendData("Nw==");
                    break;
                  case "0.9":
                    sendData("OQ==");
                    break;
                }
              }
              }
            />
          </View>

          <View style={{ padding: 10 }}>
            <Pressable onPress={() => { disconnectDevice() }} style={{ backgroundColor: "red", borderRadius:10, padding:14 }}>
              <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
                Desconectar
              </Text>
            </Pressable>
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
  botaoPadrao: {
    backgroundColor: '#18a0fb',
    padding: 12,
    borderRadius: 10,
  },
  botaoComando: {
    backgroundColor: "#18a0fb",
    borderRadius: 25,
    padding: 5,
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
  linhaPiscaBuzina: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
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
