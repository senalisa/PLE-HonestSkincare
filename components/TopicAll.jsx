import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, PixelRatio } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function TopicAll() {
  //Responsive font size
      const fontScale = PixelRatio.getFontScale();
      const getFontSize = size => size / fontScale;

  const navigation = useNavigation();
  const [topics, setTopics] = useState({
    skinTypes: [],
    skinConcerns: [],
    products: [],
    sustainability: []
  });

  // Fetch the topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsCollectionRef = collection(db, 'topics');
        const querySnapshot = await getDocs(topicsCollectionRef);
        
        const skinTypes = [];
        const skinConcerns = [];
        const products = [];
        const sustainability = [];


        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (['Oily', 'Dry', 'Combination', 'Normal'].includes(data.topic)) {
            skinTypes.push(data);
          } else if (['Acne', 'Redness', 'Wrinkles', 'Dryness', 'Eye bags', 'Pores', 'Blackheads', 'Whiteheads', 'Rosacea'].includes(data.topic)) {
            skinConcerns.push(data);
          } else if (['Moisturizer', 'Cleanser', 'Toner', 'Serum', 'Sunscreen', 'Eye cream', 'Lipbalm'].includes(data.topic)) {
            products.push(data);
           } else if (['Vegan', 'Cruelty-Free', 'Plastic-Free', 'Refillable', 'Recyclable'].includes(data.topic)) {
            sustainability.push(data);
          }
        });

        setTopics({ skinTypes, skinConcerns, products, sustainability });
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  //Render the topics
  const renderTopics = (topics) => {
    return topics.map((topic, index) => (
      <Animated.View key={topic.topic} entering={FadeInDown.duration(3000).springify()}>
        <TouchableOpacity onPress={() => navigation.navigate('CategorySearch', { topicData: topic })}>
          <View className="bg-white border border-gray-200 mr-3 px-4 rounded-xl items-center shadow-sm">
            <Image source={{ uri: topic.topicImage }} className="w-12 h-[60] -mt-4 mb-2" />
            <View className="flex-wrap">
              <Text style={{ fontFamily: 'Montserrat_300Light' }} className="w-20 pb-0 text-center text-[10px]">Explore</Text>
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(13)}} className="pb-4 text-center w-[85]">{topic.topicName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ));
  };

  //Render the skincare product topics
  const renderTopicsProducts = (topics) => {
    return topics.map((topic, index) => (
      <Animated.View key={topic.topic} entering={FadeInDown.duration(3000).springify()}>
        <TouchableOpacity onPress={() => navigation.navigate('CategorySearch', { topicData: topic })}>
          <View className="bg-white border border-gray-200 mr-3 px-4 rounded-xl items-center shadow-sm py-3">
            <Image source={{ uri: topic.topicImage }} className="w-12 h-[45] -mt-6 mb-2" />
            <View className="flex-wrap">
              <Text style={{ fontFamily: 'Montserrat_300Light'}} className="w-20 pb-0 mt-2 text-center text-[10px]">Explore</Text>
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(13)}} className="pb-1 text-center w-[85]">{topic.topicName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ));
  };

  return (
    <View>
      {/* Skin Type Topics */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mx-7 mb-2">Skin Types</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="py-5 ml-6">
        {renderTopics(topics.skinTypes)}
      </ScrollView>

      {/* Skin Concerns Topics */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mx-7 mb-2">Skin Concerns</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="py-5 ml-6">
        {renderTopics(topics.skinConcerns)}
      </ScrollView>

      {/* Product Types Topics */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mx-7 mb-2">Products</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="py-5 ml-6">
        {renderTopicsProducts(topics.products)}
      </ScrollView>

      {/* Sustainability Topics */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mx-7 mb-2">Sustainability</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="py-5 ml-6">
        {renderTopics(topics.sustainability)}
      </ScrollView>
    </View>
  );
}
