import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, ImageBackground} from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import React, { useState } from 'react'
import { ArrowLeftIcon, ArrowUpIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Register() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // Voeg displayName toe
  const [error, setError] = useState('');

  const handlesubmit = async () => {
    if(email && password && displayName) { // Controleer of displayName is ingevuld
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile met displayName
        await updateProfile(user, { displayName: displayName });
        navigation.navigate('UserSkinType');

      } catch(err) {
        switch(err.code) {
          case 'auth/email-already-in-use':
            setError('This e-mail is already in use');
            break;
          case 'auth/invalid-email':
            setError('Invalid e-mail adress');
            break;
          case 'auth/weak-password':
            setError('Please create an password with at least 6 characters');
            break;
          default:
            setError('There has been an error, please try again');
        }
      }
    }
  }
     
  return (
    <View className="flex-1">
       {/* INTRO */}
       <ImageBackground source={require('./../assets/images/welcome-bg-up.png')} resizeMode="cover" className="w-full h-full">

      <SafeAreaView className="flex">

        {/* Backbutton */}
        <View className="flex-row justify-start">
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                className="bg-primary-dark p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                <ArrowUpIcon size="20" color="black"></ArrowUpIcon>
            </TouchableOpacity>
        </View>

      </SafeAreaView>

      <View className="flex-1 bg-primary px-8 pt-4"> 
        {/* Logo */}
        <View className="flex items-center mb-10">
          <Image className="w-32 h-12 ml-2" 
                          source={require('./../assets/images/logo-plain-nobg.png')} />
        </View>

        <View className="form space-y-2 px-5">
            
            {/* Username */}
            <Animated.View entering={FadeInDown.delay(200).duration(3000).springify()}>
              {/* Text */}
              <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
              className="text-black font-semibold pb-2 text-sm">Username</Text>

              {/* Input */}
              <View className="flex-row px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-200 text-l font-medium mb-4">
                  <Image className="w-6 h-6 mr-3" style={{ tintColor: "black"}}
                                              source={require('./../assets/icons/profile.png')} />
                  <TextInput 
                      className="flex-1 text-sm"
                      placeholder='Username'
                      value={displayName}
                      onChangeText={value => setDisplayName(value)}
                  >
                  </TextInput>
                </View>

            </Animated.View>

            {/* Email input */}
            <Animated.View entering={FadeInDown.delay(300).duration(3000).springify()}>
              {/* Text */}
              <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
              className="text-black font-semibold text-xl pb-2 text-sm">E-mail</Text>

              {/* Input */}
              <View className="flex-row px-4 py-3 bg-white text-gray-700 rounded-md border border-gray-200 text-l font-medium mb-4">
                <Image className="w-4 h-4 mr-4" style={{ tintColor: "black"}}
                                            source={require('./../assets/icons/mail.png')} />
                <TextInput 
                    className="flex-1 text-sm"
                    placeholder='E-mail'
                    value={email}
                    onChangeText={value => setEmail(value)}
                >
                </TextInput>
              </View>

            </Animated.View>

            {/* Wachtwoord input */}
            <Animated.View entering={FadeInDown.delay(400).duration(3000).springify()}>
              {/* Text */}
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-black font-semibold text-xl text-sm pb-2">Password</Text>

              {/* Input */}
              <View className="flex-row px-4 py-2.5 bg-white text-gray-700 rounded-md border border-gray-200 text-l font-medium mb-10">
                <Image className="w-5 h-5 mr-3" style={{ tintColor: "black"}}
                                            source={require('./../assets/icons/lock.png')} />
                <TextInput 
                    className="flex-1 text-sm"
                    secureTextEntry
                    placeholder='Password'
                    value={password}
                    onChangeText={value => setPassword(value)}
                >
                </TextInput>
              </View>

            </Animated.View>
  

            {error ? <Text className="text-center text-black-500 mb-6 -mt-6">{error}</Text> : null}

            <Animated.View entering={FadeInDown.delay(500).duration(3000).springify()}>
                <TouchableOpacity className="py-3 bg-dark-pink rounded-full mb-5 w-60 flex mx-auto"
                                  onPress={handlesubmit}
                >
                    <Text style={{ fontFamily: 'Belleza_400Regular'}}
                    className="text-xl font-bold text-center text-white text-xl">Sign up</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(3000).springify()}>
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-center mb-5 text-md">Or</Text>
              <View className="flex-row justify-center space-x-8 mb-5 text-base">

                {/* Google */}
                <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
                  <Image source={require('./../assets/icons/google.png')}
                    className="w-8 h-8" />
                </TouchableOpacity>

                {/* Facebook */}
                <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
                  <Image source={require('./../assets/icons/facebook.png')}
                    className="w-8 h-8" />
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
                  <Image source={require('./../assets/icons/apple.png')}
                    className="w-8 h-8" />
                </TouchableOpacity>
                
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700).duration(3000).springify()}>
               {/* Nog geen account */}
               <View className="flex-row justify-center">
                <TouchableOpacity className="mt-3 flex-wrap text-center"
                onPress={() => navigation.navigate('Login')}>
                  <Text style={{ fontFamily: 'Montserrat_500Medium'}} 
                  className="text-center text-sm">Already joined our community?</Text>

                  <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} 
                  className="text-center text-dark-pink underline pt-1 text-sm">Login here</Text>
                </TouchableOpacity>
                </View>
            </Animated.View>
        </View>

      </View>

      </ImageBackground>
    </View>
  )
}