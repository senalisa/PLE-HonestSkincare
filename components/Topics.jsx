import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'

export default function Topics() {
  return (
    <View className="flex-row"> 
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {/* Topic one */}
        <View 
        className="rounded-xl bg-light-beige px-6 py-6 drop-shadow-lg flex-row w-44 mr-4 ml-8">

            <View className="flex-wrap">
                <Text
                style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}
                className="w-20 pb-1">
                    Explore
                </Text>

                <Text
                style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                className="pb-3">
                    Oily Skin
                </Text>
            </View>

            <View>
                <Image className="w-14 h-14 mx-0" 
                                      source={require('./../assets/images/skincare.png')} />
            </View>
        </View>

         {/* Topic Two */}
         <View 
            className="rounded-xl bg-pastel-green px-6 py-5 drop-shadow-lg flex-row w-44 mr-4">

            <View className="flex-wrap">
                <Text
                style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}
                className="pb-1">
                    Explore
                </Text>

                <Text
                style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                className="w-20">
                    Acne + Oily Skin
                </Text>

            </View>

            <View>
                <Image className="w-14 h-14 mx-0" 
                                      source={require('./../assets/images/skincare.png')} />
            </View>
         </View>

         {/* Topic Three */}
         <View 
            className="rounded-xl bg-pastel-pink px-6 py-5 drop-shadow-lg flex-row w-44 mr-4">

            <View className="flex-wrap">
                <Text
                style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}
                className="pb-1">
                    Explore
                </Text>

                <Text
                style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                className="w-20">
                    Redness
                </Text>

            </View>

            <View>
                <Image className="w-14 h-14 mx-0" 
                                      source={require('./../assets/images/skincare.png')} />
            </View>
         </View>
    </ScrollView>
    </View>
  )
}