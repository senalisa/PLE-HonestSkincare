import React, { useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function PostDetail() {

    const navigation = useNavigation()

    const [showReplies, setShowReplies] = useState(false); 

    const toggleReplies = () => {
        setShowReplies(!showReplies); 
    };

  return (
    <ScrollView className="bg-[#FAFAFA]">
         <View className="bg-white px-7 pt-10 rounded-b-3xl shadow-sm">
            <View
            className="flex-row justify-between bg-white pt-6 mb-4">
                {/* Back button */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image className="w-5 h-5" 
                                    source={require('./../assets/icons/left-arrow.png')} />
                </TouchableOpacity>

                {/* Question or advise tag */}
                <View className="border border-dark-pink bg-white rounded-xl w-20 p-0.5">
                            <Text 
                            style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                            className="text-dark-pink text-center">
                                Advise
                            </Text>
                </View>
            </View> 
        
            {/* Post info card */}
            <View className="flex-row justify-between">
                {/* Title */}
                <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 19 }}
                        className="pt-3 px-1 mb-3 w-80">
                        Moisturizer X helped me with my oily skin and cleared my acne
                </Text>

                {/* Save */}
                <TouchableOpacity>
                        <Image className="w-5 h-5 mt-3 ml-8" style={{ tintColor: "gray"}}
                                                source={require('./../assets/icons/save.png')} />
                </TouchableOpacity>
            </View>

            <View className="flex-row mt-2">
                {/* Tags */}
                <TouchableOpacity className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1">
                            <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="text-center text-blue">Oily skin</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-yellow border border-dark-yellow rounded-xl px-3 py-0.5 mr-1">
                            <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="text-center text-dark-yellow">Acne</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-pinkie border border-pink rounded-xl px-3 py-0.5">
                            <Text 
                            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="text-center text-pink">Moisturizer</Text>
                </TouchableOpacity>
            </View>
            
            <View>
                {/* Description */}
                <Text 
                        style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}
                        className="pt-5 px-1 mb-3 w-100">
                        Since a couple of years I’ve had acne on my cheeks and forehead. I tried a lot of things to get rid of it, but it was really hard because i have an oily skin. 
                        {"\n"} {"\n"}
                        Till I met the Moisturizer X. At first I experienced a little bit of purging, but after a week or so my skin started to clear up. I’ve already used 3 bottles of this moisturizer. That’s why I really recommend this product. 
                </Text>
            </View>

            <View className="bg-white shadow-sm rounded-md flex-row mt-4 py-2 px-5 justify-between">
                {/* Product */}

                <View className="flex-row">
                    {/* Image */}
                    <Image className="w-12 h-12 mr-5" 
                                            source={require('./../assets/images/moisturizer.png')} />

                    <View className="flex-wrap mt-2">
                        {/* Product name */}
                        <Text  style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}>
                            Moisturizer X
                        </Text>

                        {/* Brand name */}
                        <Text  style={{ fontFamily: 'Montserrat_400Regular', fontSize: 15 }}>
                            Brand Name
                        </Text>
                    </View>
                </View>

                {/* Button */}
                <TouchableOpacity>
                    <View className="bg-dark-pink flex-row rounded-full mt-3 px-4 py-1.5">
                        <Image className="w-2.5 h-2.5" style={{ tintColor: "white"}}
                                                    source={require('./../assets/icons/link.png')} />

                        <Text className="text-white ml-1" style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}>
                            Check it out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View className="flex-row mt-8 mb-8 justify-between">
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
                <View className="flex-row mt-1">
                    {/* Likes */}
                    <View className="flex-row">
                        <Image className="w-5 h-5 " style={{ tintColor: "gray"}}
                                            source={require('./../assets/icons/like.png')} />
                        <Text 
                        style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                        className="pl-2 mt-0.5">
                            100
                        </Text>
                    </View>
                </View>
            </View>

        </View>

        {/* Comments */}
        <View className="mx-8 my-8 pb-20">
            <View className="flex-row justify-between">
                {/* Title */}
                <View className="flex-row">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                      className="mr-1">
                    2
                </Text>

                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                      className="">
                    Comments
                </Text>
                </View>

                {/* Button */}
                <TouchableOpacity>
                    <View className="bg-[#D9D9D9] flex-row rounded-full px-4 py-1.5">
                        <Image className="w-2.5 h-2.5" style={{ tintColor: "black"}}
                                                    source={require('./../assets/icons/pencil.png')} />

                        <Text className="text-black ml-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}>
                            Write a comment
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            {/* Comment PARENT */}
            <View className="mt-5 shadow-sm px-0 pt-0">
                {/* User Name + date */}
                <View className="flex-row justify-between">
                        <View className="flex-row">
                            <View>
                                <Image className="w-6 h-6" 
                                                        source={require('./../assets/images/user.png')} />
                            </View>

                            <View className="flex-row pt-1.5 mx-2">
                                <Text
                                style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                    user12459
                                </Text>

                                <Image className="w-1 h-1 mt-1 ml-3" style={{ tintColor: "#63254E"}}
                                                        source={require('./../assets/images/user.png')} />

                                <Text 
                                className="ml-3"
                                style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                    16h
                                </Text>
                            </View>
                        </View>

                        {/* like + reply button */}
                        <View className="flex-row justify-end mt-1">
                            {/* Likes */}
                            <View className="flex-row">
                                <Image className="w-4 h-4" style={{ tintColor: "gray"}}
                                                    source={require('./../assets/icons/like.png')} />
                                <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                                className="pl-2 text-gray-600">
                                    26
                                </Text>
                            </View>

                            {/* Reply */}
                            <View className="flex-row ml-4">
                                <Image className="w-4 h-4" style={{ tintColor: "gray"}}
                                                    source={require('./../assets/icons/reply.png')} />
                                <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                                className="pl-0 ml-1 text-gray-600">
                                    Reply
                                </Text>
                            </View>
                        </View>
                </View>

                <View>
                    {/* Comment itself */}
                    <Text 
                        style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}
                        className="pt-3 px-1 mb-3 w-100">
                            Thank you so much for your advise! I’ve got a question though: 
                            You’ve said that you experiences some breakouts the first time u started using it. What kind of breakouts was it? Like small pimples or redness?
                    </Text>
                </View>
            </View>

            {/* View replies / Hide replies knop */}
            {showReplies ? (
                <TouchableOpacity onPress={toggleReplies}>
                    <View className="flex-row mt-1 ml-5">
                        <Image className="w-3 h-3 mr-1" 
                            source={require('./../assets/icons/up.png')} />
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}> 
                            Hide replies
                        </Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={toggleReplies}>
                    <View className="flex-row mt-1 ml-5">
                        <Image className="w-3 h-3 mr-1" 
                            source={require('./../assets/icons/down.png')} />
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}> 
                            View replies
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Comment reply CHILDREN*/}
            {showReplies && (
            <View className="flex justify-end mt-2 shadow-sm px-4 py-3 ml-8">
                {/* User Name + date */}
                {/* User Name + date */}
                <View className="flex-row justify-between">
                        <View className="flex-row">
                            <View>
                                <Image className="w-6 h-6" 
                                                        source={require('./../assets/images/user.png')} />
                            </View>

                            <View className="flex-row pt-1.5 mx-2">
                                <Text
                                style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                    user12459
                                </Text>

                                <Image className="w-1 h-1 mt-1 ml-3" style={{ tintColor: "#63254E"}}
                                                        source={require('./../assets/images/user.png')} />

                                <Text 
                                className="ml-3"
                                style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                    16h
                                </Text>
                            </View>
                        </View>

                        {/* like + reply button */}
                        <View className="flex-row justify-end mt-1">
                            {/* Likes */}
                            <View className="flex-row">
                                <Image className="w-4 h-4" style={{ tintColor: "gray"}}
                                                    source={require('./../assets/icons/like.png')} />
                                <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                                className="pl-2 text-gray-600">
                                    26
                                </Text>
                            </View>

                            {/* Reply */}
                            <View className="flex-row ml-4">
                                <Image className="w-4 h-4" style={{ tintColor: "gray"}}
                                                    source={require('./../assets/icons/reply.png')} />
                                <Text 
                                style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                                className="pl-0 ml-1 text-gray-600">
                                    Reply
                                </Text>
                            </View>
                        </View>
                </View>

                <View>
                    {/* Comment itself */}
                    <Text 
                        style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}
                        className="pt-3 px-1 mb-3 w-100">
                            I've experienced more redness. I didnt saw new pimples or anything.
                    </Text>
                </View>
            </View>
            )}

        </View>
    </ScrollView>
  )
}