import { View, Text, Pressable, Image, PixelRatio } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import React from 'react'

import { useNavigation } from '@react-navigation/native'

export default function PostCard({ post }) {
    const navigation = useNavigation()

     //Responsive font size
              const fontScale = PixelRatio.getFontScale();
              const getFontSize = size => size / fontScale;

  return (
    <View> 
    {/* Post Card */}
    <Animated.View entering={FadeInDown.delay(0).duration(2000).springify()}>
        <Pressable onPress={() => navigation.navigate('PostDetail', { post: post, postId: post.id })}>
            <View className="relative rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
                <View className="flex-row">
                    {/* Post info */}
                    <View className="flex-1 flex-wrap">
                        {/* Tag */}
                        <View className="bg-dark-pink rounded-xl w-20 p-0.5 ml-1">
                            <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                                className="text-white text-center">
                                {post.postType}
                            </Text>
                        </View>

                        {/* Title */}
                        <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                            className="pt-3 px-1 mb-3 w-80">
                            {post.title}
                        </Text>

                        {/* Tags */}
                        <View className="flex-row pt-1 flex-wrap">
                            {post.skinTypeTags.map((tag, index) => (
                                <Pressable 
                                    key={index}
                                    className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1 my-1">
                                    <Text 
                                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(11) }}
                                        className="text-center text-blue text-[11px]">
                                        {tag}
                                    </Text>
                                </Pressable>
                            ))}

                            {post.skinConcernTags.map((tag, index) => (
                                <Pressable 
                                    key={index}
                                    className="bg-yellow border border-dark-yellow rounded-xl px-3 py-0.5 mx-1 my-1">
                                    <Text 
                                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(11)}}
                                        className="text-center text-dark-yellow text-[11px]">
                                        {tag}
                                    </Text>
                                </Pressable>
                            ))}

                            {post.skincareProductTags.map((tag, index) => (
                                <Pressable 
                                    key={index}
                                    className="bg-pink-light border border-pink rounded-xl px-3 py-0.5 mx-1 my-1">
                                    <Text 
                                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(11) }}
                                        className="text-center text-pink text-[11px]">
                                        {tag}
                                    </Text>
                                </Pressable>
                            ))}

                            {post.sustainabilityTags.map((tag, index) => (
                                <Pressable 
                                    key={index}
                                    className="bg-green-50 border border-green-800 rounded-xl px-3 py-0.5 mx-1 my-1">
                                    <Text 
                                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(11) }}
                                        className="text-center text-green-800 text-[11px]">
                                        {tag}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Save Button */}
                    {/* <View className="absolute top-2 right-2">
                        <Pressable>
                            <Image className="w-5 h-5" style={{ tintColor: "gray" }}
                                source={require('./../assets/icons/save.png')} />
                        </Pressable>
                    </View> */}
                </View>

                {/* Info about post */}
                <View className="flex-row justify-between pt-4 mx-1">
                    {/* Author + date */}
                    <View className="flex-row">
                        <View>
                            <Image className="w-6 h-6" 
                                source={require('./../assets/images/user.png')} />
                        </View>

                        <View className="flex-row pt-1.5 mx-2">
                            <Text
                                className="text-gray-500"
                                style={{ fontFamily: 'Montserrat_500Regular', fontSize: getFontSize(12) }}>
                                {post.displayName}
                            </Text>

                            <Image className="w-1 h-1 mt-1.5 ml-3" style={{ tintColor: "#888"}}
                                source={require('./../assets/images/user.png')} />

                            <Text 
                                className="ml-3 text-gray-500"
                                style={{ fontFamily: 'Montserrat_500Regular', fontSize: getFontSize(12) }}>
                                1 day ago
                            </Text>
                        </View>
                    </View>

                    {/* Likes + Comments */}
                    <View className="flex-row ml-3 mt-1">
                        {/* Likes */}
                        <View className="flex-row">
                            <Image className="w-4 h-4 " style={{ tintColor: "gray"}}
                                source={require('./../assets/icons/like.png')} />
                            <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                                className="pl-1 text-gray-500">
                                100
                            </Text>
                        </View>

                        {/* Comments */}
                        <View className="flex-row ml-3">
                            <Image className="w-5 h-5 -mt-0.5" style={{ tintColor: "gray"}}
                                source={require('./../assets/icons/speech-bubble.png')} />

                            <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                                className="pl-1 text-gray-500">
                                45
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    </Animated.View>
</View>

  )
}