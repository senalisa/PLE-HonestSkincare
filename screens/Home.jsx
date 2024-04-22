import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import Topics from '../components/Topics'
import TrendingPostCard from '../components/TrendingPostCard'


export default function Home() {
  return (
    <ScrollView>
    <View className="flex-[1] white">

      {/* INTRO */}
      <ImageBackground source={require('./../assets/images/home-bg.png')} resizeMode="cover" imageStyle= {{opacity:0.5}}>

        <View className="mt-10 mb-10">

          {/* INTRO: Welcome user + text */}
          <View className="mt-10 px-10 mb-7">
            <Text className="mb-2" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Hi Sena</Text>
            <Text className="" style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}>Find topics you'd like to read</Text>
          </View>

          <View className="px-10 flex-row justify-between">
            {/* Create topic Button */}
            <TouchableOpacity 
              className="py-2 bg-dark-pink rounded-md w-40 items-center shadow">
                <View className="flex-row">
                  <Image className="w-4 h-4" style={{ tintColor: "white"}}
                                        source={require('./../assets/icons/pen-field.png')} />

                  <Text 
                  style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }}
                  className="text-white px-3"
                  >Create a topic
                  </Text>
                </View>
            </TouchableOpacity>
          
            {/* Search Icon */}
            <TouchableOpacity 
              className="shadow-lg">
              <Image className="w-5 h-5 mt-2" style={{ tintColor: "black"}}
                                      source={require('./../assets/icons/search.png')} />
            </TouchableOpacity>
          </View>
   
        </View>

      </ImageBackground>

      <View className="bg-white rounded-t-3xl outline outline-offset-6 h-full py-5">
        {/* Topics for you */}
        <View className="flex-row justify-between  px-8">
          <Text 
          style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
          className="pt-3">
            Topics for you
          </Text>

          <TouchableOpacity>
            <Text
             style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
             className="text-dark-pink pt-3 underline underline-offset-4"
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>

        {/* Topics Map */}
        <View className="mt-5">
          <Topics />
        </View>

        <View className="flex-row justify-between  px-8">
          <Text 
          style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
          className="pt-10">
            Trending posts
          </Text>
        </View>

        <View>
          <TrendingPostCard />
        </View>
        
      </View>

    </View>
  </ScrollView>
  )
}

