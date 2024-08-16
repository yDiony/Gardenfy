import {
  Viro360Image,
    ViroARPlane,
    Viro3DObject,
    ViroARScene,
    ViroARSceneNavigator,
    ViroAmbientLight,
    ViroText,
    ViroBox,
    ViroMaterials,
    ViroAnimations,
    ViroARPlaneSelector,
    ViroARAnchorFoundEvent,
    ViroAnchor
  } from "@viro-community/react-viro";
  import React, { useState } from "react";
  import { StyleSheet, View, Text, TouchableOpacity, ImageSourcePropType } from "react-native";
  
  
  const InitialScene = (props: { sceneNavigator: { viroAppProps: any; }; }) => {
    

    let data = props.sceneNavigator.viroAppProps;
    
    ViroMaterials.createMaterials({
      plant:{
        diffuseTexture:require('../assets/textures/Textura_Planta.jpeg')
      }
    })
    
    const moveObject = (newPosition: any) =>{
      console.log(newPosition);
    }

    const ObjetoSaiu = () =>{
        console.log()
    }

    
    return(
      <ViroARScene>
        <ViroAmbientLight color="#ffffffff"/>

        <ViroARPlaneSelector  dragType={"FixedToWorld"} minHeight={.5} minWidth={.5} onAnchorRemoved={ObjetoSaiu}>

        
        
              <Viro3DObject
                type="OBJ"
                source={require('../assets/objetos3D/uploads_files_3726421_Areca+Palm+obj.obj')}
                position={[0 , 0, 0]} 
                scale={[0.0012, 0.0012, 0.0015]}
                materials={"plant"}
                onDrag={moveObject}
              />
          
          
        
         
        </ViroARPlaneSelector>
  
      </ViroARScene>
      
    );
  }

  export default function CameraNe(){
    const [object, setObject] = useState('plant')
  
    InitialScene.call
    return (
      <View style={styles.mainView}> 
      
        <ViroARSceneNavigator
          initialScene={{
            scene:InitialScene
          }}
          
          style={{flex:1}}
        />
        <View style={[styles.divcontrolButtons]}>
          <Text style={styles.controlButtons}>Sim</Text>
          <Text style={styles.controlButtons}>Nao</Text>
        </View>
 
        </View>
    );
  };
  
  var styles = StyleSheet.create({
    controlButtons:{
      color: 'black',
      fontSize: 24,

    },
    divcontrolButtons:{
      display: 'none',
    },
    mainView:{
      flex:1,
    },
    controlsView:{
      width:'100%',
      height: 100,
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }, 
    text: {
      margin:30,
      backgroundColor: '#9d9d9d',
      padding: 10,
      color: '#000000',
      fontWeight: 'bold'
    }
  });