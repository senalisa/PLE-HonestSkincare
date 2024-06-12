import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ImageBackground, Image, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import PostCard from '../components/PostCard'; // Importeer je PostCard-component hier
import OtherUserCardComponent from './account/OtherUsersCardComponent';

export default function UsersProfile({ route }) {
    const { userId } = route.params;
    const navigation = useNavigation();
    const [userPosts, setUserPosts] = useState([]);
    const [displayName, setDisplayName] = useState('');
    const [postTypeFilter, setPostTypeFilter] = useState('all'); // State for postType filter

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userPostsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
                const userPostsSnapshot = await getDocs(userPostsQuery);
                const posts = userPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserPosts(posts);
                // Get the displayName from the first post object
                if (posts.length > 0) {
                    setDisplayName(posts[0].displayName);
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [userId]);

    // Filter posts based on postType
    const filteredPosts = userPosts.filter(post => postTypeFilter === 'all' || post.postType === postTypeFilter);


  return (
    <ScrollView>
      <StatusBar/>
      <View className="flex-[1]">

        {/* INTRO */}
      <ImageBackground source={require('./../assets/images/bg7.png')} resizeMode="cover" imageStyle= {{opacity:0.2}}>

            <View className="mt-12 mb-24 px-7">

                <View className="flex-row justify-between items-center pt-6 mb-4">

                    {/* Back button */}
                    <TouchableOpacity onPress={() => navigation.goBack()} className="pr-5">
                    <Image className="w-5 h-5" source={require('./../assets/icons/left-arrow.png')} />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold'}} className="text-center flex-1 -ml-9 text-2xl">
                    {userPosts.length > 0 && userPosts[0].displayName}
                    </Text>

                    {/* Spacer voor het centreren van de titel */}
                    <View className="flex-2" />

                </View>

            </View>

            </ImageBackground>

            <View className="bg-white outline outline-offset-6 py-5 -mt-5 rounded-t-[35px] h-full">

                <View className="-mt-28">  
                    <OtherUserCardComponent userId={userId} displayName={displayName} />
                </View>

                <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                className="text-xl px-7 mb-3">
                    {userPosts.length > 0 && userPosts[0].displayName}'s Posts
                </Text>

                {/* PostType filter buttons */}
                <View className="flex-row ml-4 mb-2">
                        {/* PostType filter buttons */}
                        <TouchableOpacity className={`border ${postTypeFilter === 'all' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-full px-4 py-1 ml-3`} onPress={() => setPostTypeFilter('all')}>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'all' ? 'dark-pink' : 'gray-400'} text-center`}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className={`border ${postTypeFilter === 'Advice' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-full px-4 py-1 ml-3`} onPress={() => setPostTypeFilter('Advice')}>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'Advice' ? 'dark-pink' : 'gray-400'} text-center`}>Advice</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className={`border ${postTypeFilter === 'Question' ? 'border-dark-pink' : 'border-gray-400'} bg-white rounded-full px-4 py-1 ml-3`} onPress={() => setPostTypeFilter('Question')}>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'Question' ? 'dark-pink' : 'gray-400'} text-center`}>Question</Text>
                        </TouchableOpacity>
                </View>

                <View className="mb-32">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                </View>

            </View>

      </View>
    </ScrollView>
  );
}
