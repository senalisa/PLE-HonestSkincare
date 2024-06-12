import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import Swiper from 'react-native-swiper';

export default function Welcome() {
  const navigation = useNavigation()

  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const renderStepIndicator = (currentStep) => {
    const indicators = [];
    for (let i = 0; i < totalSteps; i++) {
      indicators.push(
        <View key={i} className="flex-row items-center shadow-sm">
          <View
            className={`w-2 h-2 mr-2 rounded-full border-2 flex items-center justify-center ${
              i === step ? 'border-dark-pink bg-dark-pink w-7 h-2' : 'border-white bg-white'
            }`}
          >
          </View>
        </View>
      );
    }
    return indicators;
  };

  
  return (
    <View className="flex-[1] justify-center items-center h-full">

       {/* INTRO */}
       <ImageBackground source={require('./../assets/images/welcome-bg.png')} resizeMode="cover" className="w-full h-full">

      {/* Logo */}
      <View className="flex items-center mt-24">
        <Image className="w-32 h-12 ml-2" 
                        source={require('./../assets/images/logo-plain-nobg.png')} />
      </View>

      <Swiper
          loop={false}
          showsPagination={false}
          index={step}
          onIndexChanged={(index) => setStep(index)}
          className=""
        >
          <View className="justify-center my-5">
            <Image className="w-full h-72 mt-10" source={require('./../assets/images/welcome-pic.png')} />

            <Text className="text-center text-2xl  mx-auto mt-6" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
              Welcome to {"\n"} Honest Skincare!
            </Text>
            
            <Text className="text-center text-base w-60 mx-auto mt-2" style={{ fontFamily: 'Montserrat_400Regular' }}>
              A place where skincare is about sharing, not selling.
            </Text>
          </View>

          <View className="justify-center mx-auto my-16">
            <Image className="w-[248] h-64 mt-0 mx-auto" source={require('./../assets/images/skingroup.png')} />

            <Text className="text-center text-2xl mx-auto mt-6" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
            Discover skincare {"\n"} tailored to your needs
            </Text>
            
            <Text className="text-center text-sm w-[300] mx-auto mt-2" style={{ fontFamily: 'Montserrat_400Regular' }}>
           Honest Skincare delivers personalized content based on your skin type and concerns, ensuring you get the advice and recommendations that matter most to you.
            </Text>
          </View>

          <View className="justify-center mx-auto my-16">
            <Image className="w-[200] h-[200] mb-5 mt-5 mx-auto" source={require('./../assets/images/social-media.png')} />

            <Text className="text-center text-2xl mx-auto mt-6" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
            Be a part of {"\n"} the Community
            </Text>

            <Text className="text-center text-sm w-[300] mx-auto mt-2" style={{ fontFamily: 'Montserrat_400Regular' }}>
              Join a vibrant community of skincare enthusiasts. {"\n"} Create posts, share advice, and connect with others who share your skincare journey.
            </Text>
          </View>

          <View className="justify-center mx-auto my-16">
            <Image className="w-[150] h-[150] mt-10 mb-5 mx-auto" source={require('./../assets/images/no-add.png')} />

            <Text className="text-center text-2xl mx-auto mt-6" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
            Minimizing  {"\n"} Marketing Influence
            </Text>

            <Text className="text-center text-sm w-[300] mx-auto mt-2" style={{ fontFamily: 'Montserrat_400Regular' }}>
              Say goodbye to influencer marketing. Honest Skincare strives to minimize commercial influence, ensuring an authentic and trustworthy experience.
            </Text>
          </View>
        </Swiper>

      {/* Login & register */}
      <View className="flex items-center absolute bottom-20 left-0 right-0">

      <View className="flex-row items-center justify-center mb-16 w-20 mx-auto">
          {renderStepIndicator(step)}
      </View>

        <Animated.View entering={FadeInDown.duration(2000).springify()}>
        <View className="">
          <TouchableOpacity className="rounded-full bg-dark-pink px-20 py-3 flex-row"
                            onPress={() => navigation.navigate('Register')}>
             <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                    className="text-white text-lg"
             >Get Started</Text>
          </TouchableOpacity>
        </View>
        </Animated.View>

        <View>
        <Animated.View entering={FadeInDown.delay(200).duration(2000).springify()}>
          <TouchableOpacity className="mt-10 flex-wrap text-center"
          onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontFamily: 'Montserrat_500Medium' }} 
            className="text-center text-sm">Already joined our community?</Text>

            <Text style={{ fontFamily: 'Montserrat_600SemiBold'}} 
            className="text-center text-dark-pink underline pt-1 text-sm">Login here</Text>
          </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      </ImageBackground>
    </View>
  )
}
