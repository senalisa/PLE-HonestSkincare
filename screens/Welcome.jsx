import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';

export default function Welcome() {
  const navigation = useNavigation()
  
  return (
    <View className="">

       {/* INTRO */}
       <ImageBackground source={require('./../assets/images/welcome-bg.png')} resizeMode="cover" className="w-full h-full">

      {/* Logo */}
      <View className="flex items-center mt-28">
        <Image className="w-44 h-16 ml-2" 
                        source={require('./../assets/images/logo-plain-nobg.png')} />
      </View>

      {/* Welcome text */}
      <View className="w-72 mt-12 mx-auto">
        <Text className="text-center" style={{ fontFamily: 'Montserrat_400Regular', fontSize: 18 }}>
          Welcome to a place where skincare is about sharing, not selling.
        </Text>
      </View>

      <View>
        <Image className="w-full h-72 mt-14"
                        source={require('./../assets/images/welcome-pic.png')} />
      </View>

      {/* Login & register */}
      <View className="flex items-center mt-20">
        <Animated.View entering={FadeInDown.duration(2000).springify()}>
        <View className="">
          <TouchableOpacity className="rounded-3xl bg-dark-pink px-16 py-3 flex-row"
                            onPress={() => navigation.navigate('Register')}>
             <Text style={{ fontFamily: 'Belleza_400Regular', fontSize: 24 }}
                    className="text-white"
             >Get Started</Text>

          <Image className="w-7 h-7 -mt-0.5 ml-3" style={{ tintColor: "white"}}
                          source={require('./../assets/icons/rotated-right-arrow.png')} />

          </TouchableOpacity>
        </View>
        </Animated.View>

        <View>
        <Animated.View entering={FadeInDown.delay(200).duration(2000).springify()}>
          <TouchableOpacity className="mt-10 flex-wrap text-center"
          onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 17 }} 
            className="text-center">Already joined our community?</Text>

            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }} 
            className="text-center text-dark-pink underline pt-2">Login here</Text>
          </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      </ImageBackground>
    </View>
  )
}
