import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function IngredientInfoScreen({ route }) {
  
  const [data, setData] = useState(null);

 const ingredientName = route?.params?.ingredientName;

useEffect(() => {
  const fetchIngredient = async () => {
    if (!ingredientName) {
      console.warn("ingredientName ontbreekt in route.params");
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "skincareTerms"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.name?.toLowerCase?.() === ingredientName.toLowerCase()) {
          setData(data);
        }
      });
    } catch (err) {
      console.error("Error fetching ingredient:", err);
    }
  };

  fetchIngredient();
}, [ingredientName]);


  if (!data) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView className="p-6">
      <Text style={{ fontSize: 24, fontFamily: 'Montserrat_600SemiBold', marginBottom: 12 }}>{data.name}</Text>
      
      {/* Description */}
      <Text style={{ fontSize: 16, fontFamily: 'Montserrat_500Medium', marginBottom: 12 }}>
        {data.description}
      </Text>

      {/* Benefits */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginBottom: 4 }}>Benefits:</Text>
      {data.benefits?.map((b, idx) => (
        <Text key={idx} style={{ marginLeft: 10, marginBottom: 2, fontFamily: 'Montserrat_500Medium' }}>• {b}</Text>
      ))}

      {/* Skin Concerns */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginTop: 12 }}>Helps with:</Text>
      <Text style={{ fontFamily: 'Montserrat_500Medium' }}>{data.skinConcerns?.join(', ')}</Text>

      {/* Skin Types */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginTop: 12 }}>Suitable for:</Text>
      <Text style={{ fontFamily: 'Montserrat_500Medium' }}>{data.skinTypes?.join(', ')}</Text>

      {/* Tags */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginTop: 12 }}>Tags:</Text>
      <Text style={{ fontFamily: 'Montserrat_500Medium' }}>{data.tags?.join(', ')}</Text>

      {/* Tips */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginTop: 12 }}>Tips:</Text>
      {data.tips && Object.entries(data.tips).map(([key, val], i) => (
        <Text key={i} style={{ marginBottom: 2 }}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}>{key}:</Text>{' '}
          <Text style={{ fontFamily: 'Montserrat_500Medium' }}>{val}</Text>
        </Text>
      ))}

      {/* Warnings */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginTop: 12 }}>Warnings:</Text>
      {data.warnings && Object.entries(data.warnings).map(([key, val], i) => (
        <Text key={i} style={{ marginBottom: 2 }}>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}>{key}:</Text>{' '}
          <Text style={{ fontFamily: 'Montserrat_500Medium' }}>{val}</Text>
        </Text>
      ))}

      {/* Sources */}
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18, marginTop: 12 }}>Sources:</Text>
      {data.sources?.map((s, i) => (
        <Text key={i} style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
          • {s}
        </Text>
      ))}
    </ScrollView>
  );
}
