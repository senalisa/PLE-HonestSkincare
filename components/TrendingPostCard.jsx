import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'

export default function TrendingPostCard() {
  return (
    <View> 
        {/* Post One */}
        <View className="rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
        <View className="flex-row">
            {/* Profile picture */}
            <View>
                <Image className="w-10 h-10" 
                                        source={require('./../assets/images/user.png')} />
            </View>

            {/* Post info */}
            <View className="flex-wrap">
                {/* Tag */}
                <View className="border border-dark-beige rounded-xl w-20 mx-5">
                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }}
                    className="text-dark-beige text-center">
                        Question
                    </Text>
                </View>

                {/* Title */}
                <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                    className=" mx-5 mt-3 w-60">
                    Searching for a facial cleansing that doesn't leave the skin dry
                </Text>

                {/* Author + date */}
                <View className="flex-row pt-3 mx-5">
                    <Text
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}>
                        Jane Ipsum
                    </Text>

                    <Text 
                    className="ml-5"
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}>
                        1 day ago
                    </Text>
                </View>
            </View>

            {/* Save */}
            <TouchableOpacity>
                <Image className="w-5 h-5 mt-2" style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/bookmark.png')} />
            </TouchableOpacity>
        </View>

        {/* Info about post */}
        <View className="flex-row justify-between pt-6">
            {/* Likes + Comments */}
            <View className="flex-row ml-3">
                {/* Likes */}
                <View className="flex-row">
                    <Image className="w-4 h-4 " style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/like.png')} />
                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-1">
                        100
                    </Text>
                </View>

                {/* Comments */}
                <View className="flex-row ml-3">
                    <Image className="w-5 h-5 -mt-0.5" style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/speech-bubble.png')} />

                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-1">
                        45
                    </Text>
                </View>
            </View>

            {/* Tags */}
            <View className="flex-row">
                <TouchableOpacity className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-2">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Oily skin</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-pinkie border border-pink rounded-xl px-3 py-0.5">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Cleanser</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>

        {/* Post Two */}
        <View className="rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
        <View className="flex-row">
            {/* Profile picture */}
            <View>
                <Image className="w-10 h-10" 
                                        source={require('./../assets/images/user.png')} />
            </View>

            {/* Post info */}
            <View className="flex-wrap">
                {/* Tag */}
                <View className="border border-dark-beige rounded-xl w-32 mx-5">
                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }}
                    className="text-dark-beige text-center">
                        Recommendation
                    </Text>
                </View>

                {/* Title */}
                <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                    className=" mx-5 mt-3 w-60">
                    Moisturizer X helped me with my acne
                </Text>

                {/* Author + date */}
                <View className="flex-row pt-3 mx-5">
                    <Text
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}>
                        Jane Ipsum
                    </Text>

                    <Text 
                    className="ml-5"
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}>
                        1 day ago
                    </Text>
                </View>
            </View>

            {/* Save */}
            <TouchableOpacity>
                <Image className="w-5 h-5 mt-2" style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/bookmark.png')} />
            </TouchableOpacity>
        </View>

        {/* Info about post */}
        <View className="flex-row justify-between pt-6">
            {/* Likes + Comments */}
            <View className="flex-row ml-3">
                {/* Likes */}
                <View className="flex-row">
                    <Image className="w-4 h-4 " style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/like.png')} />
                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-1">
                        100
                    </Text>
                </View>

                {/* Comments */}
                <View className="flex-row ml-3">
                    <Image className="w-5 h-5 -mt-0.5" style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/speech-bubble.png')} />

                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-1">
                        45
                    </Text>
                </View>
            </View>

            {/* Tags */}
            <View className="flex-row">
                <TouchableOpacity className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-0">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Oily skin</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Acne</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-pinkie border border-pink rounded-xl px-3 py-0.5">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Cleanser</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>

         {/* Post Three */}
         <View className="rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
        <View className="flex-row">
            {/* Profile picture */}
            <View>
                <Image className="w-10 h-10" 
                                        source={require('./../assets/images/user.png')} />
            </View>

            {/* Post info */}
            <View className="flex-wrap">
                {/* Tag */}
                <View className="border border-dark-beige rounded-xl w-20 mx-5">
                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }}
                    className="text-dark-beige text-center">
                        Question
                    </Text>
                </View>

                {/* Title */}
                <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                    className=" mx-5 mt-3 w-60">
                    Searching for a facial cleansing that doesn't leave the skin dry
                </Text>

                {/* Author + date */}
                <View className="flex-row pt-3 mx-5">
                    <Text
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}>
                        Jane Ipsum
                    </Text>

                    <Text 
                    className="ml-5"
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 13 }}>
                        1 day ago
                    </Text>
                </View>
            </View>

            {/* Save */}
            <TouchableOpacity>
                <Image className="w-5 h-5 mt-2" style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/bookmark.png')} />
            </TouchableOpacity>
        </View>

        {/* Info about post */}
        <View className="flex-row justify-between pt-6">
            {/* Likes + Comments */}
            <View className="flex-row ml-3">
                {/* Likes */}
                <View className="flex-row">
                    <Image className="w-4 h-4 " style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/like.png')} />
                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-1">
                        100
                    </Text>
                </View>

                {/* Comments */}
                <View className="flex-row ml-3">
                    <Image className="w-5 h-5 -mt-0.5" style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/speech-bubble.png')} />

                    <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-1">
                        45
                    </Text>
                </View>
            </View>

            {/* Tags */}
            <View className="flex-row">
                <TouchableOpacity className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-2">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Oily skin</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-pinkie border border-pink rounded-xl px-3 py-0.5">
                    <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                    className="text-center">Cleanser</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </View>
  )
}