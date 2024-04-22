import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from './../assets/styles/Styles.jsx';
import useAuth from '../hooks/useAuth'

//Views
import Login from '../screens/Login'
import Register from '../screens/Register'
import Welcome from '../screens/Welcome'
import Home from '../screens/Home'
import Discover from '../screens/Discover';
import CreatePost from '../screens/CreatePost';
import Leaderboard from '../screens/Leaderboard';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }}/>
        </HomeStack.Navigator>
    );
}

// NAVBAR
const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let navText;
                    let iconComponent;
                    let iconSize = focused ? 25 : 25; 

                    if (route.name === 'Home') {
                        
                        iconComponent = focused ? require('./../assets/icons/home-heart.png') : require('./../assets/icons/home-heart.png');
                    } else if (route.name === 'Ontdek') {
                        
                        iconComponent = focused ? require('./../assets/icons/search.png') : require('./../assets/icons/search.png');
                    } else if (route.name === 'CreatePost') {
                        iconComponent = focused ? require('./../assets/icons/pen-field.png') : require('./../assets/icons/pen-field.png');
                    } else if (route.name === 'Leaderboard') {
                    
                        iconComponent = focused ? require('./../assets/icons/ranking-star.png') : require('./../assets/icons/ranking-star.png');
                    } else if (route.name === 'Account') {
                        
                        iconComponent = focused ? require('./../assets/icons/user-2.png') : require('./../assets/icons/user-2.png');
                    }

                    const iconColor = focused ? colors.secondaryColor : "gray";
                    return <View className="items-center">
                                <Image source={iconComponent} className="mb-2 w-5 h-5" style={{ tintColor: iconColor, width: iconSize, height: iconSize }} /> 
                                <Text className={`text-xs ${focused ? 'font-semibold text-secondary' : 'font-medium text-white'}`}>{navText}</Text>
                            </View>;
                },
                tabBarStyle: {
                    paddingVertical: 35,
                    borderTopWidth: 0,
                    height: 90,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowRadius: 4,
                },
                tabBarLabel: '',
                headerShown: false,
            })}>
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Ontdek" component={Discover} />
            <Tab.Screen name="CreatePost" component={CreatePost} />
            <Tab.Screen name="Leaderboard" component={Leaderboard} />
            <Tab.Screen name="Account" component={Profile} />
        </Tab.Navigator>
    );
};

const AppNavigation = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                <>
                    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                </>
                ) : (
                <>
                    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    focusedCreatePostTab: {
        backgroundColor: 'purple', // Achtergrondkleur aanpassen
        borderRadius: 20, // Afgeronde hoeken toevoegen
        width: 60, // Breedte aanpassen
        height: 60, // Hoogte aanpassen
        justifyContent: 'center', // Center de inhoud verticaal
        alignItems: 'center', // Center de inhoud horizontaal
        top: -20, // Positie aanpassen (om te compenseren voor de grotere hoogte)
    }
});

export default AppNavigation;