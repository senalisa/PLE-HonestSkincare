// LiveEventModal.jsx – pop-up modal gecentreerd met transparante achtergrond
import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Linking,
  Modal,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function LiveEventModal({ event, onClose }) {


  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <View
        className="bg-white rounded-2xl p-5"
        style={{ width: width * 0.9, maxHeight: '90%' }}
      >
        {/* Afbeelding */}
        <Image
          source={event.image}
          style={{
            width: '100%',
            height: 140,
            borderRadius: 12,
            marginBottom: 16
          }}
        />

        {/* Titel */}
        <Text className="text-xl font-semibold mb-3 text-center">{event.title}</Text>

        {/* Datum + Tijd */}
        <Text className="text-sm text-gray-500 mb-1 text-center">
          🗓️ {format(new Date(event.date), 'dd MMMM yyyy')} – ⏰ {event.time}
        </Text>

        {/* Expert */}
        <Text className="text-sm text-gray-500 mb-3 text-center">
          🎙️ Hosted by {event.expert?.name}
        </Text>

        {/* Beschrijving */}
        <Text className="text-base text-gray-700 mb-6 text-center">
          {event.description}
        </Text>

        {/* Externe link */}
        <Pressable
          onPress={() => Linking.openURL(event.link)}
          className="bg-dark-pink py-3 px-6 rounded-full mb-4"
        >
          <Text className="text-white text-center font-semibold">
            Join Live on {event.platform}
          </Text>
        </Pressable>

        {/* Sluiten */}
        <Pressable onPress={onClose} className="self-center">
          <Text className="text-sm text-gray-500 mb-3 underline">Close</Text>
        </Pressable>
      </View>
    </View>
  );
}
