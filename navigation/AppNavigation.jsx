import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
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
import UserSkinType from '../components/account/UserSkinType.jsx';
import PostDetail from '../screens/PostDetail.jsx';
import CategorySearch from '../screens/CategorySearch.jsx';
import UserCard from '../components/account/UserCard.jsx';
import UserCardTwo from '../components/account/UserCardTwo.jsx';
import Article from '../screens/Article.jsx';
import PostCreated from '../components/PostCreated.jsx';
import IngredientInfoScreen from '../screens/IngredientDetail.jsx';

import CGShort from '../components/community/CGshort.jsx';
import CGLong from '../components/community/CGlong.jsx';
import UserPosts from '../components/account/UserPosts.jsx';
import UsersProfile from '../components/UsersProfile.jsx';
import ReportForm from '../components/report/ReportForm.jsx';


// Animation
const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
};

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

//Custom Tab Bar button 
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
        backgroundColor: '#FB6F93',
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
            <Tab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Image
                        source={require('./../assets/icons/home-heart.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? '#FB6F93' : 'grey'
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
                            tintColor: focused ? '#FB6F93' : 'grey'
                        }}
                        />

                    </View>
                )
            }}/>

                <Tab.Screen name="CreatePost" component={CreatePost} options={{
                tabBarIcon: ({ focused }) => (
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
                }} />

            <Tab.Screen name="Leaderboard" component={Leaderboard} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Image
                        source={require('./../assets/icons/ranking-star.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? '#FB6F93' : 'grey'
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
                            tintColor: focused ? '#FB6F93' : 'grey'
                        }}
                        />

                    </View>
                )
            }}/>

        </Tab.Navigator>
    );
};

//Navigation between pages
const AppNavigation = () => {
    const { user } = useAuth();
    console.log('User status:', user);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                <>
                    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                    <Stack.Screen name="UserSkinType" component={UserSkinType} options={{ headerShown: false }} />
                    <Stack.Screen name="UserCard" component={UserCard} options={{ headerShown: false }} />
                    <Stack.Screen name="UserCardTwo" component={UserCardTwo} options={{ headerShown: false }} />
                    <Stack.Screen name="Article" component={Article} options={{ headerShown: false }} />
                    <Stack.Screen name="CategorySearch" component={CategorySearch} options={{ headerShown:false }} />
                    <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown:false }} />
                    <Stack.Screen name="CreatePostStack" component={CreatePost} options={{ headerShown: false }} />
                    <Stack.Screen name="PostCreated" component={PostCreated} options={{ headerShown: false }} />
                    <Stack.Screen name="CGShort" component={CGShort} options={{ headerShown: false }} />
                    <Stack.Screen name="CGLong" component={CGLong} options={{ headerShown: false }} />
                    <Stack.Screen name="UserPosts" component={UserPosts} options={{ headerShown: false }} />
                    <Stack.Screen name="UsersProfile" component={UsersProfile} options={{ headerShown: false }} />
                    <Stack.Screen name="ReportForm" component={ReportForm} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="IngredientDetail" component={IngredientInfoScreen} options={{ headerShown: false }} />
                </>
                ) : (
                <>
                    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false, 
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                    animation: 'fade'
                    }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false, 
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                    animation: 'fade'
                    }} />
                </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;