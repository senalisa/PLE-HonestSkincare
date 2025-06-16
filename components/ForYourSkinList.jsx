import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ForYourSkinList({ terms }) {
  const navigation = useNavigation();

  if (!terms || terms.length === 0) return null;

  return (
    <View className=" mb-2">
      <Text className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
        For your skin
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {terms.map((item, index) => (
          <Pressable
            key={index}
            className="mr-4 items-center"
            onPress={() => navigation.navigate('IngredientDetail', {
              ingredientName: item.name,  ingredientId: item.id
            })}
          >
           {/* <View className="bg-white border border-gray-200 mr-3 px-4 rounded-xl items-center shadow-sm">
                       <Image source={{ uri: item.imageUrl }} className="w-12 h-[60] -mt-4 mb-2" />
                       <View className="flex-wrap">
                         <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="pb-4 text-center w-[85] text-md">{item.name}</Text>
                       </View>
            </View> */}

            <View className="flex items-center justify-center pr-3 pt-4">
            <Image
                source={{
                uri: item.imageUrl
                }}
                style={{ width: 90, height: 90 }}
                className="border-gray-200 rounded-xl shadow-sm"
            />
            <View className="mt-3">
                <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-center font-medium text-gray-800 text-md">
                {item.name}
                </Text>
            </View>
            </View>

          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
