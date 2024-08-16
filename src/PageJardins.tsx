import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, Alert, Modal, FlatList, } from 'react-native';
import axios from 'axios';
import { CameraOptions, ImageLibraryOptions, MediaType, launchImageLibrary } from 'react-native-image-picker';
import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const API_KEY = 'PjPcIAE4O7wHqfiIwtZD1O7i6zTf6X4Unu0PTXfjJAQPwWfkMg';
const API_URL = 'https://plant.id/api/v3/health_assessment';

export default function HomeScreen() {
    const [imagemBase64, setImagemBase64] = useState<string | undefined>(undefined);
    const [latitude, setlatitude] = useState<number | undefined>(undefined);
    const [longitude, setlongitude] = useState<number | undefined>(undefined);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [saudavel, setSaudavel] = useState(0);
    const [isSaudavel, setIsSaudavel] = useState(false);
    const [nomeDoenca, setNomeDoenca] = useState();
    const [fotoDoenca, setFotoDoenca] = useState();
    const [probabilidadeDoenca, setProbabilidadeDoenca] = useState(0);
    const [similaridade, setSimilaridade] = useState(0);
 
    
    const requestLocationPermission = async () => {
        try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
            title: "Permissão para pegar sua localização",
            message: "O aplicativo precisa da localização para melhor precisão da planta",
            buttonNeutral: "Me pergunte depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permissão da localização dada");
            pegarLocalização();
        } else {
            console.log("Permissão da localização negada");
        }
        } catch (err) {
        console.warn(err);
        }
    };

    const requestCameraPermission = async () => {
        console.log(Geolocation)
        try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
            title: "Permissão do aplicativo da câmera",
            message: "O aplicativo precisa da permissão do uso da Câmera",
            buttonNeutral: "Me pergunte depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permissão da camera dada");
            tirarFoto();
        } else {
            console.log("Permissão da camera negada");
        }
        } catch (err) {
        console.warn(err);
        }
    };

    const selecionarImagem = () => {
        const options: ImageLibraryOptions = {
        mediaType: 'photo' as MediaType,
        includeBase64: true
        }

        launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            Alert.alert('Escolha cancelada', 'Usuário cancelou a escolha da imagem', [
            {
                text: 'cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
                style: 'default'
            }
            ])
        } else if (response.errorCode) {
            console.log('Erro na escolha da Imagem: ', response.errorMessage)
        } else if (response.assets && response.assets.length > 0) {
            setImagemBase64(response.assets[0].base64)
            console.log('Imagem: ' + response.assets[0].base64)
        }
        });
    };

    const tirarFoto = () => {
        const options: CameraOptions = {
        mediaType: 'photo',
        includeBase64: true
        }

        launchCamera(options, (response) => {
        if (response.didCancel) {
            Alert.alert('Foto Cancelada', 'Usuário cancelou a ação', [
            {
                text: 'cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
                style: 'default'
            }
            ])
        } else if (response.errorCode) {
            console.log('Erro na ação: ', response.errorMessage)
        } else if (response.assets && response.assets.length > 0) {
            setImagemBase64(response.assets[0].base64)
            console.log('Imagem: ' + response.assets[0].base64)
        }
        });
    }

    const pegarLocalização = () => {
        Geolocation.getCurrentPosition(
        (position) => {
            setlatitude(position.coords.latitude);
            setlongitude(position.coords.longitude);
        },
        (error) => {
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const mostrarSaude = () => {
        axios.post(API_URL, {
          'images': [`data:image/jpg;base64,${imagemBase64}`],
          'latitude': latitude,
          'longitude': longitude,
          'similar_images': true
        }, {
          headers: {
            "Api-key": API_KEY,
            "Content-Type": "application/json"
          }
        })
      .then(response => {
        console.log(response.data)
        if(response.data.result.is_healthy.probability*100 >= 50){
          setIsSaudavel(true)
        }else{
          setMostrarModal(true)
        }
        setNomeDoenca(response.data.result.disease.suggestions[0].name)
        setProbabilidadeDoenca(response.data.result.disease.suggestions[0].probability)
        setProbabilidadeDoenca(paramProbabilidade => paramProbabilidade*100)
        setFotoDoenca(response.data.result.disease.suggestions[0].similar_images[0].url)
        setSimilaridade(response.data.result.disease.suggestions[0].similar_images[0].similarity)
        setSimilaridade(paramSimilaridade => paramSimilaridade*100)
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
    }

    return (
        <View style={styles.body}>
          <Modal
            visible={mostrarModal}
          >
            <View
              style={styles.modalConteudo}
            >
              <TouchableOpacity
                onPress={() => {
                  setMostrarModal(false)
                }}
                style={styles.voltar}
              >
                <FontAwesome name="chevron-left" size={25} color={"#3A3A3A"}></FontAwesome>
              </TouchableOpacity>
              <View
              style={styles.conteudoModal}
              >
                <Image
                  style = {styles.imagemModal}
                  source={{
                    uri: fotoDoenca
                  }}
                ></Image>
                <Text>{nomeDoenca}</Text>
                <Text>{Math.trunc(similaridade)}%</Text> 
                <Text>{Math.trunc(probabilidadeDoenca)}%</Text>
              </View>
            </View>
          </Modal>
          <Modal
            visible={isSaudavel}
          >
            <View
              style={styles.modalConteudo}
            >
                <TouchableOpacity
                onPress={() => {
                  setIsSaudavel(false)
                }}
                style={styles.voltar}
              >
                <FontAwesome name="chevron-left" size={25} color={"#3A3A3A"}></FontAwesome>
              </TouchableOpacity>
              <Text style={{color:'green'}}>É saudável</Text>
            </View>
          </Modal>
          <Text style={{ color: "white" }}>{latitude}</Text>
          <TouchableOpacity
            onPress={selecionarImagem}
          >
            <Text>Selecionar Imagem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={requestCameraPermission}
          >
            <Text>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={requestLocationPermission}
          >
            <Text>Pegar Localização</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={mostrarSaude}
          >
            <Text>Mostrar Saude Da Planta</Text>
          </TouchableOpacity>
        </View>
      )
    }
    
    const styles = StyleSheet.create({
      body: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      },
      voltar: {
        position: 'absolute',
        left: 15,
        top: 50
      },
      modalConteudo: {
        backgroundColor: "white",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%"
      },
      conteudoModal: {
        backgroundColor: 'black'
      },
      imagemModal: {
        borderWidth: 2,
        borderColor: 'black',
        width:300,
        height: 300,
      }
    });
    