import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function Search({ visible, onClose }) {
    const navigation = useNavigation();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [postTypeFilter, setPostTypeFilter] = useState('all');

    const [selectedSkinType, setSelectedSkinType] = useState('Oily skin');
    const [selectedSkinConcern, setSelectedSkinConcern] = useState('Acne');
    const [skinTypeModalVisible, setSkinTypeModalVisible] = useState(false);
    const [skinConcernModalVisible, setSkinConcernModalVisible] = useState(false);

    const skinTypes = ['Oily', 'Dry', 'Combination', 'Normal'];
    const skinConcerns = ['Acne', 'Redness', 'Wrinkles', 'Dryness', 'Eye bags', 'Pores', 'Blackheads', 'Whiteheads', 'Rosacea'];

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
        const filteredResults = allPosts.filter(post => {
            if (postTypeFilter === 'all') {
                return post.title.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return post.title.toLowerCase().includes(searchTerm.toLowerCase()) && post.postType === postTypeFilter;
            }
        });
        setSearchResults(filteredResults);
    }, [searchTerm, allPosts, postTypeFilter]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="bg-white h-screen px-0 pt-10">

                <View className="bg-white mb-3 px-7">
                    <View className="flex-row justify-between items-center bg-white pt-6 mb-4">
                    {/* Back button */}
                    <TouchableOpacity onPress={onClose} className="pr-5">
                        <Image className="w-4 h-4" source={require('./../assets/icons/close.png')} />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }} className="text-center flex-1 -ml-8">
                        Search
                    </Text>

                    {/* Spacer voor het centreren van de titel */}
                    <View className="flex-2" />
                    </View>
                </View>

                <View className="">
                    <View className="shadow-sm bg-white rounded-xl w-[375px] mb-3 flex-row mx-auto py-1">
                        <Image className="w-5 h-5 my-2 mx-5" style={{ tintColor: "#CBCACA" }} source={require('./../assets/icons/search.png')} />
                        <TextInput
                            placeholder="Search..."
                            value={searchTerm}
                            onChangeText={text => setSearchTerm(text)}
                            className="w-full"
                            placeholderTextColor="gray"
                        />
                    </View>

                    <View className="flex-row mx-auto mt-2">

                        {/* Skin Type */}
                        <TouchableOpacity
                        className="flex-row justify-between items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-[182] mr-3"
                        onPress={() => setSkinTypeModalVisible(true)}
                        >
                        <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-ms text-center">{selectedSkinType}</Text>
                        <Image className="w-3 h-3 mr-1 mt-1" 
                                            source={require('./../assets/icons/down2.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity
                        className="flex-row justify-between items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-[182]"
                        onPress={() => setSkinConcernModalVisible(true)}
                        >
                        <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-ms text-center">{selectedSkinConcern}</Text>
                        <Image className="w-3 h-3 mr-1 mt-1" 
                                            source={require('./../assets/icons/down2.png')} />
                        </TouchableOpacity>

                    </View>

                    <View className="flex-row mx-auto mt-3 mb-3">
                        {/* PostType filter buttons */}
                        <TouchableOpacity className={`border ${postTypeFilter === 'all' ? 'border-dark-pink bg-dark-pink' : 'border-gray-200 bg-white'} rounded-full px-10 py-1 ml-1`} onPress={() => setPostTypeFilter('all')}>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'all' ? 'white' : 'gray-400'} text-center`}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className={`border ${postTypeFilter === 'Advice' ? 'border-dark-pink bg-dark-pink' : 'border-gray-200 bg-white'} rounded-full px-10 py-1 ml-3`} onPress={() => setPostTypeFilter('Advice')}>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'Advice' ? 'white' : 'gray-400'} text-center`}>Advice</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className={`border ${postTypeFilter === 'Question' ? 'border-dark-pink bg-dark-pink' : 'border-gray-200 bg-white'} rounded-full px-9 py-1 ml-3`} onPress={() => setPostTypeFilter('Question')}>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }} className={`text-${postTypeFilter === 'Question' ? 'white' : 'gray-400'} text-center`}>Question</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={searchResults}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 5 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: item, postId: item.id })}>
                                    <View className="relative rounded-xl bg-white shadow mx-7 px-4 py-4 mt-4">
                                        <View className="flex-row">
                                            <View className="flex-1 flex-wrap">
                                                <View className="bg-dark-pink rounded-xl w-20 p-0.5 ml-1">
                                                    <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-white text-center text-xs">
                                                        {item.postType}
                                                    </Text>
                                                </View>
                                                <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="pt-3 px-1 mb-3 w-80 text-lg">
                                                    {item.title}
                                                </Text>
                                                <View className="flex-row pt-1 flex-wrap">
                                                    {item.skinTypeTags.map((tag, index) => (
                                                        <TouchableOpacity key={index} className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1 my-1">
                                                            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-center text-blue text-[11px]">
                                                                {tag}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                    {item.skinConcernTags.map((tag, index) => (
                                                        <TouchableOpacity key={index} className="bg-yellow border border-dark-yellow rounded-xl px-3 py-0.5 mx-1 my-1">
                                                            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-center text-dark-yellow text-[11px]">
                                                                {tag}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                    {item.skincareProductTags.map((tag, index) => (
                                                        <TouchableOpacity key={index} className="bg-pinkie border border-pink rounded-xl px-3 py-0.5 mx-1 my-1">
                                                            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-center text-pink text-[11px]">
                                                                {tag}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                            <View className="absolute top-2 right-2">
                                                <TouchableOpacity>
                                                    <Image className="w-5 h-5" style={{ tintColor: "gray" }} source={require('./../assets/icons/save.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="flex-row justify-between pt-4 mx-1">
                                            <View className="flex-row">
                                                <View>
                                                    <Image className="w-6 h-6" source={require('./../assets/images/user.png')} />
                                                </View>
                                                <View className="flex-row pt-1.5 mx-2">
                                                    <Text style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                                        {item.displayName}
                                                    </Text>
                                                    <Image className="w-1 h-1 mt-1 ml-3" style={{ tintColor: "#63254E" }} source={require('./../assets/images/user.png')} />
                                                    <Text className="ml-3" style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                                                        1 day ago
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="flex-row ml-3 mt-1">
                                                <View className="flex-row">
                                                    <Image className="w-4 h-4" style={{ tintColor: "gray" }} source={require('./../assets/icons/like.png')} />
                                                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }} className="pl-1">
                                                        100
                                                    </Text>
                                                </View>
                                                <View className="flex-row ml-3">
                                                    <Image className="w-5 h-5 -mt-0.5" style={{ tintColor: "gray" }} source={require('./../assets/icons/speech-bubble.png')} />
                                                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }} className="pl-1">
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

             {/* Modal voor Skin Type */}
                <Modal
        animationType="fade"
        transparent={true}
        visible={skinTypeModalVisible}
        onRequestClose={() => setSkinTypeModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white p-5 rounded-lg w-80 py-10">
            
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-center mb-5 text-base">
              Choose a Skin Type
            </Text>

            <View className="flex-row flex-wrap w-full items-center justify-center">
            {skinTypes.map((concern) => (
              <TouchableOpacity
                key={concern}
                className="bg-light-blue border-2 border-blue px-5 py-1.5 rounded-full mr-2 mb-2"
                onPress={() => {
                  setSelectedSkinConcern(concern);
                  setSkinConcernModalVisible(false);
                }}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                className="text-center text-md text-blue">{concern}</Text>
              </TouchableOpacity>
            ))}
            </View>

            <TouchableOpacity
              className="bg-dark-pink py-2 mx-12 rounded-full mt-8"
              onPress={() => setSkinTypeModalVisible(false)}
            >
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                    className="text-white text-center">Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
                </Modal>

            {/* Modal voor Skin Concern */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={skinConcernModalVisible}
                    onRequestClose={() => setSkinConcernModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="bg-white p-5 rounded-lg w-80 py-10">
                        
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                        className="text-center mb-5 text-base">
                        Choose a Skin Concern
                        </Text>

                        <View className="flex-row flex-wrap w-full items-center justify-center">
                        {skinConcerns.map((concern) => (
                        <TouchableOpacity
                            key={concern}
                            className="bg-yellow border-2 border-dark-yellow px-5 py-1.5 rounded-full mr-2 mb-2"
                            onPress={() => {
                            setSelectedSkinConcern(concern);
                            setSkinConcernModalVisible(false);
                            }}
                        >
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                            className="text-center text-md text-dark-yellow">{concern}</Text>
                        </TouchableOpacity>
                        ))}
                        </View>

                        <TouchableOpacity
                        className="bg-dark-pink py-2 mx-12 rounded-full mt-8"
                        onPress={() => setSkinConcernModalVisible(false)}
                        >
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                                className="text-white text-center">Cancel</Text>
                        </TouchableOpacity>

                    </View>
                    </View>
                </Modal>
        </Modal>
    );
}
