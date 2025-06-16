import React from 'react';
import { View, Text, ScrollView, Image, Pressable, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ExpertProfile() {
  const navigation = useNavigation();

   //Responsive font size
      const fontScale = PixelRatio.getFontScale();
      const getFontSize = size => size / fontScale;

  // Hardcoded expert info
  const expert = {
    name: 'Dr. Leyla Taner',
    title: 'Skin therapist',
    bio: 'My name is Leyla Taner, and I am a skin therapist with over 10 years of experience. I specialize in treating eczema and adressing the effects of skin aging. I believe in a personalized, evidence-based approach to skincare, and I am passionate about helping people achieve healthy, confident skin.',
    image: require('../../assets/images/dermatoloog1.jpg'),
    email: 'elif.kaya@example.com',
    location: 'Istanbul, Turkiye',
    clinic: 'SkinCare Clinic Istanbul',
    languages: 'English, Turkish',
    memberSince: '10/12/2024'
  };

  // Hardcoded artikelen
  const articles = [
    {
      id: '1',
      articleTitle: 'The Power of Niacinamide in Skincare',
      articleCover: 'https://via.placeholder.com/150',
      author: 'Dr. Leyla Taner',
      tags: { articleCategory: ['Routine Helper'] },
    },
    {
      id: '2',
      articleTitle: 'Understanding Retinol: A Beginner’s Guide',
      articleCover: 'https://via.placeholder.com/150',
      author: 'Dr. Leyla Taner',
      tags: { articleCategory: ['Product Insight'] },
    },
  ];

  const renderArticleCard = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('Article', { articleId: item.id })}
      className="bg-white rounded-2xl flex-row items-center mx-6 my-2"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 4,
      }}
      key={item.id}
    >
      <Image
        source={{ uri: item.articleCover }}
        style={{
          width: 90,
          height: 105,
          resizeMode: 'cover',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      />
      <View className="flex-1 px-3 py-3">
        <Text
          style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}
          className="text-black mb-1"
          numberOfLines={2}
        >
          {item.articleTitle}
        </Text>
        {item.tags?.articleCategory?.[0] && (
          <View className="border border-dark-pink bg-red-50 px-3 py-1 rounded-full self-start mb-1">
            <Text
              style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(8) }}
              className="text-pink-600"
            >
              {item.tags.articleCategory[0]}
            </Text>
          </View>
        )}
        <View className="flex-row items-center mt-1">
          <Image
            source={require('../../assets/images/dermatoloog1.jpg')}
            style={{ width: 16, height: 16, marginRight: 6 }}
            className="rounded-full"
          />
          <Text
            style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(10) }}
            className="text-gray-600"
          >
            {item.author}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScrollView className="bg-white pt-10">
      <View className="mt-10 mb-6 px-6">
            {/* Back button */}
            <Pressable onPress={() => navigation.goBack()}>
                    <Image className="w-5 h-5" 
                            source={require('../../assets/icons/left-arrow.png')} />
            </Pressable>

        <View className="items-center px-3">
            <Image source={expert.image} className="w-28 h-28 rounded-full mb-4 " />
            <Text className="text-center mb-2" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(20) }}>{expert.name}</Text>
            <Text className="text-center text-dark-pink mb-4" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(16) }}>{expert.title}</Text>
            <Text className="text-gray-700 text-center" style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(13) }}>{expert.bio}</Text>
        </View>

        {/* Contactinformatie stijlvol */}
        <View className="flex-row justify-between px-6 mt-4 mb-4">
          <View className="items-center flex-1">
            <Text className="text-dark-pink font-semibold mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(12) }}>LANGUAGES</Text>
            <Text className="text-gray-700 text-center mx-2" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(13) }}>{expert.languages}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-dark-pink font-semibold mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(12) }}>LOCATION</Text>
            <Text className="text-gray-700 text-center mx-2" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(13) }}>{expert.location}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-dark-pink font-semibold mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(12) }}>CLINIC</Text>
            <Text className="text-gray-700 text-center mx-2" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(13) }}>{expert.clinic}</Text>
          </View>
        </View>
      </View>

      <Text className="px-6 mt-2 text-base mb-3" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Articles by {expert.name}</Text>

      {articles.map(article => renderArticleCard({ item: article }))}
    </ScrollView>
  );
}
