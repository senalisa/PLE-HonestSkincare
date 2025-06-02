import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; 
import Animated, { FlipInEasyX } from 'react-native-reanimated';

export default function UserCardComponent() {
  
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
            <Text>Loading...</Text>
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
        // <Animated.View entering={FlipInEasyX.delay(0).duration(500).springify()}>
        <View className="m-8 bg-white rounded-xl shadow-xl mx-auto border border-gray-200">
            {/* Card top */}

            <ImageBackground
                source={require('../../assets/images/home-bg2.png')}
                resizeMode="cover" imageStyle= {{opacity:0.2, borderTopLeftRadius: 12, borderTopRightRadius: 12}} 
              >

              <View className="flex-row rounded-t-xl px-5 justify-between">

                    {/* Account info */}
                    <View className="flex-row pt-8 pb-12">
                        {/* Profiel picture */}
                        <View className="pr-5">
                        <Image className="w-10 h-10" 
                                                    source={require('../../assets/images/user.png')} />
                        </View>

                        {/* Account name + title */}
                        <View className="">
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                            className="text-base">{auth.currentUser?.displayName}'s</Text>
                            <Text style={{ fontFamily: 'Montserrat_500Medium_Italic'}}
                            className="text-base -mt-1">Skin Type Card</Text>
                        </View>
                    </View>

                    {/* Logo */}
                    <View className="pt-5">
                        <Image className="w-12 h-4 ml-2" 
                          source={require('../../assets/images/logo-plain-nobg.png')} />
                    </View>

              
              </View>

            </ImageBackground>

            {/* Card Bottom */}
            <View className="flex-row bg-white mb-7">

                {/* Skin Type */}
                <View className="bg-white justify-center border-1 border-gray-200 shadow-sm rounded-xl p-3 px-4 mx-5 -mt-6 items-center">
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                    className="text-md mb-1 font-semibold w-24 text-center">{userPreferences.skinType}</Text>

                    <Image
                    style={{ width: 80, height: 100 }}
                    className="mt-2 mb-3"
                    source={getImageSource(userPreferences.skinType)}
                    />
                </View>

                {/* Skin Concerns */}
                <View>
                    {/* Title */}
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                    className="text-md font-semibold mt-4">Skin Concerns</Text>

                    {/* Skin concerns */}
                    <View className="mt-2 flex-row flex-wrap w-48">
                    {userPreferences.skinConcerns.map((concern, index) => (
                        <View key={index} className="rounded-xl bg-white border border-dark-yellow px-5 py-1 mr-2 mb-2">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-center text-dark-yellow text-xs">
                            {concern}
                        </Text>
                        </View>
                    ))}
                    </View>
                </View>

            </View>

        </View>
        // </Animated.View>
  )
}