import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';

const skinTypes = ['All', 'Dry', 'Normal', 'Combination', 'Oily'];
const skinConcerns = ['Acne', 'Redness', 'Wrinkles', 'Eyebags', 'Hyperpigmentation'];
const ingredientTags = ['Antioxidant', 'Hydration', 'Soothing', 'Exfoliate', 'Texture', 'UV Filter', 'Active', 'Emulsifier', 'Absorbent'];

export default function FilterModal({
  visible,
  onClose,
  selectedSkinType,
  setSelectedSkinType,
  selectedConcerns,
  setSelectedConcerns,
  selectedTags,
  setSelectedTags,
  onApply,
  onClear
}) {
  const toggleItem = (item, list, setList) => {
    setList(list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item]);
  };

  return (
<Modal visible={visible}  transparent onRequestClose={onClose}>
  <Pressable
    className="flex-1 bg-black/50 justify-end"
    onPress={onClose} 
  >
    <Pressable
      className="bg-white rounded-t-3xl px-6 pt-10 pb-20"
      onPress={(e) => e.stopPropagation()} 
    >
        <Text className="text-2xl text-center font-semibold mb-2" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Add Filters</Text>
        <Text className="text-center text-sm text-gray-500 mb-6" style={{ fontFamily: 'Montserrat_400Regular' }}>Specify your search for ingredients</Text>

        {/* Skin Type */}
        <Text className="text-lg font-semibold mb-2" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Skin type</Text>
        <View className="flex-row flex-wrap mb-4">
          {skinTypes.map((type, i) => (
            <Pressable
              key={i}
              onPress={() => setSelectedSkinType(type)}
              className={`px-4 py-1 rounded-full mr-2 mb-2 border ${selectedSkinType === type ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
            >
              <Text className={`text-sm ${selectedSkinType === type ? 'text-blue-500' : 'text-black'}`}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Skin Concern */}
        <Text className="text-lg font-semibold mb-2" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Skin Concern</Text>
        <View className="flex-row flex-wrap mb-4">
          {skinConcerns.map((concern, i) => (
            <Pressable
              key={i}
              onPress={() => toggleItem(concern, selectedConcerns, setSelectedConcerns)}
              className={`px-4 py-1 rounded-full mr-2 mb-2 border ${selectedConcerns.includes(concern) ? 'border-pink-400' : 'border-gray-300'}`}
            >
              <Text className={`text-sm ${selectedConcerns.includes(concern) ? 'text-pink-500' : 'text-black'}`}>
                {concern}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Ingredient Type */}
        <Text className="text-lg font-semibold mb-2" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Ingredient Type</Text>
        <View className="flex-row flex-wrap mb-8">
          {ingredientTags.map((tag, i) => (
            <Pressable
              key={i}
              onPress={() => toggleItem(tag, selectedTags, setSelectedTags)}
              className={`px-4 py-1 rounded-full mr-2 mb-2 border ${selectedTags.includes(tag) ? 'border-red-400' : 'border-gray-300'}`}
            >
              <Text className={`text-sm ${selectedTags.includes(tag) ? 'text-red-400' : 'text-black'}`}>
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Buttons */}
        <View className="items-center">
          <Pressable onPress={onApply} className="w-full py-3 rounded-full bg-dark-pink mb-4">
            <Text className="text-white text-center text-base font-semibold" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Apply Filter</Text>
          </Pressable>
          <Pressable onPress={onClear}>
            <Text className="text-black text-sm" style={{ fontFamily: 'Montserrat_500Medium' }}>Clear All</Text>
          </Pressable>
        </View>
      </Pressable>
      </Pressable>
    </Modal>
  );
}
