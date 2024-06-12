import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PostCardProfile from '../../components/PostCardProfile'; 
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { FlipInEasyX } from 'react-native-reanimated';

export default function UserPosts() {
    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              // Query alleen posts die door de ingelogde gebruiker zijn gemaakt
              const postsRef = collection(db, 'posts');
              const q = query(postsRef, where('userId', '==', user.uid));
              const querySnapshot = await getDocs(q);
              
              querySnapshot.docs.forEach(doc => {
                console.log("Document data:", doc.data());
              });
      
              const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setPosts(userPosts);
            }
          } catch (error) {
            console.error("Error fetching posts: ", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchPosts();
      }, []);
      
  
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#63254E" />
        </View>
      );
    }

  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <StatusBar />
      <View className="flex-1 bg-white h-screen">
        <View className="mt-12 mb-24">

          <View className="px-7 ">

          <View className="flex-row justify-between items-center bg-white pt-6 mb-4">
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} className="pr-5">
            <Image className="w-5 h-5" source={require('../../assets/icons/left-arrow.png')} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="text-center flex-1 -ml-4">
            {auth.currentUser.displayName}'s Posts
          </Text>

          {/* Spacer voor het centreren van de titel */}
          <View className="flex-2" />
          </View>
           
           {/* <Text className="text-md mt-2" style={{ fontFamily: 'Montserrat_500Medium_Italic' }}>Swipe on a post to edit or delete</Text> */}
          </View>

          {/* Info-card Skin type/concern */}
        <Animated.View entering={FlipInEasyX.delay(100).duration(2000).springify()}>
            <View className="shadow-md bg-white mx-7 mt-4 rounded-xl mb-5">
                <ImageBackground source={require('../../assets/images/boost-bg2.png')} style={{ borderRadius: 20, overflow: 'hidden' }}>
                    {/* Title + Info */}
                    <View className="p-5">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="mb-2 text-lg text-dark-pink">
                        Boost your posts!
                        </Text>
                        <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-[13px] w-40">
                        Get more responses by boosting your post. Increase visibility and engagement from our skincare community.
                        </Text>
                    </View>

                    {/* Button */}
                    <View>
                        <TouchableOpacity className="bg-dark-pink py-2 px-4 w-28 rounded-full ml-5 mb-5">
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                            className="text-white text-xs text-center">Boost now!</Text>
                        </TouchableOpacity>
                </View>
                </ImageBackground>
            </View>
        </Animated.View>

          <View className="mb-28">
            {posts.length === 0 ? (
              <Text>No posts found.</Text>
            ) : (
              posts.map(post => (
                <PostCardProfile key={post.id} post={post} />
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
