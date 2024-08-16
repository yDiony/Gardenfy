import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function Registro({ navigation }: { navigation: any }) {
    const onPressHandler = () => {
        navigation.replace('Screen_C')
    }

    const onPressLetter = () => {
        navigation.navigate('Screen_D')
    }

    return (
        <View style={styles.page}>
            <Image source={require('../assets/images/fundoRegistro.png')}
                style={styles.backgroundImage}
            />
            <View style={styles.conteudo}>
                <View>
                    <Text style={styles.titulo}>Registre sua conta</Text>
                </View>
                <View style={{ width: 255, height: 206}}>
                    <Text style={styles.textoregistro}>Nome de usuário</Text>
                    <View style={styles.lineStyle} />
                    <Text style={styles.textoregistro}>E-mail</Text>
                    <View style={styles.lineStyle} />
                    <Text style={styles.textoregistro}>Senha</Text>
                    <View style={styles.lineStyle} />
                </View>
                <TouchableOpacity onPress={onPressHandler}>
                    <View style={{ width: 180, height: 41, backgroundColor: "#90C9BC", borderRadius: 90, marginTop: 20, justifyContent: 'center', alignItems: 'center', }}>
                        <Text>REGISTRAR</Text>
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
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ color: 'black', fontSize: 16 }}>Já possui uma conta?</Text>
                    <TouchableOpacity
                    onPress={onPressLetter}
                    >
                        <Text style={{ color: '#76BDAC', fontSize: 16, textDecorationLine: 'underline' }}>ENTRAR</Text>
                    </TouchableOpacity>
                </View>
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
        alignItems: 'center',
        backgroundColor: 'white', 
    },
    conteudo: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    backgroundImage: { 
        width: '100%', 
        height: '100%', 
        opacity: 0.6, 
        position: 'absolute', 
    },
    titulo: { 
        fontFamily: 'InriaSans-Bold',
        fontSize: 36, 
        color: 'black', 
        width: 245
    },
    lineStyle: {
        borderWidth: 0.5,
        borderColor: 'black',
        margin: 0,
    },
    textoregistro: {
        color: '#AFA4A4',
        fontSize: 15,
        marginLeft: 2,
        marginTop: 35,
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
