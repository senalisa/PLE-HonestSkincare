// screens/ArticlesScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, PixelRatio, TouchableOpacity, Pressable, Image, ScrollView, TextInput, ImageBackground } from 'react-native';
import { db, auth } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function AllArticles() {
  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const navigation = useNavigation();
  const route = useRoute();
  const [allArticles, setAllArticles] = useState([]);
  const [originalAllArticles, setOriginalAllArticles] = useState([]);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [userPrefs, setUserPrefs] = useState(null);

  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSustainability, setSelectedSustainability] = useState([]);
  const [selectedArticleTypes, setSelectedArticleTypes] = useState([]);

  const [sortMode, setSortMode] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const filteredBySearch = allArticles.filter(article =>
    article.articleTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedArticles = filteredBySearch.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );


  useEffect(() => {
    const fetchUserPrefs = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const prefRef = doc(db, 'userPreferences', userId);
      const prefSnap = await getDoc(prefRef);
      if (prefSnap.exists()) {
        setUserPrefs(prefSnap.data());
      }
    };

    const fetchArticles = async () => {
      const snap = await getDocs(collection(db, 'articles'));
      const articles = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOriginalAllArticles(articles);
      setAllArticles(articles);
    };

    fetchUserPrefs();
    fetchArticles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const {
        selectedSkinType: skinTypeParam = 'All',
        selectedConcerns: concernsParam = [],
        selectedTags: tagsParam = [],
        selectedSustainability: sustainabilityParam = [],
        selectedArticleTypes: articleTypesParam = [],
      } = route.params || {};

      setSelectedSkinType(skinTypeParam);
      setSelectedConcerns(concernsParam);
      setSelectedTags(tagsParam);
      setSelectedSustainability(sustainabilityParam);
      setSelectedArticleTypes(articleTypesParam);

      let filtered = [...originalAllArticles];

      if (skinTypeParam !== 'All') {
        filtered = filtered.filter(article =>
          article.tags?.skinTypes?.includes(skinTypeParam)
        );
      }

      if (concernsParam.length > 0) {
        filtered = filtered.filter(article =>
          article.tags?.skinConcerns?.some(c => concernsParam.includes(c))
        );
      }

      if (tagsParam.length > 0) {
        filtered = filtered.filter(article =>
          article.tags?.ingredientTags?.some(tag => tagsParam.includes(tag))
        );
      }

      if (sustainabilityParam.length > 0) {
        filtered = filtered.filter(article =>
          article.tags?.sustainability?.some(tag => sustainabilityParam.includes(tag))
        );
      }

      if (articleTypesParam.length > 0) {
        filtered = filtered.filter(article =>
          article.tags?.articleCategory?.some(tag => articleTypesParam.includes(tag))
        );
      }

      if (sortMode === 'Newest') {
        filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      } else if (sortMode === 'Popular') {
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }

      setAllArticles(filtered);
      setCurrentPage(1);
    }, [route.params, sortMode])
  );

  useEffect(() => {
    if (!userPrefs || originalAllArticles.length === 0) return;

    const matches = originalAllArticles.filter(article => {
      const { skinTypes = [], skinConcerns = [] } = article.tags || {};
      const matchesSkin = skinTypes.includes('All') || skinTypes.includes(userPrefs.skinType);
      const matchesConcern = skinConcerns.some(c => userPrefs.skinConcerns?.includes(c));
      return matchesSkin || matchesConcern;
    });
    setRecommendedArticles(matches);
  }, [userPrefs, originalAllArticles]);

  const renderArticleCard = ({ item }) => (
  <Pressable
    onPress={() => navigation.navigate('Article', { articleId: item.id })}
    className="bg-white rounded-2xl flex-row items-center mx-4 my-2"
    style={{
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 4,
      elevation: 4,
    }}
  >
    {/* Afbeelding links */}
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

    {/* Tekst rechts */}
    <View className="flex-1 px-3 py-3">
      {/* Titel */}
      <Text
        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}
        className="text-black mb-1"
        numberOfLines={2}
      >
        {item.articleTitle}
      </Text>

      {/* Tag */}
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

      {/* Auteur */}
      <View className="flex-row items-center mt-1">
        <Image
          source={require('../assets/images/user.png')}
          style={{ width: 16, height: 16, marginRight: 6 }}
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
    <ScrollView className="bg-white">
      <ImageBackground source={require('./../assets/images/discover-bg-2.png')} resizeMode="cover">
        <View className="mt-20 mb-10">
          <View className="px-6 flex-row">
            <Pressable onPress={() => navigation.goBack()} className="">
              <Image source={require('../assets/icons/left-arrow.png')} style={{ width: 18, height: 18 }} />
            </Pressable>
            <View className="m-auto">
              <Text className="mb-1 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(25) }}>Articles</Text>
              <Text className="text-center"style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(13) }}>Read articles and scroll through topics</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View className="bg-white outline outline-offset-6 h-full py-5 -mt-5 rounded-t-[35px] shadow-xl">

         <Pressable onPress={() => navigation.navigate('RequestArticle')}
            className="flex-row justify-between bg-white py-3 px-3 rounded-xl shadow-xs border border-gray-100 mx-auto mt-3 w-100 mx-6 mb-3">
              <Text className="text-black" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>Request an Article</Text>
              <Image className="w-4 h-4 mr-3" style={{ tintColor: "#FB6F93" }} source={require('./../assets/icons/right-arrow.png')} />
          </Pressable>

        {recommendedArticles.length > 0 && (
          <View className="mb-6 pl-6">
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mb-3 mt-3">For your skin</Text>
              <Pressable>
                <Image className="w-5 h-5 mr-3" style={{ tintColor: "gray" }} source={require('./../assets/icons/info.png')} />
              </Pressable>
            </View>
            <FlatList
              horizontal
              data={recommendedArticles}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ height: hp('23%'), width: wp('40%'), borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 4, margin: 6 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Article', { articleId: item.id })}
                    style={{ flex: 1, overflow: 'hidden', borderRadius: 16 }}
                    className="bg-white"
                  >
                    <Image source={{ uri: item.articleCover }} style={{ width: '100%', height: 100 }} />
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>{item.articleTitle}</Text>
                      <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(10), marginTop: 6 }}>{item.author}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        <View className="flex-row justify-between items-center px-4">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }} className="mb-3 pl-3">All Articles</Text>
          <Pressable onPress={() => navigation.navigate('ArticlesFilter', {
            selectedSkinType,
            selectedConcerns,
            selectedTags,
            selectedSustainability,
            selectedArticleTypes
          })} className="self-end mr-5 mb-2 flex-row items-center -mt-3">
             <Image source={require('../assets/icons/filter.png')} className="w-4 h-4 mr-2" style={{ tintColor: '#808080' }} />
             <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-gray-500">Filter</Text>
          </Pressable>
        </View>

        <View className="px-5 mt-2 mb-4">
          <View className="flex-row items-center bg-white border border-gray-100 rounded-full px-6 py-2.5 shadow-sm">
            <Image
              source={require('./../assets/icons/search.png')}
              style={{ width: 14, height: 14, tintColor: '#888', marginRight: 10 }}
            />
            <TextInput
              placeholder="Search articles..."
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              style={{ flex: 1, fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(13) }}
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </View>

        {/* Sort Mode Buttons */}
        <View className="flex-row mb-4 space-x-4 px-6">
          <Pressable
            onPress={() => setSortMode('Newest')}
            className={`px-5 py-1.5 rounded-full border ${sortMode === 'Newest' ? 'bg-dark-pink border-dark-pink' : 'border-gray-300'}`}
          >
            <Text className={`${sortMode === 'Newest' ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Montserrat_500Medium' }}>Newest</Text>
          </Pressable>

          <Pressable
            onPress={() => setSortMode('Popular')}
            className={`px-5 py-1.5 rounded-full border ${sortMode === 'Popular' ? 'bg-dark-pink border-dark-pink' : 'border-gray-300'}`}
          >
            <Text className={`${sortMode === 'Popular' ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Montserrat_500Medium' }}>Popular</Text>
          </Pressable>
        </View>

        {paginatedArticles.length === 0 && (
          <Text className="text-center text-gray-500 mb-6" style={{ fontFamily: 'Montserrat_400Regular' }}>
            No articles found with the selected filters.
          </Text>
        )}

        <FlatList
          data={paginatedArticles}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="px-3"
          renderItem={renderArticleCard}
        />

        {/* Pagination Controls */}
        <View className="flex-row justify-between items-center mt-4 px-6">
          <Pressable
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="py-2 px-4 border border-gray-200 rounded-lg"
          >
            <Text className="text-dark-pink" style={{ fontFamily: 'Montserrat_500Medium' }}>Previous</Text>
          </Pressable>

          <Text className="text-gray-800" style={{ fontFamily: 'Montserrat_500Medium' }}>
            Page {currentPage} of {totalPages}
          </Text>

          <Pressable
            onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="py-2 px-4 border border-gray-200 rounded-lg"
          >
            <Text className="text-dark-pink" style={{ fontFamily: 'Montserrat_500Medium' }}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
