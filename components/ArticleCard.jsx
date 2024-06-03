import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);

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
          <TouchableWithoutFeedback
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
                justifyContent: "center",
                overflow: "hidden",
                alignItems: "center",
                borderWidth: 1, borderColor: '#EFEFEF' 
              }}
            >
              <Image source={{ uri: item.articleCover }} style={styles.image} />
            </View>
          </TouchableWithoutFeedback>
        )}
        customAnimation={animationStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 170,
    height: 230,
    borderRadius: 10,
  }
});
