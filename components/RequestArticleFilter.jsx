import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal'];
const SKIN_CONCERNS = [
  'Acne', 'Dryness', 'Hyperpigmentation', 'Redness', 'Sensitivity',
  'Wrinkles', 'Dark Spots', 'Clogged Pores', 'Oily Skin', 'Uneven Skin Tone'
];

export default function RequestArticleFilter() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedSkinType, setSelectedSkinType] = useState(route.params?.skinType || '');
  const [selectedConcerns, setSelectedConcerns] = useState(route.params?.skinConcerns || []);

  const toggleConcern = (concern) => {
    setSelectedConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const applyFilters = () => {
    navigation.navigate('RequestArticle', {
      filterSkinType: selectedSkinType,
      filterSkinConcerns: selectedConcerns
    });
  };

  return (
    <ScrollView className="bg-white p-6">
      <Text className="text-xl font-semibold mb-4">Filter article requests</Text>

      <Text className="text-base font-medium mb-2">Skin Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {SKIN_TYPES.map((type, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedSkinType(type)}
            className={`px-4 py-2 rounded-full border ${
              selectedSkinType === type ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-300'
            }`}
          >
            <Text className={selectedSkinType === type ? 'text-pink-600' : 'text-gray-600'}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-base font-medium mb-2">Skin Concerns</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {SKIN_CONCERNS.map((concern, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => toggleConcern(concern)}
            className={`px-4 py-2 rounded-full border ${
              selectedConcerns.includes(concern) ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-300'
            }`}
          >
            <Text className={selectedConcerns.includes(concern) ? 'text-pink-600' : 'text-gray-600'}>{concern}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={applyFilters}
        className="bg-dark-pink py-3 rounded-full"
      >
        <Text className="text-center text-white font-semibold">Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
