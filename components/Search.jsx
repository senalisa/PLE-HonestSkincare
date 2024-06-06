import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Search({ visible, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const postsCollectionRef = collection(db, 'posts');
          const querySnapshot = await getDocs(postsCollectionRef);
          const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAllPosts(fetchedPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
  
      fetchPosts();
    }, []);
  
    useEffect(() => {
      const filteredResults = allPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setSearchResults(filteredResults);
    }, [searchTerm, allPosts]);
  

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="bg-white h-screen px-0 pt-20">
        <View className="">
            <View className="shadow-sm bg-white rounded-xl w-[375] mb-3 flex-row mx-auto">
                <Image className="w-5 h-5 my-2 mx-5" style={{ tintColor: "#CBCACA"}}
                  source={require('./../assets/icons/search.png')} />
                <TextInput
                    placeholder="Search..."
                    value={searchTerm}
                    onChangeText={text => setSearchTerm(text)}
                    className=""
                />
             </View>

             <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 10 }}>
                {/* Post Two */}
                    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: post, postId: post.id })}>
                        <View className="relative rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
                            <View className="flex-row">
                                {/* Post info */}
                                <View className="flex-1 flex-wrap">
                                    {/* Tag */}
                                    <View className="bg-dark-pink rounded-xl w-20 p-0.5 ml-1">
                                        <Text 
                                            style={{ fontFamily: 'Montserrat_500Medium' }}
                                            className="text-white text-center text-xs">
                                            {item.postType}
                                        </Text>
                                    </View>

                                    {/* Title */}
                                    <Text 
                                        style={{ fontFamily: 'Montserrat_600SemiBold'}}
                                        className="pt-3 px-1 mb-3 w-80 text-lg">
                                        {item.title}
                                    </Text>

                                    {/* Tags */}
                                    <View className="flex-row pt-1 flex-wrap">
                                        {item.skinTypeTags.map((tag, index) => (
                                            <TouchableOpacity 
                                                key={index}
                                                className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1 my-1">
                                                <Text 
                                                    style={{ fontFamily: 'Montserrat_600SemiBold' }}
                                                    className="text-center text-blue text-[11px]">
                                                    {tag}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}

                                        {item.skinConcernTags.map((tag, index) => (
                                            <TouchableOpacity 
                                                key={index}
                                                className="bg-yellow border border-dark-yellow rounded-xl px-3 py-0.5 mx-1 my-1">
                                                <Text 
                                                    style={{ fontFamily: 'Montserrat_600SemiBold'}}
                                                    className="text-center text-dark-yellow text-[11px]">
                                                    {tag}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}

                                        {item.skincareProductTags.map((tag, index) => (
                                            <TouchableOpacity 
                                                key={index}
                                                className="bg-pinkie border border-pink rounded-xl px-3 py-0.5 mx-1 my-1">
                                                <Text 
                                                    style={{ fontFamily: 'Montserrat_600SemiBold' }}
                                                    className="text-center text-pink text-[11px]">
                                                    {tag}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Save Button */}
                                <View className="absolute top-2 right-2">
                                    <TouchableOpacity>
                                        <Image className="w-5 h-5" style={{ tintColor: "gray" }}
                                            source={require('./../assets/icons/save.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Info about post */}
                            <View className="flex-row justify-between pt-4 mx-1">
                                {/* Author + date */}
                                <View className="flex-row">
                                    <View>
                                        <Image className="w-6 h-6" 
                                            source={require('./../assets/images/user.png')} />
                                    </View>

                                    <View className="flex-row pt-1.5 mx-2">
                                        <Text
                                            style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                            {item.displayName}
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
                                <View className="flex-row ml-3 mt-1">
                                    {/* Likes */}
                                    <View className="flex-row">
                                        <Image className="w-4 h-4 " style={{ tintColor: "gray"}}
                                            source={require('./../assets/icons/like.png')} />
                                        <Text 
                                            style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                                            className="pl-1">
                                            100
                                        </Text>
                                    </View>

                                    {/* Comments */}
                                    <View className="flex-row ml-3">
                                        <Image className="w-5 h-5 -mt-0.5" style={{ tintColor: "gray"}}
                                            source={require('./../assets/icons/speech-bubble.png')} />

                                        <Text 
                                            style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                                            className="pl-1">
                                            45
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id}
            />

            <View className="my-20 bg-white"></View>
        </View>
      </View>
    </Modal>
  );
}
