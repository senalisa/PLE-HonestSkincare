import React from 'react';
import { Modal, View, Text, Pressable, Image } from 'react-native';

export default function ExpertPopUp({ visible, onClose, onViewProfile }) {
  const author = {
    name: 'Dr. Leyla Taner',
    role: 'Skin therapist',
    image: require('./../assets/images/dermatoloog1.jpg'),
    bio: 'Specialized in eczema and skin aging. More than 10 years of experience.',
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center"
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-white p-8 rounded-2xl w-11/12">
          <View className="items-center">
            <Image source={author.image} className="w-20 h-20 rounded-full mb-4" />
            <Text className="text-xl font-bold mb-1">{author.name}</Text>
            <Text className="text-sm text-gray-500 mb-3">{author.role}</Text>
            <Text className="text-center mb-5">{author.bio}</Text>

            <Pressable onPress={onViewProfile} className="bg-dark-pink px-4 py-2 rounded-full">
              <Text className="text-white font-semibold">View Profile</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
