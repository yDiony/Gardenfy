import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, Alert, Modal, FlatList, TextInput, DimensionValue } from 'react-native';
import axios from 'axios';
import { CameraOptions, ImageLibraryOptions, MediaType, launchImageLibrary } from 'react-native-image-picker';
import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Jardins from './Jardins';

type PlantasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Plantas'>;
type PlantasScreenRouteProp = RouteProp<RootStackParamList, 'Plantas'>;
type RootStackParamList = {
  Plantas: {item: {id: number, name: string}};
  jardins: undefined;
};
type Props = {
  navigation: PlantasScreenNavigationProp;
  route: PlantasScreenRouteProp;
};

export default function Plantas({ navigation, route }: Props) {
  const [modal1, setmodal1] = useState(false);
  const [modal2, setmodal2] = useState(false);
  const [displaybotao, setdisplaybotao] = useState(false);
  const [plantas, setplantas] = useState<String | any>([]);
  const [imagemBase64, setImagemBase64] = useState<string | undefined>(undefined);
  const [latitude, setlatitude] = useState<number | undefined>(undefined);
  const [longitude, setlongitude] = useState<number | undefined>(undefined);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accessToken, setAccessToken] = useState();
  const [dadosPlanta, setDadosPlanta] = useState<String | any>([]);
  const [imagemPlanta, setImagemPlanta] = useState<string | undefined>(undefined);
  const [respRega, setRespRega] = useState<any>('');
  const [varnivelagua, setvarnivelagua] = useState();
  const API_URL = 'https://plant.id/api/v3/identification';
  const API_KEY = 'waxKzALAxHxNaNswxY04rDCjBQ1c7LjqeBhuBypIW05f76a3WL';
  const [frequencia, setfrequencia] = useState<string>("");
  const [idAtual, setIdAtual] = useState(0);

  const { item } = route.params;


  useEffect(() => {
    const sethorario = setInterval(() => {
      setDadosPlanta((param: any[]) => param.map((plantas: any) => {
          if(plantas.horas == 0 && plantas.minutos == 0 && plantas.segundos == 0){
            return plantas;
          }

          let {horas, minutos, segundos} = plantas;

          if(segundos > 0){
            segundos -= 1
          }else if(minutos > 0){
            minutos -= 1;
            segundos = 59;
          }else if(horas> 0){
            horas -= 1;
            minutos = 59;
            segundos = 59;
          }

          return {...plantas, horas, minutos, segundos}
        })
      )
    }, 1000)
    return () => clearInterval(sethorario);
}, [])

  const adicionarPlanta = () => {
    setdisplaybotao(true);
    setmodal2(false);
   // chatBot1();
  };

  const getBarraStyle = (nivelAgua: number) => {
    
    const nivel = `${nivelAgua * 10}%` as DimensionValue;
    return {
      width: nivel,

    };
  };
  const getBarraStyle2 = (nivelLuz: number) => {
    
    const nivel = `${nivelLuz * 10}%` as DimensionValue;
    return {
      width: nivel,

    };
  };
 
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const nomeDaPlanta =() => {
    axios.post(`${API_URL}?details=common_names,watering,best_light_condition,best_watering`, {
      "images": imagemBase64,
      "latitude": latitude,
      "longitude": longitude,
      "similar_images": true
    },
      {
        headers: {
          "Api-key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log(response.data.result)
        console.log(response.data.result.classification.suggestions[0].details)
        if (response.data.result.is_plant.binary != true) {
          Alert.alert('Foto Não Corresponde', 'A foto não contém plantas', [
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
        } else {
          setAccessToken(response.data.access_token)
        }
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      });
  }

  const chatBot6 = () => {
    axios.post(`${API_URL}/${accessToken}/conversation`, {
      "question": "What is the common name of this plant in portuguese. Answer just with the name",
    },
      {
        headers: {
          "Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        const frequenciaHoras = parseInt(frequencia) * 24;
        const horasDesdeUltimaRega = parseInt(respRega) * 1;
        const tempoRestante = frequenciaHoras - horasDesdeUltimaRega;
        setDadosPlanta([...dadosPlanta, { id: dadosPlanta.length + 1, nome: response.data.messages[11].content, nivelLuz: response.data.messages[1].content, nivelAgua: response.data.messages[3].content, horasSol: response.data.messages[5].content, quantAgua: response.data.messages[7].content, frequencia: response.data.messages[9].content, imagem: imagemPlanta, horas : tempoRestante, minutos: 0, segundos: 0}])
        setIdAtual( param => param+1)
        adicionarPlanta();
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
  }

  const chatBot5 = () => {
    axios.post(`${API_URL}/${accessToken}/conversation`, {
      "question": "How many ml each watering this plant needs? Answer only with numbers with ml in the end.",
    },
      {
        headers: {
          "Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
      
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
  }

  const chatBot4 = () => {
    axios.post(`${API_URL}/${accessToken}/conversation`, {
      "question": "how often should you water this plant? answer just with number of days.",
    },
      {
        headers: {
          "Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        setfrequencia(response.data.messages[7].content);
        chatBot5();
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
  }

  const chatBot3 = () => {
    axios.post(`${API_URL}/${accessToken}/conversation`, {
      "question": "How many hours this plant needs in solar light in a day? Answer with 2 numbers, and in portuguese.",
    },
      {
        headers: {
          "Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
 
        chatBot4();
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
  }

  const chatBot2 = () => {
    axios.post(`${API_URL}/${accessToken}/conversation`, {
      "question": "How much water this plant needs? Answer with just one number from 0 to 10, and in portuguese.",
    },
      {
        headers: {
          "Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        chatBot3();
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
  }

  const chatBot1 = () => {
    //pergunta 1
    axios.post(`${API_URL}/${accessToken}/conversation`, {
      "question": "How much light this plant needs? Answer with just one number from 0 to 10.",
      "prompt": "Responda as perguntas em português"
    },
      {
        headers: {
          "Api-Key": API_KEY,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        chatBot2();
      })
      .catch(error => {
        console.log("Deu erro: ", error.response ? error.response.data : error.message);
        if (error.response) {
          console.log("Status do erro: ", error.response.status);
          console.log("Headers do erro: ", error.response.headers);
        }
      })
  }

   useEffect(() => {
     if (accessToken != undefined) {
     chatBot1();
     }
   }, [accessToken]); 


  useEffect(() => {
    if (dadosPlanta != undefined) {
      console.log(dadosPlanta)
    }
  }, [])

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
        setImagemPlanta(response.assets[0].uri)
        setmodal1(false);
        setmodal2(true);
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
        setImagemPlanta(response.assets[0].uri)
        setImagemBase64(response.assets[0].base64)
        nomeDaPlanta();
        setmodal1(false);
        setmodal2(true);
      }
    });
  }

  const renderizarplanta = ({ item }: { item: any }) => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.planta}>
        <View style={styles.imgplanta}>
          <Image source={{uri: item.imagem}} style={styles.imgplanta}></Image>
        </View>
        <View style={styles.infoplanta}>
          <View style={{ flexDirection: 'row', width: 231, justifyContent: 'space-between' }}>
            <Text style={styles.nomeplanta}>{item.id} - {item.nome}</Text>
          </View>
          <View>
            <View style={styles.grupoestatisticas}>
              <FontAwesome name="calendar" size={13} style={{ marginLeft: 2, }}></FontAwesome>
              <Text style={{ marginLeft: 7, fontFamily: 'Lexend-VariableFont_wght', fontSize: 13 }}>{item.horas}:{item.minutos}:{item.segundos} </Text>
            </View>
            <View style={[styles.grupoestatisticas, { justifyContent: 'space-between' }]}>
              <FontAwesome name="tint" size={16} style={{marginLeft: 2, }}></FontAwesome>
              <View style={[styles.barrasestatisticas]}>
              <View style={[getBarraStyle(item.nivelAgua),{backgroundColor: 'white', position: 'absolute', height: '100%'}]}>

              </View>
              </View>
              <Text style={{marginLeft: 5, color: 'white'}}>{item.frequencia}</Text>
            </View>
            <View style={[styles.grupoestatisticas, { justifyContent: 'space-between' }]}>
              <FontAwesome name="sun-o" size={13}></FontAwesome>
              <View style={styles.barrasestatisticas}>
                <View style={[getBarraStyle2(item.nivelLuz),{backgroundColor: 'white', position: 'absolute', height: '100%'}]}>

                </View>
               
              </View>
              <Text style={{marginLeft: 5, color: 'white'}}>{item.horasSol}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    if(imagemBase64 != undefined){
      nomeDaPlanta();
    }
  }, [imagemBase64])

  return (
    <View style={styles.page}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: 25 }} onPress={() => {
          navigation.replace('jardins');
        }}>
          <FontAwesome name="chevron-left" size={25} color={"#3A3A3A"}></FontAwesome>
        </TouchableOpacity>
        <Text style={{ fontFamily: "InriaSans-Bold", fontSize: 32, color: "black", marginTop: 15 }}>{item.name}</Text>
      </View>
      <Text style={{ fontFamily: "InriaSans-Bold", fontSize: 20, color: "#90C8BB", marginTop: 50, marginLeft: 12 }}>Plantas no jardim</Text>
      <Modal visible={modal2} transparent={true}>
        <View style={styles.modalconfirmarplanta}>
          <TouchableOpacity style={styles.fecharmodalnoclick} onPress={() => { setmodal1(false) }}>
          </TouchableOpacity>
          <View style={[styles.cardmodal, {justifyContent: 'space-evenly', minHeight: '46%'}]} >
            <Image style={{ height: '40%', width: '80%', marginTop: 12, borderRadius: 8 }} source={{uri: imagemPlanta}}>
            </Image>
              <Text style={styles.perguntaRega}>Faz quantas horas desde que você regou esta planta?(aprox)</Text>
              <TextInput
              value={respRega}
              onChangeText={setRespRega}
              keyboardType="numeric"
              maxLength={3}
              placeholder='Ex: 7'
              placeholderTextColor={'#90C8BB'}
              style={styles.InputRega}
              >
              </TextInput>
              <TouchableOpacity style={styles.botaoAdicionarplanta} onPress={chatBot6}>
                <Text style={{ color: "white", fontFamily: "Lexend-VariableFont_wght", fontSize: 16 }}>Adicionar Planta</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={modal1} transparent={true}>
        <View style={styles.modaladicionarplantas} >
          <TouchableOpacity style={styles.fecharmodalnoclick} onPress={() => { setmodal1(false) }}>
          </TouchableOpacity>
          <View style={[styles.cardmodal, {height: '46%'}]} >
            <View style={{ backgroundColor: '#90C8BB', height: '40%', width: '80%', marginTop: 12, borderRadius: 8 }}>
            </View>
            <View style={styles.Botoes}>
              <TouchableOpacity style={styles.botao3} onPress={tirarFoto}>
                <Text style={[styles.textoBotoesModal1, { color: '#90C8BB' }]}>Tirar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoTrocar} onPress={selecionarImagem}>
                <Text style={[styles.textoBotoesModal1, { color: '#90C8BB' }]}>Selecionar imagem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoCancelar} onPress={() => { setmodal1(false) }}>
                <Text style={[styles.textoBotoesModal1, { color: '#FF7878' }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.conteudo}>
        <FlatList
          data={dadosPlanta}
          renderItem={renderizarplanta}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 320 }}
        ></FlatList>
        <View style={[styles.cardsemjardins]}>
          <TouchableOpacity style={styles.botaocardsemjardim}
            onPress={() => { setmodal1(true) }}>
            <FontAwesome name="plus" size={18} color={'white'} style={{ position: "absolute", left: 22 }}></FontAwesome>
            <Text style={{ color: "white", fontFamily: "Lexend-VariableFont_wght", fontSize: 16 }}>Adicionar planta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
  conteudo: {
    flex: 1,
    alignItems: 'center'
  },
  cardsemjardins: {
    width: '90%',
    height: '10%',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 7,
  },
  iconsemjardim: {
    width: 58,
    height: 58,
    marginTop: 28,
  },
  textocardsemjardim: {
    color: '#9D9292',
    fontSize: 20,
    fontFamily: "InriaSans-Bold",
    marginTop: 19,
    textAlign: 'center',
  },
  botaocardsemjardim: {
    marginTop: 9,
    width: '100%',
    height: 40,
    backgroundColor: "#90C8BB",
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',
  },
  fecharmodalnoclick: {
    height: '100%',
    width: '100%',
    position: "absolute",
  },
  modaladicionarplantas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  cardmodal: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#90C8BB',
    alignItems: 'center'
  },
  botaomodaladicionarplanta: {
    width: 246,
    height: 41,
    backgroundColor: '#90C8BB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  botaoCancelar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FF7878',
    backgroundColor: "white",
    borderWidth: 2,
    width: 300,
    height: 50,
    borderRadius: 7
  },
  botao3: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#76BDAC',
    backgroundColor: "white",
    borderWidth: 2,
    width: 300,
    height: 50,
    borderRadius: 7
  },
  textoBotoesModal1: {
    fontSize: 18,
    fontFamily: 'Lexend-VariableFont_wght',
    fontWeight: '900'
  },
  Botoes: {
    marginTop: 15
  },
  botaoTrocar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#76BDAC',
    backgroundColor: "white",
    borderWidth: 2,
    width: 300,
    height: 50,
    borderRadius: 7,
    marginBottom: 10,
    marginTop: 10
  },
  planta: {
    marginTop: 10,
    flexDirection: 'row',
    height: 90,
    width: '97%',
    justifyContent: 'space-between'
  },
  imgplanta: {
    width: 82,
    height: 90,
    borderRadius: 11,
  },
  infoplanta: {
    backgroundColor: '#90C8BB',
    width: '75%',
    borderRadius: 11,
  },
  nomeplanta: {
    fontFamily: 'InriaSans-Bold',
    fontSize: 19.50,
    color: 'white',
    marginLeft: 8,

  },
  grupoestatisticas: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 3,
    width: '60%',
    marginLeft: 8,
  },
  barrasestatisticas: {
    width: '80%',
    height: '50%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    marginLeft: 5,
  },
  tamanhodaplanta: {
    color: 'white',
    fontSize: 12,
  },
  modalconfirmarplanta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  perguntaRega: {
    width: '80%',
    color: 'black',
    fontFamily: 'InriaSans-Bold'
  },
  InputRega: {
    width: '80%',
    padding: 7,
    borderColor: '#90C8BB',
    borderWidth: 1,
    borderRadius: 4,
    color: '#90C8BB',
  },
  botaoAdicionarplanta: {
    width: '95%',
    backgroundColor: '#90C8BB',
    borderRadius: 3,
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center'
  }

});