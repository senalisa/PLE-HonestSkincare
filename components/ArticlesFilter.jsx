import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, PixelRatio} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const skinTypes = ['All', 'Dry', 'Normal', 'Combination', 'Oily'];
const skinConcerns = ['Acne', 'Redness', 'Wrinkles', 'Eyebags', 'Hyperpigmentation'];
const ingredientTags = ['Antioxidant', 'Hydration', 'Soothing', 'Exfoliate', 'Texture', 'UV Filter', 'Active', 'Emulsifier', 'Absorbent'];
const sustainabilityTags = ['Vegan', 'Cruelty-free', 'Fragrance-free', 'Recyclable'];
const articleTypes = ['Routine Helper', 'Deep Dive', 'Tips & Tricks', 'Skincare Myths'];

export default function ArticlesFilter() {
  const navigation = useNavigation();
  const route = useRoute();

  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSustainability, setSelectedSustainability] = useState([]);
  const [selectedArticleTypes, setSelectedArticleTypes] = useState([]);

  useEffect(() => {
    const {
      selectedSkinType = 'All',
      selectedConcerns = [],
      selectedTags = [],
      selectedSustainability = [],
      selectedArticleTypes = [],
    } = route.params || {};

    setSelectedSkinType(selectedSkinType);
    setSelectedConcerns(selectedConcerns);
    setSelectedTags(selectedTags);
    setSelectedSustainability(selectedSustainability);
    setSelectedArticleTypes(selectedArticleTypes);
  }, []);

  const toggleItem = (item, list, setList) => {
    setList(list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item]);
  };

  const handleApply = () => {
    navigation.navigate('AllArticles', {
      selectedSkinType,
      selectedConcerns,
      selectedTags,
      selectedSustainability,
      selectedArticleTypes,
    });
  };

  const handleClear = () => {
    setSelectedSkinType('All');
    setSelectedConcerns([]);
    setSelectedTags([]);
    setSelectedSustainability([]);
    setSelectedArticleTypes([]);
  };

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <Pressable onPress={() => navigation.goBack()} className="absolute top-20 left-5 z-10">
        <Image source={require('../assets/icons/left-arrow.png')} style={{ width: 20, height: 20 }} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-center font-semibold mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(20) }}>Add Filters</Text>
        <Text className="text-center text-gray-500 mb-6" style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }}>Specify your search for articles</Text>

        {[{
          title: 'Skin type', options: skinTypes, state: selectedSkinType, setState: setSelectedSkinType, single: true
        }, {
          title: 'Skin Concern', options: skinConcerns, state: selectedConcerns, setState: setSelectedConcerns
        }, {
          title: 'Ingredient Type', options: ingredientTags, state: selectedTags, setState: setSelectedTags
        }, {
          title: 'Sustainability', options: sustainabilityTags, state: selectedSustainability, setState: setSelectedSustainability
        }, {
          title: 'Article Type', options: articleTypes, state: selectedArticleTypes, setState: setSelectedArticleTypes
        }].map((section, index) => (
          <View key={index} className="mb-4">
            <Text className="font-semibold mb-2" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16) }}>{section.title}</Text>
            <View className="flex-row flex-wrap">
              {section.options.map((option, i) => {
                const selected = section.single ? section.state === option : section.state.includes(option);
                return (
                  <Pressable
                    key={i}
                    onPress={() => section.single ? section.setState(option) : toggleItem(option, section.state, section.setState)}
                    className={`px-4 py-1 rounded-full mr-2 mb-3 border ${selected ? 'border-dark-pink ' : 'border-gray-300'}`}
                  >
                    <Text className={`${selected ? 'text-dark-pink' : 'text-black'}`} style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12)}}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <View className="items-center mt-8 mb-16">
          <Pressable onPress={handleApply} className="w-full py-3 rounded-full bg-dark-pink mb-4">
            <Text className="text-white text-center font-semibold" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16) }}>Apply Filter</Text>
          </Pressable>
          <Pressable onPress={handleClear}>
            <Text className="text-black" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(16) }}>Clear All</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
