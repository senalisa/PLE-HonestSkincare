import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import Topics from '../components/Topics'
import PostCard from '../components/PostCard'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../config/firebase';


export default function Home() {
  const navigation = useNavigation()

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollectionRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postsCollectionRef);
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPosts.push({ id: doc.id, ...data });
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#63254E"/>
    }>
      <StatusBar/>
    <View className="flex-[1] white">

      {/* INTRO */}
      <ImageBackground source={require('./../assets/images/home-bg2.png')} resizeMode="cover" imageStyle= {{opacity:0.2}}>

        <View className="mt-10 mb-10">

          {/* INTRO: Logo + Notifications */}
          <View className="flex-row justify-between">
            <View className="flex mt-5 ml-4">
              <Image className="w-16 h-6 ml-2" 
                              source={require('./../assets/images/logo-plain-nobg.png')} />
            </View>

            <View className="flex-row">
              <TouchableOpacity onPress={() => navigation.navigate('UserCard')}>
                <Image className="w-6 h-6 mr-3 mt-6" 
                              source={require('./../assets/icons/id-card.png')} />
              </TouchableOpacity>
              <Image className="w-6 h-6 mr-7 mt-6" 
                              source={require('./../assets/icons/notification.png')} />
            </View>
          </View>

          {/* INTRO: Welcome user + text */}
          <View className="mx-auto mt-3 mb-8 px-10 flex justify-center">
            <Text className="mb-1 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Hi Sena</Text>
            <Text className="text-center" style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}>Let's take care of your skin!</Text>
          </View>

          <View className="px-10 flex-row justify-between">
  
            {/* Search Icon */}
            <TouchableOpacity 
              className="shadow-sm bg-white rounded-xl w-full mb-3 flex-row">
              <Image className="w-5 h-5 my-2 mx-5" style={{ tintColor: "#CBCACA"}}
                                      source={require('./../assets/icons/search.png')} />
              <TextInput
              placeholder='Search...'
              className="text-gray-200 text-md">

              </TextInput>
            </TouchableOpacity>
          </View>
   
        </View>

      </ImageBackground>

      <View className="bg-white rounded-t-[35px] outline outline-offset-6 h-full py-5 -mt-5">
        {/* Topics for you */}
        <View className="flex-row justify-between  px-8">
          <Text 
          style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
          className="pt-3">
            Topics for you
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('UserSkinType')}>
            <Text
             style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
             className="text-dark-pink pt-3 underline underline-offset-4"
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>

        {/* Topics Map */}
        <View className="mt-2">
          <Topics />
        </View>

        <View className="flex-row justify-between px-8 -mt-4">
          <Text 
          style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
          className="pt-7">
            Trending posts
          </Text>
        </View>

        <View className="mb-28">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
        
      </View>

    </View>
  </ScrollView>
  )
}

