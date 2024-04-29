import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native'
import PostCard from '../components/PostCard';

export default function CategorySearch() {

  const navigation = useNavigation()

  return (
    <ScrollView className="bg-white">
      <StatusBar />
  
      <View className="bg-white pt-10 mb-4 px-7 ">
        <View className="flex-row justify-between items-center bg-white pt-6 mb-4">
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image className="w-5 h-5" 
                                    source={require('./../assets/icons/left-arrow.png')} />
          </TouchableOpacity>
  
          {/* Title */}
          <Text  style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
          className="text-center flex-1 -ml-4">
            Topics about Oily skin
          </Text>
  
          {/* Spacer voor het centreren van de titel */}
          <View className="flex-2" />
        </View> 
      </View>

      {/* Info-card Skin type/concern */}
      <Animated.View entering={FlipInEasyX.delay(100).duration(2000).springify()}>
      <View className="flex-row bg-white shadow-sm mx-7 rounded-xl mb-8">
        {/* Title + Info */}
        <View className="w-40 ml-5 py-5 mr-1">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mb-2">
            Oily skin
          </Text>

          <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}>
            <Text>Oily skin is characterized by an </Text>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className="text-dark-pink">overproduction of sebum</Text> 
            <Text>, resulting in a </Text> 
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className="text-dark-pink">shiny complexion </Text>
            <Text>and </Text> 
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className="text-dark-pink">enlarged pores.</Text>
          </Text>
        </View>

        {/* Image */}
        <View>
          <Image className="w-48 h-40 rounded-r-xl" 
                          source={require('./../assets/images/category-oily.png')} />
        </View>
      </View>
      </Animated.View>

      {/* Trending + Newest buttons + search button */}
      <View className="flex-row justify-between mx-7 mb-2">

        <View className="flex-row">
          <TouchableOpacity className="border border-dark-pink bg-white rounded-xl px-4 py-1">
          <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                            className="text-dark-pink text-center">
                                Trending
                            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-400 bg-white rounded-xl px-4 py-1 ml-3">
          <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                            className="text-gray-400  text-center">
                                Newest
                            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View>
          {/* Search Icon */}
          <TouchableOpacity 
              className="">
              <Image className="w-5 h-5" style={{ tintColor: "gray"}}
                                      source={require('./../assets/icons/search.png')} />
            </TouchableOpacity>
        </View>

      </View>

      {/* Postcards */}
      <View>
        <PostCard />
      </View>
  
    </ScrollView>
  );
}