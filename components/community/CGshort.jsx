import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function CGShort() {
  const navigation = useNavigation()

  return (
    <ScrollView className="flex-1 bg-white pt-16">

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image className="absolute top-0 left-7 w-5 h-5" 
                                    source={require('../../assets/icons/left-arrow.png')} />
       </TouchableOpacity>

      <View>
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl text-center">
          Community Guidelines
        </Text>
      </View>

      <View className="mx-auto mt-10 mb-5">
        <Image className="w-32 h-20" source={require('../../assets/images/Guidelines.png')} />
      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl text-dark-pink">
          Welcome to Honest Skincare!
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base w-80 text-dark-pink">
          We’re delighted to have you join our community! To keep our space positive and supportive, please follow these key guidelines:
        </Text>
      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl">
          Trust & Respect
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base w-80">
          Please treat everyone with kindness and respect. Honest Skincare is a safe space for all, and harassment or hate speech will not be tolerated.
        </Text>
      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl">
          Share Authentically
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base w-80">
          We encourage you to share your genuine skincare experiences and advice. Avoid sharing false or misleading information, so we can all learn and grow together.
        </Text>
      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl">
          Content Guidelines: No Marketing
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base w-80">
          We want you to feel happy and comfortable here. That’s why we don’t allow spam or self-promotion. Please refrain from posting links to external websites or products.
        </Text>
      </View>

      <View className="px-8 mt-5">
        <Text>
          <Text className="text-base" style={{ fontFamily: 'Montserrat_400Regular'}}>
          For any questions or more detailed information, {"\n"}please visit our{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('CGLong')} className="pt-1">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
            className="text-dark-pink underline text-base pt-1">Full Community Guidelines</Text>
          </TouchableOpacity>
        </Text>
      </View>

      <TouchableOpacity className="rounded-full bg-dark-pink px-20 py-3 flex-row mx-auto mt-10 mb-32"
                            onPress={() => navigation.navigate('UserSkinType')}>
             <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                    className="text-white text-xl"
             >I agree</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}