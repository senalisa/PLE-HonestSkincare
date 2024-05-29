import { View, Text, } from 'react-native'
import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './../config/firebase';

export default function Discover() {
  const [articles, setArticles] = useState([]);

   // Function to fetch posts and filter based on user preferences
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
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Text>Discover</Text>

       <View className="mb-7">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </View>
    </View>
  )
}