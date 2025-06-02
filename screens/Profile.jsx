import { View, Text, Pressable, ScrollView, StatusBar, ImageBackground, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import UserCardComponent from '../components/account/UserCardComponent'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Profile() {

  const navigation = useNavigation()

  const user = auth.currentUser;
  const displayName = user?.displayName || 'Guest';

  //Function to log out
  const handleLogout = async ()=> {
    await signOut(auth);
    navigation.navigate('Welcome')
  }

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] white">

      {/* INTRO */}
      <ImageBackground source={require('./../assets/images/bg7.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

        <View className="mt-20 mb-24">

          {/* INTRO: Welcome user + text */}
          <View className="-mt-3 mb-0 px-10 flex-row justify-between">
            <Text className="mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Account</Text>
            
            <Pressable onPress={handleLogout}>
            <View className="flex-row mt-1.5">
              <Image className="w-4 h-4 mr-1"  style={{ tintColor: '#63254E' }}
                                  source={require('./../assets/icons/exit.png')} />
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-dark-pink">Sign out</Text>
            </View>
            </Pressable>
          </View>

          <View>
            <Text></Text>
          </View>
   
        </View>

      </ImageBackground>

      <View className="bg-white outline outline-offset-6 h-full py-5 -mt-5 rounded-t-[35px] h-screen">

        <View className="-mt-28">  
          <UserCardComponent />
        </View>

        {/* Button */}
        <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between"
        onPress={()=> navigation.navigate('UserPosts')}>
            
            <View className="flex-row">
              <Image className="w-5 h-5 mr-4" 
                                  source={require('./../assets/icons/post.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-0.5">
                My posts
              </Text>
            </View>

            <Pressable className="bg-dark-pink py-1 w-24 rounded-full ml-12">
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                            className="text-white text-xs text-center">Boost!</Text>
            </Pressable>

            <Image className="w-5 h-5" 
                                  source={require('./../assets/icons/next.png')} />

        </Pressable>

        <View>
          {/* Button */}
          <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5">
            
            <View className="flex-row">
              <Image className="w-5 h-5 mr-4" 
                                  source={require('./../assets/icons/edit.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-0.5">
                Edit Profile
              </Text>
            </View>

            <Image className="w-5 h-5" 
                                  source={require('./../assets/icons/next.png')} />

          </Pressable>

          {/* Button */}
          <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
          onPress={()=> navigation.navigate('UserSkinType')}>

            <View className="flex-row">
              <Image className="w-5 h-6 mr-4 -mt-1" 
                                  source={require('./../assets/icons/face.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-0.5">
                Change Skin Type & Concerns
              </Text>
            </View>

            <Image className="w-5 h-5" 
                                  source={require('./../assets/icons/next.png')} />

          </Pressable>

          {/* Button */}
          <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
          onPress={()=> navigation.navigate('CGLong')}>
            
            <View className="flex-row">
              <Image className="w-5 h-5 mr-4" 
                                  source={require('./../assets/icons/united.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-0.5">
                Community Guidelines
              </Text>
            </View>

            <Image className="w-5 h-5" 
                                  source={require('./../assets/icons/next.png')} />

          </Pressable>

          
        </View>

        <View className="flex justify-center items-center mt-10">
          <Image className="w-16 h-6 mb-1" 
                                source={require('./../assets/images/logo-plain-nobg.png')} />

          <Text style={{ fontFamily: 'Montserrat_500Medium' }}
          className="mb-2 underline text-dark-pink">Contact us</Text>
          
  
        </View>
      
      </View>

    </View>
  </ScrollView>
  )
}