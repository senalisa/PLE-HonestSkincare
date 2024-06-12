import { View, Text, Image } from 'react-native'
import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function CGLong() {
  const navigation = useNavigation()

  return (
    <ScrollView>
    <View className="flex-1 bg-white pt-16 pb-16">

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="px-5 py-2">
                    <Image className="absolute top-0 left-7 w-5 h-5" 
                                    source={require('../../assets/icons/left-arrow.png')} />
       </TouchableOpacity>

      <View className="flex items-center">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl text-center -mt-4 w-60">
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
         className="text-base  text-dark-pink">
          To ensure a positive and supportive environment for everyone, we've established the following community guidelines. By participating in our community, you agree to adhere to these rules.
        </Text>
      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl mb-2">
          Our Values
        </Text>

        <Text>
          <Text className="text-base text-dark-pink" style={{ fontFamily: 'Montserrat_600SemiBold'}}>
            Respect: 
          </Text>
            <Text style={{ fontFamily: 'Montserrat_400Regular'}}
            className="text-base"> Treat everyone with kindness and respect.</Text>
        </Text>

        <Text>
          <Text className="text-base text-dark-pink" style={{ fontFamily: 'Montserrat_600SemiBold'}}>
          Inclusivity: 
          </Text>
            <Text style={{ fontFamily: 'Montserrat_400Regular'}}
            className="text-base"> Embrace diversity and include everyone, regardless of their background.</Text>
        </Text>

        <Text>
          <Text className="text-base text-dark-pink" style={{ fontFamily: 'Montserrat_600SemiBold'}}>
          Authenticity: 
          </Text>
            <Text style={{ fontFamily: 'Montserrat_400Regular'}}
            className="text-base"> Share genuine experiences and advice.</Text>
        </Text>

        <Text>
          <Text className="text-base text-dark-pink" style={{ fontFamily: 'Montserrat_600SemiBold'}}>
          Support: 
          </Text>
            <Text style={{ fontFamily: 'Montserrat_400Regular'}}
            className="text-base"> Encourage and uplift fellow community members.</Text>
        </Text>

      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base  pb-3">
          We do not tolerate behavior that goes against our values. This includes, but is not limited to:
        </Text>

        <Text style={{ fontFamily: 'Montserrat_500Medium'}}
         className="text-base ">
          •  Harassment, bullying, or hate speech
        </Text>
        <Text style={{ fontFamily: 'Montserrat_500Medium'}}
         className="text-base ">
          •  Sharing false or misleading information
        </Text>
        <Text style={{ fontFamily: 'Montserrat_500Medium'}}
         className="text-base ">
          •  Spamming or excessive self-promotion
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base  pt-5">
          If someone engages in unacceptable behavior, they will receive a warning. Repeated violations may result in a ban from the community.
        </Text>
      </View>

      <View className="px-8 mt-5">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl mb-2 mt-2">
          Content Guidelines
        </Text>

        <Text style={{ fontFamily: 'Montserrat_500Medium'}}
        className="text-base text-dark-pink">
          Allowed Content
        </Text>
        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base ">
          Share your genuine experiences, seek advice, and engage in constructive discussions about skincare concerns and products. Whether you're offering personal insights or seeking guidance, Honest Skincare is the perfect platform to connect with like-minded individuals and enhance your skincare journey.
        </Text>

        <Text style={{ fontFamily: 'Montserrat_500Medium'}}
        className="text-base mt-4 text-dark-pink">
          Prohibited Content
        </Text>
        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base ">
          To maintain the integrity of our community, we do not allow the sharing of external links or promotional content. Offensive or harmful language, unverified claims, and misinformation are strictly prohibited. Let's keep our discussions respectful, informative, and focused on genuine skincare experiences.
        </Text>
      </View>

      <View className="px-8 mt-3">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl mt-2 mb-2">
          Let's help eachother
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base ">
          We rely on our community members to help maintain these guidelines. If you notice any behavior that goes against our rules, please report it. Together, we can create a safe and supportive space for everyone.
        </Text>

        <Text style={{ fontFamily: 'Montserrat_400Regular'}}
         className="text-base pt-5">
          At Honest Skincare, we value genuine, supportive, and respectful interactions. Our guidelines are designed to foster a sense of unity and trust within our community. By following these guidelines, you help us maintain a positive environment where skincare is about sharing knowledge and experiences, not selling products.
        </Text>
      </View>

      {/* <TouchableOpacity className="rounded-full bg-dark-pink px-20 py-3 flex-row mx-auto mt-10"
                            onPress={() => navigation.navigate('Register')}>
             <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                    className="text-white text-xl"
             >I agree</Text>
      </TouchableOpacity> */}

    </View>
    </ScrollView>
  )
}