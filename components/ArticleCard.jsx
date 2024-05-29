import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function ArticleCard({ article }) {
  const navigation = useNavigation();

  return (
    <View> 
      <Animated.View entering={FadeInDown.delay(100).duration(3000).springify()}>
        <TouchableOpacity onPress={() => navigation.navigate('Article', { articleId: article.id })}>
            <View className="ml-7 shadow-sm">
             <Image 
                source={{ uri: article.articleCover }} 
                style={{ width: 170, height: 200, borderRadius: 10, marginTop: 10 }}
                className="rounded-md"
              />
            </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
