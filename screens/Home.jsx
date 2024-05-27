import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import Topics from '../components/Topics'
import PostCard from '../components/PostCard'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import { useFocusEffect } from '@react-navigation/native';


export default function Home() {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);

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
      } else {
        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
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
    fetchUserPreferences();
    fetchPosts();
    fetchArticles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserPreferences();
      fetchPosts();
      fetchArticles();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
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

        <View className="">
            {articles.map((article) => (
              <TouchableOpacity key={article.id} article={article} onPress={() => navigation.navigate('Article', { articleId: article.id })}
              className="border border-gray-400 p-4 mx-10"> 
                <Text>hoiiii</Text>
              </TouchableOpacity>
            ))}
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

