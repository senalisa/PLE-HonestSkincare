import { View, Text, Touchable } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function Profile() {

  const navigation = useNavigation()

  return (
    <View className="flex-1 items-center mt-20">
      <Text>Profile</Text>

      <TouchableOpacity onPress={() => navigation.navigate('UserSkinType')}>
        <Text>Change skin type </Text>
      </TouchableOpacity>
    </View>
  )
}