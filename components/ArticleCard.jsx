import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, PixelRatio } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Carousel, { TAnimationStyle } from 'react-native-reanimated-carousel';
import { interpolate } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const PAGE_WIDTH = windowWidth;

export default function ArticleCard() {
  //Responsive font size
      const fontScale = PixelRatio.getFontScale();
      const getFontSize = size => size / fontScale;

  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);

  // Fetch the articles from the database
  const fetchArticles = async () => {
    try {
      const articlesCollectionRef = collection(db, 'articles');
      const querySnapshot = await getDocs(articlesCollectionRef);
      const fetchedArticles = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedArticles.push({ id: doc.id, ...data });
      });
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  //Animation
  const animationStyle = useCallback(
    (value) => {
      "worklet";
  
      const itemSize = 170;
      const centerOffset = PAGE_WIDTH / 2 - itemSize / 2;
      const itemGap = interpolate(
        value,
        [-3, -2, -1, 0, 1, 2, 3],
        [-30, -15, 0, 0, 0, 15, 30],
      );
  
      const translateX = interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) + centerOffset - itemGap;
      const translateY = interpolate(value, [-1, -0.5, 0, 0.5, 1], [60, 45, 40, 45, 60]);
      const scale = interpolate(value, [-1, -0.5, 0, 0.5, 1], [0.8, 0.85, 1.1, 0.85, 0.8]);
  
      return {
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
      };
    },
    []
  );
  
  return (
    <View style={{ flex: 1, height: 240 }}>
      <Carousel
        width={170}
        height={230}
        style={{
          width: PAGE_WIDTH,
          height: 300,
          backgroundColor: "#fff",
        }}
        loop
        data={articles}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            onPress={() => navigation.navigate('Article', { articleId: item.id })}
            containerStyle={{ flex: 1 }}
            style={{ flex: 1 }}
            className="shadow-md"
          >
            <View
              style={{
                backgroundColor: "white",
                flex: 1,
                borderRadius: 10,
                overflow: "hidden",
                borderWidth: 1, borderColor: '#EFEFEF' 
              }}
            >
              <Image source={{ uri: item.articleCover }} style={styles.image} />
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }} className="px-4 mt-4">{ item.articleTitle }</Text>
              <View className="flex-row items-center px-4 pt-4">
                  <Image className="w-4 h-4" 
                                  source={require('./../assets/images/user.png')} />
                  <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(9) }} className="px-2">{ item.author }</Text>
              </View>
            </View>
          </Pressable>
        )}
        customAnimation={animationStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }
});
