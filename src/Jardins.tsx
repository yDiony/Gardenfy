import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Button,
  TextInput,
  Modal,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Jardins({ navigation }: { navigation: any }) {
  const [modal1, setmodal1] = useState(false);
  const [nomejardim, setnomejardim] = useState("");
  const [jardins, setjardins] = useState<String | any>([]);
  const [displaybotao, setdisplaybotao] = useState(false);
  const [botaofavoritarfundo, setbotaofavoritarfundo] = useState(false);
  const [conticones, setconticones] = useState(0);
  const [jardim, setjardim] = useState({"nome": "","imagem": "", "local": "",})

  const iconesjardins = [require("../assets/images/icones/iconvasodeplantas1.png"), require("../assets/images/icones/icone2.png"), require("../assets/images/icones/icone3.png"), require("../assets/images/icones/icone4.png")];

  

  const mudaricone = () => {
    if(conticones >= 3){
    setconticones(0);
    }else{
      setconticones(param => param+1)

    }
  }

  const mudaricone2 = () => {
    if(conticones <= 0){
    setconticones(3);
    }else{
      setconticones(param => param-1)

    }
  }

  const favoritarfundo = () => {
    if (botaofavoritarfundo){
      setbotaofavoritarfundo(false)   
    }
    else {
      setbotaofavoritarfundo(true)
    };


  }

  const adicionarJardim = () => {
    if (nomejardim.trim() !== "") {
      setjardins([...jardins, { id: Date.now().toString(), name: nomejardim, imagem: iconesjardins[conticones]}]);
      setnomejardim("");
      setdisplaybotao(true);
      setmodal1(false);
      setconticones(0);
    }
  };


  const renderizarjardim = ({ item }: { item: any }) => (
    <View style={styles.divjardim}>
      <TouchableOpacity style={styles.cardjardim} onPress={() => {
          navigation.navigate('plantas', {item: item})
        }}>
        <View style={styles.divcardconteudo}>
          <View style={styles.diviconjardim}>
          <Image source={item.imagem} style={styles.iconejardim}></Image>
          </View>
          <View style={styles.informacoesjardim}>
          <Text style={styles.nomejardim}>{item.name}</Text>
            <View>
            <View style={styles.grupoestatisticas}>
            <FontAwesome name="calendar" size={13} style={{marginLeft: 2,}}></FontAwesome>
            <Text style={{marginLeft: 7, fontFamily: 'Lexend-VariableFont_wght', fontSize: 13}}>notfound</Text>
            </View>
            <View style={[styles.grupoestatisticas, {justifyContent: 'space-between'}]}>
            <FontAwesome name="tint" size={16} style={{marginLeft: 2,}}></FontAwesome>
            <View style={styles.barrasestatisticas}>
            </View>
            </View>
            <View style={[styles.grupoestatisticas, {justifyContent: 'space-between'}]}>
            <FontAwesome name="sun-o" size={13}></FontAwesome>
            <View style={styles.barrasestatisticas}>
            </View>
            </View>
            </View>       
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.page}>
      <Image
        source={require("../assets/images/Fundoplantas.png")}
        style={styles.backgroundImage}
      />
      <Modal visible={modal1} transparent={true}>
        <View style={styles.modaladicionarjardins} >
          <TouchableOpacity style={styles.fecharmodalnoclick} onPress={() => {setmodal1(false)}}>
          </TouchableOpacity>
          <View style={styles.cardmodal} >
            
          <View style={styles.divselecionaricone}>
            <TouchableOpacity onPress={mudaricone2}>
          <FontAwesome
              name="chevron-left"
              size={20}
              color={"#76BDAC"}
              style={{marginRight: 18}}
              ></FontAwesome>
              </TouchableOpacity>
            <View style={{backgroundColor: '#90C8BB', width: 107, height: 87, alignItems: 'center', justifyContent: 'center', borderRadius: 5}}>
             <Image source={iconesjardins[conticones]} style={styles.iconesselecionaveis}></Image>
            </View>
            <TouchableOpacity onPress={mudaricone}>
          <FontAwesome name="chevron-right" size={20} color={"#76BDAC"}style={{marginLeft: 18}}></FontAwesome>
            </TouchableOpacity>
          
          </View>
          <View style={styles.divnomejardim}>
        <TextInput style={styles.inputnomejardim}
          placeholder="Nome do Jardim"
          value={nomejardim}
          onChangeText={setnomejardim}
          placeholderTextColor={'#76BDAC'}
          />
          </View>
          <View style={styles.divinternoexterno}>
            <View style={styles.divinterno}>
              <Text style={{fontFamily: "InriaSans-Bold", fontSize: 15.06}}>INTERNO</Text>
            </View>
            <View style={styles.divexterno}>
            <Text style={{fontFamily: "InriaSans-Bold", fontSize: 15.06, color: "#90C8BB"}}>EXTERNO</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.botaomodaladicionarjardim} onPress={adicionarJardim}>
            <Text style={{fontFamily: "Lexend-VariableFont_wght", fontSize: 15}}>Criar jardim</Text>
          </TouchableOpacity>
          </View>
       
        </View>
      </Modal>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Jardins</Text>

        <View style={styles.grupofiltros}>
          <TouchableOpacity style={styles.ordenarpor}>
            <Text style={{ color: "black", marginTop: 2 }}>Ordenar por</Text>
            <FontAwesome
              name="chevron-down"
              size={13}
              color={"#76BDAC"}
              style={{ margin: 5, marginRight: 2 }}
            ></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filtrarpor}>
            <Text style={{ color: "black", marginTop: 2 }}>Filtrar por</Text>
            <FontAwesome
              name="chevron-down"
              size={13}
              color={"#76BDAC"}
              style={{ margin: 5, marginRight: 2 }}
            ></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.favoritar,{backgroundColor: botaofavoritarfundo?'#90C9BC' : "white"}]} onPress={favoritarfundo}>
            <FontAwesome
              name={botaofavoritarfundo?'heart' : 'heart-o'}
              size={13}
              color={botaofavoritarfundo?'white' : "#76BDAC"}
              
            ></FontAwesome>
          </TouchableOpacity>
        </View> 
        <View style={{justifyContent: 'center', alignItems: 'center'  }}>
          <View style={[styles.cardsemjardins,{ display: displaybotao ? "none" : "flex" }]}>
            <Image source={require("../assets/images/iconpagejardim.webp")} style={styles.iconsemjardim}></Image>
            <Text style={styles.textocardsemjardim}>Adicione um jardim clicando no botão abaixo</Text>
            <TouchableOpacity style={styles.botaocardsemjardim}
              onPress={() => { 
                setmodal1(true);
              }}>
                <FontAwesome name="plus" size={18} color={'white'} style={{position: "absolute", left: 22}}></FontAwesome>
                <Text style={{color: "white", fontFamily: "Lexend-VariableFont_wght", fontSize: 16}}>Adicionar jardim</Text>
              </TouchableOpacity>
          </View>
            <TouchableOpacity style={styles.botaoaddjardim} onPress={() => {setmodal1(true)}}>
            <FontAwesome name="plus" color="white" size={23}></FontAwesome>
            </TouchableOpacity>
          <FlatList
            data={jardins}
            renderItem={renderizarjardim}
            keyExtractor={(item) => item.id}
            style={{maxHeight: '86%'}}
          ></FlatList>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  conteudo: {
    flex: 1,
    zIndex: 2,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
    position: "absolute",
    marginTop: 100,
    zIndex:1,
  },
  titulo: {
    fontFamily: "InriaSans-Bold",
    fontSize: 36,
    color: "black",
    width: 245,
    marginTop: 17,
  },
  grupofiltros: {
    width: '90%',
    height: '5%',
    marginTop: 38,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ordenarpor: {
    width: '35%',
    borderColor: "#76BDAC",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  filtrarpor: {
    width: '35%',
    borderColor: "#76BDAC",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  favoritar: {
    width: '15%',
    borderColor: "#76BDAC",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cardsemjardins: {
    width: '95%',
    height: '38%',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 84,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#CFE8E2',
  },
  iconsemjardim: {
    width: '20%',
    height: '20%',
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
    marginTop: 11,
    width: '90%',
    height: '15%',
    backgroundColor: "#90C8BB",
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',

  },
  modaladicionarjardins: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  cardmodal: {
    backgroundColor: 'white',
    width: '90%',
    minHeight: '47%',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#90C8BB',
    alignItems: 'center'
  },
  botaomodaladicionarjardim: {
    width: '75%',
    height: '13%',
    backgroundColor: '#90C8BB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  iconesselecionaveis: {
    width: 74,
    height: 74,
  },
  divselecionaricone: {
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  divnomejardim : {
    marginTop: 22,
    alignItems: 'center',
  },
  inputnomejardim : { 
    width: 246,
    height: 41,
    borderWidth: 1.43,
    borderColor: '#90C8BB',
    borderRadius: 7.17,
    color: '#90C8BB',
  },
  divinternoexterno: {
    width: '75%',
    height: 41,
    borderWidth: 1.43,
    borderColor: '#90C8BB',
    borderRadius: 7,
    marginTop: 23,
    flexDirection: 'row',
  },
  divinterno: {
    width: 124,
    backgroundColor: '#90C8BB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divexterno: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 124,
  },
  fecharmodalnoclick: {
    height: '100%', 
    width: '100%' ,
    position: "absolute",
  },
  divjardim: {
    marginBottom: 25,
    width: 334,
    height: 133,
  },
  cardjardim: {
    width: '100%',
    height: '100%',
    backgroundColor: '#90C9BC',
    borderRadius: 10,
    flexDirection: 'row'
  },
  divcardconteudo: {
    flexDirection: 'row',
  },
  diviconjardim: {
    justifyContent: 'center',
    marginLeft: 19,
  },
  informacoesjardim: {
    width: 147,
    height: 74,
    marginTop: 20,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: 20,
  },
  iconejardim: {
    width: 58,
    height: 58,
  },
  nomejardim: {
    color: 'white',
    fontFamily: "InriaSans-Bold", 
    fontSize: 18, 
    marginLeft: 3
  },
  grupoestatisticas: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 4,
  },
  barrasestatisticas: {
    width: '85%', 
    height: 10, 
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 10,
  },
  botaoaddjardim: {
    width: 52, 
    height: 52, 
    backgroundColor: '#1F6D5B', 
    position:"absolute", 
    borderRadius: 100, 
    bottom: 65,
    right: 10, 
    zIndex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
});
