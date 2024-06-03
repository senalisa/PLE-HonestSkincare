import { View, Text, ImageBackground, Image, TextInput, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import TopicAll from '../components/TopicAll';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Discover() {
  const [articles, setArticles] = useState([]);

   // Function to fetch posts and filter based on user preferences
   const fetchArticles = async () => {
    try {
      const articlesCollectionRef = collection(db, 'articles');
      const querySnapshot = await getDocs(articlesCollectionRef);
      const fetchedArticles = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedArticles.push({ id: doc.id, ...data });
      });
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] white">

      {/* INTRO */}
      <ImageBackground source={require('./../assets/images/discover-bg.png')} resizeMode="cover" imageStyle= {{opacity:0.2}}>

        <View className="mt-10 mb-10">

          {/* INTRO: Logo + Notifications */}
          <View className="flex-row justify-end">
            <View className="flex mt-5 mr-4">
              <Image className="w-16 h-6 ml-2" 
                              source={require('./../assets/images/logo-plain-nobg.png')} />
            </View>
          </View>

          {/* INTRO: Welcome user + text */}
          <View className="-mt-3 mb-0 px-10 flex">
            <Text className="mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Discover</Text>
            <Text className="" style={{ fontFamily: 'Montserrat_400Regular', fontSize: 16 }}>Read articles and scroll trough topics</Text>
          </View>

          {/* Search Bar */}
          <View className="px-10 flex-row justify-between mt-6">
            <TouchableOpacity 
              className="shadow-sm bg-white rounded-xl w-full mb-3 flex-row">
              <Image className="w-5 h-5 my-2 mx-5" style={{ tintColor: "#CBCACA"}}
                  source={require('./../assets/icons/search.png')} />
              <TextInput
                placeholder='Search...'
                className="text-gray-200 text-md w-72">
              </TextInput>
            </TouchableOpacity>
          </View>
   
        </View>

      </ImageBackground>

      <View className="bg-white outline outline-offset-6 h-full py-5 -mt-5 rounded-t-[35px]">

      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }} className="mx-7 mt-2 text-center">Trending Articles</Text>
      {/* <Image className="w-48 h-10 justify-center mx-auto "
      source={require('./../assets/images/articles-text.png')} /> */}

      <View className="mb-20">
            <ArticleCard />
        </View>

         {/* Topics Map */}
        <View className="mt-2 mb-20">
          <TopicAll />
        </View>
        
      </View>

    </View>
  </ScrollView>
  )
}
