import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, PixelRatio, ImageBackground, Pressable, Image } from 'react-native';
import { doc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebase';

export default function IngredientInfoScreen({ route }) {
  //Responsive font size
  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  // Navigation
  const navigation = useNavigation();

  const [data, setData] = useState(null);

  const ingredientName = route?.params?.ingredientName;
  const ingredientId = route?.params?.ingredientId;

  useEffect(() => {
    const fetchIngredient = async () => {
      if (!ingredientId) {
        console.warn("ingredientId ontbreekt in route.params");
        return;
      }

      try {
        const docRef = doc(db, "skincareTerms", ingredientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
          await updateDoc(docRef, {
            clickCount: increment(1)
          });
        } else {
          console.warn("Ingrediënt niet gevonden in Firestore");
        }
      } catch (err) {
        console.error("Error fetching ingredient:", err);
      }
    };

    fetchIngredient();
  }, [ingredientId]);

  // Pressable skincare tags
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsCollectionRef = collection(db, 'topics');
        const querySnapshot = await getDocs(topicsCollectionRef);
        const fetchedTopics = querySnapshot.docs.map(doc => doc.data());
        setTopics(fetchedTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);


  if (!data) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageBackground source={{ uri: data.imageUrl}} resizeMode="cover">
              <View
              className="flex-row justify-between px-5 pt-14 pb-14">
                      {/* Back button */}
                      <Pressable onPress={() => navigation.goBack()}>
                          <Image className="w-5 h-5" 
                                          source={require('./../assets/icons/left-arrow.png')} />
                      </Pressable>
      
              </View> 
      </ImageBackground>

      <View className="p-6 bg-white rounded-3xl -mt-5 shadow-xl">
        {/* Title skinterm */}
        <Text style={{ fontSize: getFontSize(24), fontFamily: 'Montserrat_600SemiBold', marginBottom: 5 }}>{data.name}</Text>

        {/* Tags */}
        <View className="flex-row flex-wrap mt-2">
          {data.tags?.map((concern, index) => (
            <Pressable
              key={index}
              className="border border-red-700 bg-red-20 px-4 py-1 rounded-full mr-2 mb-2"
            >
              <Text
                style={{
                  fontFamily: 'Montserrat_600SemiBold',
                  fontSize: getFontSize(12),
                }}
                className="text-red-700"
              >
                {concern}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Description */}
        <Text style={{ fontSize: getFontSize(14), fontFamily: 'Montserrat_400Regular', marginBottom: 22, marginTop: 12 }}>
          {data.description}
        </Text>

        {/* Benefits */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16), marginBottom: 4 }}>Benefits</Text>
        {data.benefits?.map((b, idx) => (
          <Text key={idx} style={{ marginLeft: 10, marginBottom: 2, fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }}>• {b}</Text>
        ))}

        {/* Skin Concerns */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16), marginTop: 22 }}>Helps with</Text>
        <View className="flex-row flex-wrap mt-2">
          {data.skinConcerns?.map((concern, index) => {
            const matchedTopic = topics.find(t => t.topic === concern);
            return (
            <Pressable
              key={index}
              onPress={() => {
                if (matchedTopic) {
                  navigation.navigate('CategorySearch', { topicData: matchedTopic });
                }
              }}
              className="border border-dark-yellow bg-yellow px-4 py-1 rounded-full mr-2 mb-2"
            >
              <Text
                style={{
                  fontFamily: 'Montserrat_600SemiBold',
                  fontSize: getFontSize(12),
                }}
                className="text-dark-yellow"
              >
                {concern}
              </Text>
            </Pressable>
          );
          })}
        </View>
    
        {/* Skin Types */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16), marginTop: 22 }}>Suitable for:</Text>
        <View className="flex-row flex-wrap mt-2">
            {data.skinTypes?.map((concern, index) =>{
              const matchedTopic = topics.find(t => t.topic === concern);
              return (
              <Pressable
                key={index}
                 onPress={() => {
                if (matchedTopic) {
                  navigation.navigate('CategorySearch', { topicData: matchedTopic });
                }
                }}
                className="border border-blue bg-light-blue px-4 py-1 rounded-full mr-2 mb-2"
              >
                <Text
                  style={{
                    fontFamily: 'Montserrat_600SemiBold',
                    fontSize: getFontSize(12),
                  }}
                  className="text-blue"
                >
                  {concern}
                </Text>
              </Pressable>
              );
            })}
          </View>


        {/* Tips */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16), marginTop: 22, marginBottom: 6 }}>Tips</Text>
       {data.tips && Object.entries(data.tips).map(([key, val], i) => (
        <View key={i} className="mb-4">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>
            {key}
          </Text>
          <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }}>
            {val}
          </Text>
        </View>
      ))}

        {/* Warnings */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16), marginTop: 12, marginBottom: 6 }}>Warnings</Text>
        {data.warnings && Object.entries(data.warnings).map(([key, val], i) => (
          <View key={i} className="mb-4">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>
            {key}
          </Text>
          <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }}>
            {val}
          </Text>
        </View>
        ))}

        {/* Sources */}
        <Text style={{ fontFamily: 'Montserrat_300Light_Italic', fontSize: getFontSize(16), marginTop: 12 }}>Sources:</Text>
        {data.sources?.map((s, i) => (
          <Text key={i} style={{ fontFamily: 'Montserrat_300Light', fontSize: getFontSize(14), marginLeft: 10, marginBottom: 3 }}>
            • {s}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
