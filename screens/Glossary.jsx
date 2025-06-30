import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, ImageBackground, TextInput, PixelRatio } from 'react-native';
import { auth, db } from '../config/firebase';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import FilterModal from '../components/FilterModal';
import ForYourSkinList from '../components/ForYourSkinList';

export default function Glossary() {
  const navigation = useNavigation();

   //Responsive font size
        const fontScale = PixelRatio.getFontScale();
        const getFontSize = size => size / fontScale;

  const [userPrefs, setUserPrefs] = useState(null);
  const [recommendedTerms, setRecommendedTerms] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [termsPerPage] = useState(6);
  const [sortedTerms, setSortedTerms] = useState([]);
  const [todaysSpot, setTodaysSpot] = useState(null);

  const [sortMode, setSortMode] = useState('A-Z');

  const totalPages = Math.ceil(sortedTerms.length / termsPerPage);
  const paginatedTerms = sortedTerms.slice((currentPage - 1) * termsPerPage, currentPage * termsPerPage);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPrefRef = doc(db, "userPreferences", auth.currentUser.uid);
        const userPrefSnap = await getDoc(userPrefRef);

        if (!userPrefSnap.exists()) return;

        const prefs = userPrefSnap.data();
        setUserPrefs(prefs);

        const termSnap = await getDocs(collection(db, "skincareTerms"));
        const all = termSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllTerms(all);

        // Today's Spot bepalen
        if (all.length > 0) {
          const daySeed = new Date().toISOString().split('T')[0]; // bv. 2025-06-05
          const hash = [...daySeed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const index = hash % all.length;
          setTodaysSpot(all[index]);
        }

        const matched = all.filter(term => {
          const matchesSkinType = term.skinTypes?.includes(prefs.skinType);
          const matchesConcerns = term.skinConcerns?.some(c => prefs.skinConcerns.includes(c));
          return matchesSkinType || matchesConcerns;
        });

        setRecommendedTerms(matched);
      } catch (err) {
        console.error("Fout bij ophalen data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let sorted = [...allTerms];
   if (sortMode === 'A-Z') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'Trending') {
      sorted.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    }
    setSortedTerms(sorted);
  }, [allTerms, sortMode]);

  const applyFilter = () => {
    let filtered = [...allTerms];

    if (selectedSkinType !== 'All') {
      filtered = filtered.filter(term => term.skinTypes?.includes(selectedSkinType));
    }

    if (selectedConcerns.length > 0) {
      filtered = filtered.filter(term => term.skinConcerns?.some(concern => selectedConcerns.includes(concern)));
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(term => term.tags?.some(tag => selectedTags.includes(tag)));
    }

    setSortedTerms(filtered);
    setCurrentPage(1);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedSkinType('All');
    setSelectedConcerns([]);
    setSelectedTags([]);
    setSortedTerms(allTerms);
    setCurrentPage(1);
    setFilterModalVisible(false);
  };

  return (
    <ScrollView>
      <StatusBar />
      <View className="flex-[1] white">
        <ImageBackground source={require('./../assets/images/glossary-bg.png')} resizeMode="cover" imageStyle={{ opacity: 1 }}>
          <View className="mt-20 mb-10">
            <View className="-mt-1 px-8 justify-between">
              <Text className="mb-3 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 30 }}>Glossary</Text>
              <Text className="text-center mx-16" style={{ fontFamily: 'Montserrat_400Regular', fontSize: 13 }}>Get more information about skincare terms and ingredients</Text>
            </View>
          </View>
        </ImageBackground>

        <View className="bg-white outline outline-offset-6 h-full pt-8 -mt-5 rounded-t-[35px] pl-8">

          {todaysSpot && (
  <View className="mb-6 pr-8">
    <Text className="text-lg font-bold mb-2 px-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(18) }}>
      Today’s Spot
    </Text>

    <Pressable
      onPress={() => navigation.navigate('IngredientDetail', {
        ingredientName: todaysSpot.name,
        ingredientId: todaysSpot.id
      })}
      className="bg-white rounded-2xl shadow-sm border border-gray-100  flex-row items-center"
    >
      <Image
        source={{ uri: todaysSpot.imageUrl }}
        style={{ width: 125, height: 125 }}
        className="rounded-l-xl"
      />

      <View className="flex-1 p-4">
        <Text className="font-semibold mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>
          {todaysSpot.name}
        </Text>

        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-black mb-2"
          style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
        >
          {todaysSpot.description}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {todaysSpot.tags?.map((tag, i) => (
            <View key={i} className="bg-red-20 px-3 m-auto py-1 rounded-full mr-2 border border-red-700">
              <Text className="text-red-700" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(10) }}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Pressable>
  </View>
)}


          {/* For your skin */}
          <ForYourSkinList terms={recommendedTerms} />

          {/* All Ingredients */}
          <View className="mt-10 pr-8 pb-36">
            <View className="flex-row justify-between items-center">
              <Text className="mb-4" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(18) }}>All Ingredients</Text>

              <Pressable onPress={() => setFilterModalVisible(true)} className="flex-row items-center -mt-3">
                <Image source={require('../assets/icons/filter.png')} className="w-4 h-4 mr-2" style={{ tintColor: '#808080' }} />
                <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14) }} className="text-gray-500">Filter</Text>
              </Pressable>
            </View>

            <View className="shadow-md bg-white rounded-full w-full mb-5 flex-row items-center px-4 py-3">
              <Image source={require('./../assets/icons/search.png')} style={{ width: 20, height: 20, tintColor: '#CBCACA', marginRight: 8 }} />
              <TextInput
                placeholder="Search for an ingredient..."
                placeholderTextColor="#CCC"
                className="flex-1 text-sm text-gray-800"
                style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14) }}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>

            {/* A-Z / Trending Toggle */}
            <View className="flex-row mb-4 space-x-4">
              <Pressable onPress={() => setSortMode('A-Z')} className={`px-8 py-2 rounded-full border ${sortMode === 'A-Z' ? 'border-dark-pink bg-dark-pink' : 'border-gray-300'}`}>
                <Text className={`${sortMode === 'A-Z' ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14) }}>A-Z</Text>
              </Pressable>
              <Pressable onPress={() => setSortMode('Trending')} className={`px-4 py-2 rounded-full border ${sortMode === 'Trending' ? 'border-dark-pink bg-dark-pink' : 'border-gray-300'}`}>
                <Text className={`${sortMode === 'Trending' ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14) }}>Trending</Text>
              </Pressable>
            </View>

            <FilterModal
              visible={filterModalVisible}
              onClose={() => setFilterModalVisible(false)}
              selectedSkinType={selectedSkinType}
              setSelectedSkinType={setSelectedSkinType}
              selectedConcerns={selectedConcerns}
              setSelectedConcerns={setSelectedConcerns}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              onApply={applyFilter}
              onClear={clearFilters}
            />

            <View className="flex-col flex-wrap justify-between">
             {paginatedTerms
                .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item, index) => (
                <Pressable key={index} className="w-[100%] bg-white border border-gray-100 shadow-sm rounded-xl p-4 mb-4" onPress={() => navigation.navigate('IngredientDetail', { ingredientName: item.name, ingredientId: item.id })}>
                  <Text className="text-base font-semibold" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(15) }}>{item.name}</Text>
                </Pressable>
              ))}
            </View>

            {paginatedTerms.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
              <Text className="text-center text-gray-400 mt-4" style={{ fontFamily: 'Montserrat_400Regular' }}>
                No results found.
              </Text>
            )}

            <View className="flex-row justify-between items-center mt-4">
              <Pressable onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="py-2 px-4 order border border-gray-200 rounded-lg">
                <Text className="text-dark-pink" style={{ fontFamily: 'Montserrat_500Medium' }}>Previous</Text>
              </Pressable>

              <Text className="text-gray-800" style={{ fontFamily: 'Montserrat_500Medium' }}>Page {currentPage} of {totalPages}</Text>

              <Pressable onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="py-2 px-4 border border-gray-200 rounded-lg">
                <Text className="text-dark-pink" style={{ fontFamily: 'Montserrat_500Medium' }}>Next</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
