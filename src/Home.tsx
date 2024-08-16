import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from './PageHome'
import Jardins from './PageJardins'
import CameraNe from './Camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from 'react-native-paper';
import Plantas from './Jardins';



const Tab = createMaterialBottomTabNavigator();

export default function Home() {
    const theme = useTheme();
    theme.colors.secondaryContainer = "transperent"
    return (
        <Tab.Navigator
        labeled={false}
        >
            <Tab.Screen
                name='home'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'home',
                    tabBarIcon: ({focused}) => (
                        <FontAwesome name='home' color={focused? "#76BDAC" : "#cfe8e2"} size={30}/>
                    )
                }}
            />
            <Tab.Screen
                name='jardins'
                component={Plantas}
                options={{
                    tabBarIcon: ({focused}) => (
                        <FontAwesome name='leaf' color={focused? "#76BDAC" : "#cfe8e2"} size={30}/>
                    )
                }}
            />
            
            <Tab.Screen
                name='camera'
                component={CameraNe}
                options={{
                    tabBarIcon: ({focused}) => (
                        <FontAwesome name='camera' color={focused? "#76BDAC" : "#cfe8e2"} size={30}/>
                    )
                }}
            />
        </Tab.Navigator>
    )
}