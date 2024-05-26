import React, { useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Linking } from 'react-native';

export default function PostDetail({ route }) {
    const { post } = route.params;

    const navigation = useNavigation()

    const [showReplies, setShowReplies] = useState(false); 

    const toggleReplies = () => {
        setShowReplies(!showReplies); 
    };

    // Functie om de URL van het product te openen in de standaardbrowser
  const openProductURL = (url) => {
    if (url && typeof url === 'string') {
      Linking.openURL(url)
        .then(() => console.log('URL geopend'))
        .catch((error) => console.error('Fout bij het openen van URL:', error));
    } else {
      console.error('Ongeldige URL:', url);
    }
  };

  return (
    <ScrollView className="bg-[#FAFAFA]">
        <StatusBar></StatusBar>
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
                                {post.postType}
                            </Text>
                </View>
            </View> 
        
            {/* Post info card */}
            <View className="flex-row justify-between">
                {/* Title */}
                <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 19 }}
                        className="pt-3 px-1 mb-3 w-80">
                       {post.title}
                </Text>

                {/* Save */}
                <TouchableOpacity>
                        <Image className="w-5 h-5 mt-3 ml-8" style={{ tintColor: "gray"}}
                                                source={require('./../assets/icons/save.png')} />
                </TouchableOpacity>
            </View>

            <View className="flex-row mt-2 flex-wrap">
                {/* Tags */}
                <View className="flex-row">
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
                {/* Description */}
                <Text 
                        style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}
                        className="pt-5 px-1 mb-3 w-100">
                        {post.description}
                </Text>
            </View>
            
            <View>
                {post.products.map((product, index) => (
                    <View key={index} className="bg-white shadow-sm rounded-md flex-row mt-4 py-2 px-5 justify-between">
                    {/* Product */}

                    <View className="flex-row">
                        {/* Image */}
                        <Image className="w-12 h-12 mr-5" source={{ uri: product.productImage }} />

                        <View className="flex-wrap mt-2">
                        {/* Product name */}
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}>
                            {product.productName}
                        </Text>

                        {/* Brand name */}
                        <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 15 }}>
                            {product.brandName}
                        </Text>
                        </View>
                    </View>

                    {/* Button */}
                    <TouchableOpacity onPress={() => openProductURL(product.productURL)}>
                        <View className="bg-dark-pink flex-row rounded-full mt-3 px-4 py-1.5">
                        <Image className="w-2.5 h-2.5" style={{ tintColor: "white" }} source={require('./../assets/icons/link.png')} />

                        <Text className="text-white ml-1" style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}>
                            Link
                        </Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                ))}
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