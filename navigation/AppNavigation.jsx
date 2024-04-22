import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
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

const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
    style={{
        top: -15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
        shadowOpacity: 0.25,
        backgroundColor: '#63254E',
        width: 60,
            height: 60,
            borderRadius: 100,
    }}
    onPress={onPress}
    >
        <View>
            {children}
        </View>
    </TouchableOpacity>
);

// NAVBAR
const Tabs = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.25,
            }
            }}>
            <Tab.Screen name="Home" component={HomeStackScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Image
                        source={require('./../assets/icons/home-heart.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? '#63254E' : 'grey'
                        }}
                        />

                    </View>
                )
            }}/>

            <Tab.Screen name="Ontdek" component={Discover} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Image
                        source={require('./../assets/icons/search.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? '#63254E' : 'grey'
                        }}
                        />

                    </View>
                )
            }}/>

            <Tab.Screen name="CreatePost" component={CreatePost} options={{
                tabBarIcon: ({focused}) => (
                    <Image
                    source={require('./../assets/icons/pen-field.png')}
                    resizeMode="contain"
                    style={{
                        width: 25,
                        height: 25,
                        tintColor: 'white'
                    }}
                    />
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props} />
                )
            }}/>

            <Tab.Screen name="Leaderboard" component={Leaderboard} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Image
                        source={require('./../assets/icons/ranking-star.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? '#63254E' : 'grey'
                        }}
                        />

                    </View>
                )
            }}/>

            <Tab.Screen name="Account" component={Profile} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Image
                        source={require('./../assets/icons/user-2.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? '#63254E' : 'grey'
                        }}
                        />

                    </View>
                )
            }}/>

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