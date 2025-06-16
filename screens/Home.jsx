import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import Topics from '../components/Topics';
import PostCard from '../components/PostCard';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import ArticleCard from '../components/ArticleCard';
import Search from '../components/Search';

export default function Home() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false); 

  // Function to open the Search Modal
  const openSearchModal = () => {
    setSearchVisible(true); 
  };

  // Function to close the Search Modal
  const closeSearchModal = () => {
    setSearchVisible(false); 
  };

  // Function to fetch user preferences
  const fetchUserPreferences = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userPreferencesCollectionRef = collection(db, 'userPreferences');
        const userPreferencesQuery = query(userPreferencesCollectionRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(userPreferencesQuery);
        if (!querySnapshot.empty) {
          const userPreferencesData = querySnapshot.docs[0].data();
          setUserPreferences(userPreferencesData);
          // console.log('Fetched user preferences:', userPreferencesData);  // Log user preferences
        }
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  // Function to fetch posts and filter based on user preferences
  const fetchPosts = async () => {
    try {
      const postsCollectionRef = collection(db, 'posts');
      const querySnapshot = await getDocs(postsCollectionRef);
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPosts.push({ id: doc.id, ...data });
      });

      // Filter posts based on user preferences
      if (userPreferences) {
        const filteredPosts = fetchedPosts.filter(post => {
          const hasMatchingSkinType = post.skinTypeTags.includes(userPreferences.skinType);
          const hasMatchingSkinConcerns = userPreferences.skinConcerns.some(concern => post.skinConcernTags.includes(concern));
          return hasMatchingSkinType && hasMatchingSkinConcerns;
        });
        setPosts(filteredPosts);
        // console.log('Filtered posts based on user preferences:', filteredPosts);  // Log filtered posts
      } else {
        setPosts(fetchedPosts);
        console.log('Fetched posts without filtering:', fetchedPosts);  // Log fetched posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences !== null) {
      fetchPosts();
    }
  }, [userPreferences]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserPreferences();
    }, [])
  );

  return (
    <ScrollView 
      >
      <StatusBar/>
      <View className="flex-[1] white">

        {/* INTRO */}
        <ImageBackground source={require('./../assets/images/home-bg5.png')} resizeMode="cover">

          <View className="mt-10 mb-10">

            {/* INTRO: Logo + Notifications */}
            <View className="flex-row justify-between">
              <View className="flex mt-5 ml-4">
                <Image className="w-16 h-6 ml-2" 
                                source={require('./../assets/images/logo-plain-nobg.png')} />
              </View>

              <View className="flex-row">
                <Image className="w-6 h-6 mr-7 mt-6" 
                                source={require('./../assets/icons/notification.png')} />
              </View>
            </View>

            {/* INTRO: Welcome user + text */}
            <View className="mx-auto mt-3 mb-8 px-10 flex justify-center">
              <Text className="mb-1 text-center text-2xl" style={{ fontFamily: 'Montserrat_600SemiBold'}}>Hi {auth.currentUser.displayName}</Text>
              <Text className="text-center text-sm" style={{ fontFamily: 'Montserrat_400Regular'}}>Let's take care of your skin!</Text>
            </View>

            <View className="px-10 flex-row justify-between">

              {/* Search Icon */}
              <TouchableOpacity 
                style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}
                onPress={openSearchModal}
              >
                <View className="shadow-md bg-white rounded-xl w-full mb-5 flex-row items-center">
                  <Image style={{ width: 20, height: 20, margin: 10, tintColor: '#CBCACA' }} className="ml-5 mr-3" source={require('./../assets/icons/search.png')} />
                  <Text style={{ fontFamily: 'Montserrat_500Medium_Italic' }}
                  className="text-gray-300">
                    Search...
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Search Modal */}
              <Search visible={searchVisible} onClose={closeSearchModal}/>
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
              style={{ fontFamily: 'Montserrat_500Medium' }}
              className="text-dark-pink pt-3 underline underline-offset-4 text-sm"
              >
                Change
              </Text>
            </TouchableOpacity>
          </View>

          {/* Topics Map */}
          <View className="mt-2">
            <Topics userPreferences={userPreferences}/>
          </View>

          <View className="flex-row justify-between px-8 -mt-4">
            <Text 
            style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
            className="pt-7">
              Trending posts
            </Text>
          </View>

          {/* Posts map */}
          <View className="mb-28">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
          
        </View>

      </View>
    </ScrollView>
  );
}
