import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput} from 'react-native';
// import FontAwesome from '@react-native-vector-icons/fontawesome'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Login({ navigation }: { navigation: any }) {
    const onPressHandler = () => {
        navigation.replace('Screen_C')
    }

    const [email, setEmail] = useState<any>();
    const [senha, setSenha] = useState<any>();

    const onPressLetter = () => {
        navigation.navigate('Screen_B')
    }

        return (
            <View style={styles.page}>
                <Image source={require('../assets/images/fundoLogin.png')}
                    style={styles.backgroundImage}
                />
                <TouchableOpacity
                onPress={onPressLetter}
                style={styles.voltar}
                >
                    <FontAwesome name="chevron-left" size={25} color={"#3A3A3A"}></FontAwesome>
                </TouchableOpacity>
                <View style={styles.conteudo}>
                    <View>
                        <Text style={styles.titulo}>Faça login na sua conta</Text>
                    </View>
                    <View style={{ width: 255, height: 137.4, marginTop: 50 }}>
                        <TextInput style={styles.textoregistro}
                        placeholder='E-mail'
                        placeholderTextColor={"#AFA4A4"}
                        value={email}
                        onChangeText={setEmail}
                        ></TextInput>
                        <TextInput style={styles.textoregistro}
                        secureTextEntry
                        placeholder='Senha'
                        placeholderTextColor={"#AFA4A4"}
                        value={senha}
                        onChangeText={setSenha}
                        ></TextInput>
                        <TextInput style={{ fontSize: 12, color: '#76BDAC', textAlign: 'right', marginTop: 13 }}>Esqueceu a senha?</TextInput>
                    </View>
                    <TouchableOpacity>
                        <View>
    
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressHandler}
                    >
                        <View style={{ width: 180, height: 41, backgroundColor: "#90C9BC", borderRadius: 90, marginTop: 50, justifyContent: 'center', alignItems: 'center', }}>
                            <Text>LOGIN</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 22 }}>
                        <View style={{ height: 1, backgroundColor: 'black', width: 70, margin: 10 }} />
                        <Text style={{ color: 'black', fontSize: 15, }}>OU</Text>
                        <View style={{ height: 1, backgroundColor: 'black', width: 71, margin: 10 }} />
                    </View>
                    <TouchableOpacity>
                        <Image source={require('../assets/images/G.png')}
                            style={styles.signingoogle}
                        />
                    </TouchableOpacity>
                </View>
            </View>
    
        );
};

const styles = StyleSheet.create({
    f1: {
        flex: 1
    },
    page: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    conteudo: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    voltar: {
        position: 'absolute',
        left: 15,
        top: 50
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
        position: 'absolute',
    },
    titulo: {
        fontSize: 36,
        color: 'black',
        marginTop: 5,
        width: 245,
        fontFamily: 'InriaSans-Bold'
    },
    lineStyle: {
        borderWidth: 0.5,
        borderColor: 'black',
        margin: 0,
    },
    textoregistro: {
        color: '#AFA4A4',
        paddingBottom: 4,
        fontSize: 15,
        marginLeft: 2,
        borderBottomWidth: 2,
        borderColor: '#AFA4A4'
    },
    textobutton: {
        color: 'white',
    },
    signingoogle: {
        width: 230,
        height: 50,
        alignSelf: 'center',
    }
});