import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image, ImageBackground, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import PostCard from '../components/PostCard';
import Animated from 'react-native-reanimated';
import { FlipInEasyX } from 'react-native-reanimated';

export default function CategorySearch() {
  const navigation = useNavigation();
  const route = useRoute();
  const topicData = route.params.topicData;

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [postTypeFilter, setPostTypeFilter] = useState('all'); // Filter state
  const [filteredPosts, setFilteredPosts] = useState([]); // New state to hold sorted and filtered posts

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const postsCollectionRef = collection(db, 'posts');
        const queryBySkinType = query(postsCollectionRef, where('skinTypeTags', 'array-contains', topicData.topic));
        const queryBySkinConcerns = query(postsCollectionRef, where('skinConcernTags', 'array-contains', topicData.topic));
        const queryBySkincareProduct = query(postsCollectionRef, where('skincareProductTags', 'array-contains', topicData.topic));

        const querySnapshotBySkinType = await getDocs(queryBySkinType);
        const querySnapshotBySkinConcerns = await getDocs(queryBySkinConcerns);
        const querySnapshotBySkincareProduct = await getDocs(queryBySkincareProduct);

        const postsBySkinType = querySnapshotBySkinType.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const postsBySkinConcerns = querySnapshotBySkinConcerns.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const postsBySkincareProduct = querySnapshotBySkincareProduct.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const allRelatedPosts = [...postsBySkinType, ...postsBySkinConcerns, ...postsBySkincareProduct];
        setRelatedPosts(allRelatedPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    fetchRelatedPosts();
  }, [topicData]);

  useEffect(() => {
    const sortAndFilterPosts = () => {
      let filtered = relatedPosts;
  
      // Filteren op basis van postType
      if (postTypeFilter !== 'all') {
        console.log('Filtered posts before:', filtered);  // Toegevoegde regel voor debugging
        filtered = filtered.filter(post => post.postType === postTypeFilter);
        console.log('Filtered posts after:', filtered);  // Toegevoegde regel voor debugging
      }
  
      // Sorteren
      if (sortBy === 'newest') {
        filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === 'trending') {
        filtered = filtered.slice().sort(() => Math.random() - 0.5);
      }
  
      setFilteredPosts(filtered);
    };
  
    sortAndFilterPosts();
  }, [sortBy, postTypeFilter, relatedPosts]);
  

  return (
    <ScrollView className="bg-white">
      <StatusBar />

      <View className="bg-white pt-10 mb-4 px-7 ">
        <View className="flex-row justify-between items-center bg-white pt-6 mb-4">
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image className="w-5 h-5" source={require('./../assets/icons/left-arrow.png')} />
          </TouchableOpacity>

          {/* Title */}
          <View className="w-72">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="text-center flex-1 -ml-4">
            Topics about {topicData.topicName}
          </Text>
          </View>

          {/* Spacer voor het centreren van de titel */}
          <View className="flex-2" />
        </View>
      </View>

      {/* Info-card Skin type/concern */}
      <Animated.View entering={FlipInEasyX.delay(100).duration(2000).springify()}>
        <View className="flex-row shadow-md mx-7 rounded-xl mb-8 items-center">
          <ImageBackground source={require('./../assets/images/topic-bg.png')} imageStyle={{ opacity: 0.1 }} className="flex-row items-center rounded-xl border-gray-100" style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5' }}>
            {/* Title + Info */}
            <View className="w-40 ml-5 py-5 mr-9">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="mb-2 text-lg">
                {topicData.topicName}
              </Text>
              <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-[13px]">
                {topicData.topicText}
              </Text>
            </View>

            {/* Image */}
            <View>
              <Image className="w-[110] h-[135] rounded-r-xl mr-10" source={{ uri: topicData.topicImage }} />
            </View>
          </ImageBackground>
        </View>
      </Animated.View>

      <View className="px-8 flex-row justify-between">
              {/* Search Icon */}
              <TouchableOpacity 
                className="shadow-sm bg-white rounded-xl w-full mb-5 flex-row">
                <Image className="w-5 h-5 my-2 mx-5" style={{ tintColor: "#CBCACA"}}
                                        source={require('./../assets/icons/search.png')} />
                <TextInput
                placeholder='Search...'
                className="text-gray-200 text-xs">
                </TextInput>
              </TouchableOpacity>
      </View>

      {/* Trending + Newest + PostType buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mx-7 mb-2">
        <TouchableOpacity className={`border ${sortBy === 'trending' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1`} onPress={() => setSortBy('trending')}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${sortBy === 'trending' ? 'dark-pink' : 'gray-400'} text-center`}>Trending</Text>
        </TouchableOpacity>

        <TouchableOpacity className={`border ${sortBy === 'newest' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1 ml-3`} onPress={() => setSortBy('newest')}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${sortBy === 'newest' ? 'dark-pink' : 'gray-400'} text-center`}>Newest</Text>
        </TouchableOpacity>

        {/* PostType filter buttons */}
        <TouchableOpacity className={`border ${postTypeFilter === 'all' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1 ml-3`} onPress={() => setPostTypeFilter('all')}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'all' ? 'dark-pink' : 'gray-400'} text-center`}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity className={`border ${postTypeFilter === 'Advice' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1 ml-3`} onPress={() => setPostTypeFilter('Advice')}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'Advice' ? 'dark-pink' : 'gray-400'} text-center`}>Advice</Text>
        </TouchableOpacity>

        <TouchableOpacity className={`border ${postTypeFilter === 'Question' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-xl px-4 py-1 ml-3`} onPress={() => setPostTypeFilter('Question')}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'Question' ? 'dark-pink' : 'gray-400'} text-center`}>Question</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Postcards */}
      <View className="mb-32">
        {filteredPosts.map((post) => (  
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </ScrollView>
  );
}
