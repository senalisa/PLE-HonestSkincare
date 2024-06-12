import { View, Text, TouchableOpacity, Image, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; 
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import UserCardComponent from './UserCardComponent';

export default function UserCardTwo() {
    const navigation = useNavigation();
  
    const [userPreferences, setUserPreferences] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Haal de gebruikers-id op zodra de gebruiker is ingelogd
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    useEffect(() => {
      const fetchUserPreferences = async () => {
        if (!userId) return;
  
        const userPrefRef = doc(db, 'userPreferences', userId);
  
        try {
          const docSnap = await getDoc(userPrefRef);
          if (docSnap.exists()) {
            setUserPreferences(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserPreferences();
    }, [userId]);

    if (loading) {
        return (
          <View className="flex-1 justify-center items-center">
             <ActivityIndicator size="large" color="#63254E" />
          </View>
        );
    }

    const getImageSource = (skinType) => {
        switch (skinType) {
          case 'Oily':
            return require('../../assets/images/oily-skintype.png');
          case 'Dry':
            return require('../../assets/images/dry-skintype.png');
          case 'Combination':
            return require('../../assets/images/combi-skintype.png');
          case 'Normal':
            return require('../../assets/images/normal-skintype.png');
        }
      };

  return (
    <ImageBackground source={require('../../assets/images/bg14.png')} imageStyle= {{opacity:0.6, width: '100%', height: '100%' }}>
   <View className="justify-center items-center px-5 h-screen">

        <View className="justify-center items-center pt-6">
            {/* Title */}
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}
            className=" text-center mb-3"
            >You're all set
            </Text>

            {/* Intro */}
            <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 16 }}
            className=" text-center mb-8 px-12 color-gray-500"
            >Based on the information you gave us, {"\n"} we created a Skin Type Card for you!
            </Text>
        </View>

        <UserCardComponent/>

        <View className="mx-auto">
            <TouchableOpacity  onPress={() => navigation.navigate('UserSkinType')} className="mt-5 border border-gray-200 rounded-xl py-2 px-2 flex-row">
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 13 }}
              className="text-gray-500"
              >Change Skin Type & Concerns</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="mt-10 py-2.5 bg-dark-pink rounded-full mb-5 w-60 flex mx-auto shadow-md">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
              className="text-xl font-bold text-center text-white">Start Exploring</Text>
        </TouchableOpacity>

    </View>
    </ImageBackground>
  )
}