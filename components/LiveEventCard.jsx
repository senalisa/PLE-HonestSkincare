// LiveEventCard.jsx – horizontale kaart met afbeelding links en info rechts
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

export default function LiveEventCard({ event, onPress }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('LiveEventModal', { event  });
  };

  return (
     <TouchableOpacity
      onPress={onPress}
      className="flex-row bg-white rounded-2xl mx-3 mb-3 shadow-sm w-80"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 4
      }}
    >
      <Image
        source={event.image}
        style={{
          width: 100,
          height: 120,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          resizeMode: 'cover'
        }}
      />

      <View className="flex-1 px-4 py-4 justify-center">
        <Text className="text-xs text-gray-500">
          {format(new Date(event.date), 'dd MMM, yyyy')} - {event.time}
        </Text>
        <Text className="text-base font-semibold text-gray-900 mt-1" numberOfLines={2}>
          {event.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Image
            source={require('../assets/icons/marker.png')}
            style={{ width: 12, height: 12, tintColor: 'gray', marginRight: 4 }}
          />
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {event.location || event.platform}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
