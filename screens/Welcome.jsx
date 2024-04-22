import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Welcome() {
  const navigation = useNavigation()
  return (
    <View className="flex-1 items-center justify-center bg-white">
     <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text>Sign up</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text>Login</Text>
     </TouchableOpacity>
    </View>
  )
}