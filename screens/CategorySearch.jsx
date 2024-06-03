import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react';
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native'
import PostCardOld from '../components/PostCardOld';
import { useRoute } from '@react-navigation/native';
import { collection, getDocs, query, where, arrayContains } from 'firebase/firestore';
import { db } from '../config/firebase';
import PostCard from '../components/PostCard';

export default function CategorySearch() {

  const navigation = useNavigation()

  const route = useRoute();
  const topicData = route.params.topicData;

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const postsCollectionRef = collection(db, 'posts');
        const queryBySkinType = query(postsCollectionRef, where('skinTypeTags', 'array-contains', topicData.topic));
        const queryBySkinConcerns = query(postsCollectionRef, where('skinConcernTags', 'array-contains', topicData.topic));

        const querySnapshotBySkinType = await getDocs(queryBySkinType);
        const querySnapshotBySkinConcerns = await getDocs(queryBySkinConcerns);

        const postsBySkinType = querySnapshotBySkinType.docs.map(doc => doc.data());
        const postsBySkinConcerns = querySnapshotBySkinConcerns.docs.map(doc => doc.data());

        const allRelatedPosts = [...postsBySkinType, ...postsBySkinConcerns];
        setRelatedPosts(allRelatedPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    fetchRelatedPosts();
  }, [topicData]);

  useEffect(() => {
    const sortPosts = () => {
      if (sortBy === 'newest') {
        // Sorteer de posts op basis van de meest recent gemaakt
        setRelatedPosts(prevPosts => prevPosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else if (sortBy === 'trending') {
        // Willekeurige volgorde
        setRelatedPosts(prevPosts => prevPosts.slice().sort(() => Math.random() - 0.5));
      }
    };

    sortPosts();
  }, [sortBy]);

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
            Topics about {topicData.topicName}
          </Text>
  
          {/* Spacer voor het centreren van de titel */}
          <View className="flex-2" />
        </View> 
      </View>

      {/* Info-card Skin type/concern */}
      <Animated.View entering={FlipInEasyX.delay(100).duration(2000).springify()}>
    
      <View className="flex-row shadow-md mx-7 rounded-xl mb-8 items-center">
      <ImageBackground source={require('./../assets/images/topic-bg.png')} imageStyle= {{opacity:0.1}} className="flex-row items-center rounded-xl border-gray-100" style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5'}}>
        {/* Title + Info */}
        <View className="w-40 ml-5 py-5 mr-9">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="mb-2 text-lg">
            {topicData.topicName}
          </Text>

          <Text style={{ fontFamily: 'Montserrat_500Medium'}} className="text-[13px]">
            {topicData.topicText}
          </Text>
        </View>

        {/* Image */}
        <View>
          <Image className="w-[110] h-[135] rounded-r-xl mr-10" 
                          source={{ uri: topicData.topicImage }} />
        </View>
        </ImageBackground>
      </View>
     
      </Animated.View>

      {/* Trending + Newest buttons + search button */}
      <View className="flex-row justify-between mx-7 mb-2">
        <View className="flex-row">
          <TouchableOpacity className={`border ${sortBy === 'trending' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1`} onPress={() => setSortBy('trending')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${sortBy === 'trending' ? 'dark-pink' : 'gray-400'} text-center`}>Trending</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`border ${sortBy === 'newest' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1 ml-3`} onPress={() => setSortBy('newest')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${sortBy === 'newest' ? 'dark-pink' : 'gray-400'} text-center`}>Newest</Text>
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
      <View className="mb-32">
        {relatedPosts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </View>
  
    </ScrollView>
  );
}