import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import React from 'react'

import { useNavigation } from '@react-navigation/native'

export default function PostCard({ post }) {
    const navigation = useNavigation()

  return (
    <View> 
        {/* Post Two */}
        <Animated.View entering={FadeInDown.delay(100).duration(3000).springify()}>
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: post })}>
            <View className="rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
            <View className="flex-row">

                {/* Post info */}
                <View className="flex-wrap">
                    {/* Tag */}
                    <View className="bg-dark-pink rounded-xl w-20 p-0.5 ml-1">
                        <Text 
                        style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                        className="text-white text-center">
                            {post.postType}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                        className="pt-3 px-1 mb-3 w-72">
                         {post.title}
                    </Text>

                    {/* Tags */}
                    <View className="flex-row pt-1">
                    {post.skinTypeTags.map((tag, index) => (
                        <TouchableOpacity 
                        key={index}
                        className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1">
                        <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="text-center text-blue">
                            {tag}
                        </Text>
                        </TouchableOpacity>
                    ))}

                    {post.skinConcernTags.map((tag, index) => (
                        <TouchableOpacity 
                        key={index}
                        className="bg-yellow border border-dark-yellow rounded-xl px-3 py-0.5 mx-1">
                        <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="text-center text-dark-yellow">
                            {tag}
                        </Text>
                        </TouchableOpacity>
                    ))}

                    {post.skincareProductTags.map((tag, index) => (
                        <TouchableOpacity 
                        key={index}
                        className="bg-pinkie border border-pink rounded-xl px-3 py-0.5 mx-1">
                        <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="text-center text-pink">
                            {tag}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                </View>

                <View>
                    {/* Save */}
                    <TouchableOpacity>
                                    <Image className="w-5 h-5 mt-0 ml-8" style={{ tintColor: "gray"}}
                                                            source={require('./../assets/icons/save.png')} />
                    </TouchableOpacity>
                </View>
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
                        style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                            Jane Ipsum
                        </Text>

                        <Image className="w-1 h-1 mt-1 ml-3" style={{ tintColor: "#63254E"}}
                                                source={require('./../assets/images/user.png')} />

                        <Text 
                        className="ml-3"
                        style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
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
            </View>
            </View>
            </TouchableOpacity>
        </Animated.View>
    </View>
  )
}