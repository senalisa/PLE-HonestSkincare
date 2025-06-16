import { View, Text, ImageBackground, Image, TextInput, ScrollView, StatusBar, PixelRatio } from 'react-native'
import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import TopicAll from '../components/TopicAll';
import { Pressable } from 'react-native-gesture-handler';
import Search from '../components/Search';
import { useNavigation } from '@react-navigation/native';

export default function Discover() {
  const navigation = useNavigation();

   //Responsive font size
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = size => size / fontScale;

  const [articles, setArticles] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false); 

  // Function to open the Search Modal
  const openSearchModal = () => {
    setSearchVisible(true); 
  };

  // Function to close the Search Modal
  const closeSearchModal = () => {
    setSearchVisible(false); 
  };

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
      <ImageBackground source={require('./../assets/images/discover-bg-2.png')} resizeMode="cover" imageStyle= {{}}>

        <View className="mt-20 mb-10">

          {/* INTRO: Welcome user + text */}
          <View className="-mt-3 mb-0 px-8 flex-row justify-between">
            <View>
              <Text className="mb-1" style={{ fontFamily: 'Montserrat_600SemiBold',  fontSize: getFontSize(25) }}>Discover</Text>
              <Text className="" style={{ fontFamily: 'Montserrat_500Medium',  fontSize: getFontSize(13) }}>Read articles and scroll trough topics</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="px-10 flex-row justify-between mt-6">
            {/* Search Icon */}
            <Pressable 
                style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}
                onPress={openSearchModal}
              >
                <View className="shadow-md bg-white rounded-3xl w-full mb-5 py-0.5 flex-row items-center">
                  <Image style={{ width: 15, height: 15, margin: 10, tintColor: '#888' }} className="ml-5 mr-3" source={require('./../assets/icons/search.png')} />
                  <Text style={{ fontFamily: 'Montserrat_400Regular' }}
                  className="text-gray-500">
                    Search...
                  </Text>
                </View>
              </Pressable>

              {/* Search Modal */}
              <Search visible={searchVisible} onClose={closeSearchModal}/>
          </View>
   
        </View>

      </ImageBackground>

      <View className="bg-white outline outline-offset-6 h-full py-5 -mt-5 rounded-t-[35px] shadow-xl">

   <View className="flex-row justify-between items-center px-7 mt-2"> 
      {/* Title */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(18) }}>
        Trending Articles
      </Text>

      {/* All Articles Button */}
      <Pressable className="flex-row items-center border border-dark-pink bg-dark-pink rounded-full px-3 py-1" onPress={() => navigation.navigate('AllArticles')}>
        <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-white text-xs">
          All articles
        </Text>
        <Image
          style={{ width: 10, height: 10, marginLeft: 6, tintColor: '#FFF' }}
          source={require('./../assets/icons/right-arrow.png')}
        />
      </Pressable>
    </View>


      {/* Article cards */}
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
