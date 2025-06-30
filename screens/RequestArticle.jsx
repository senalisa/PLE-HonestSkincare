import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
  Image,
  Modal
} from 'react-native';
import { db, auth } from './../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const SKIN_CONCERNS = [
  'Acne', 'Dryness', 'Hyperpigmentation', 'Redness',
  'Wrinkles', 'Pores', 'Rosacea'
];

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal'];

export default function RequestArticle() {
  const route = useRoute();

   const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [skinType, setSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [requestSkinType, setRequestSkinType] = useState(null);
  const [requestSkinConcerns, setRequestSkinConcerns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSections, setVisibleSections] = useState({
    skinType: false,
    skinConcerns: false
  });

  const navigation = useNavigation();
  const userId = auth.currentUser?.uid;

 useEffect(() => {
  if (route.params?.filterSkinType !== undefined) {
    setSkinType(route.params.filterSkinType);
  }
  if (route.params?.filterSkinConcerns !== undefined) {
    setSkinConcerns(route.params.filterSkinConcerns);
  }
}, [route.params]);

useEffect(() => {
  fetchRequests();
}, []);

  const toggleSection = (section) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const fetchRequests = async () => {
    const q = query(collection(db, 'articleRequests'), orderBy('voteCount', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRequests(data);
  };

  const toggleConcern = (concern) => {
  setRequestSkinConcerns(prev =>
    prev.includes(concern)
      ? prev.filter(c => c !== concern)
      : [...prev, concern]
  );
};

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Please fill in a subject');
      return;
    }

    try {
      await addDoc(collection(db, 'articleRequests'), {
        subject,
        skinType: requestSkinType,
        skinConcerns: requestSkinConcerns,
        userId,
        timestamp: new Date(),
        voteCount: 1,
        voters: [userId]
      });
      setSubject('');
      setSkinType('');
      setSkinConcerns([]);
      fetchRequests();
       setModalVisible(true);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const handleVote = async (item) => {
    if (item.voters.includes(userId)) {
      Alert.alert('You already voted on this');
      return;
    }

    const requestRef = doc(db, 'articleRequests', item.id);
    await updateDoc(requestRef, {
      voteCount: item.voteCount + 1,
      voters: [...item.voters, userId]
    });
    fetchRequests();
  };

  const filteredRequests = requests.filter(req => {
  const matchSearch = req.subject?.toLowerCase().includes(searchQuery.toLowerCase());

  const matchSkinType = !skinType || req.skinType === skinType;

  const matchConcerns =
    skinConcerns.length === 0 ||
    (Array.isArray(req.skinConcerns) &&
      skinConcerns.some(c => req.skinConcerns.includes(c)));

  return matchSearch && matchSkinType && matchConcerns;
});

  return (
    <ScrollView className="bg-white px-6 py-16">
      <View className="flex-row items-center">
        <Pressable onPress={() => navigation.goBack()} className="">
                      <Image source={require('../assets/icons/left-arrow.png')} style={{ width: 18, height: 18 }} />
        </Pressable>
        <Text className="text-2xl font-semibold mb-2 ml-3 mt-2">Request an Article</Text>
      </View>
      <Text className="text-sm text-gray-500 mb-4">Suggest a topic you'd like to read more about.</Text>

      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 bg-white"
      />

      {/* Toggle Skin Type */}
<Pressable onPress={() => toggleSection('skinType')} className="flex-row justify-between items-center mb-2">
  <Text className="text-lg font-semibold">Your Skin Type</Text>
  <Image
    source={visibleSections.skinType ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
    style={{ width: 13, height: 13 }}
  />
</Pressable>

{visibleSections.skinType && (
  <View className="flex flex-wrap flex-row gap-2 mb-6">
    {SKIN_TYPES.map((type, idx) => (
      <Pressable
        key={idx}
        onPress={() => setRequestSkinType(type)}
        className={`px-4 py-2 rounded-full border ${
          requestSkinType === type ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-300'
        }`}
      >
        <Text className={requestSkinType === type ? 'text-pink-600' : 'text-gray-600'}>{type}</Text>
      </Pressable>
    ))}
  </View>
)}

{/* Toggle Skin Concerns */}
<Pressable onPress={() => toggleSection('skinConcerns')} className="flex-row justify-between items-center mb-2">
  <Text className="text-lg font-semibold">Skin Concerns</Text>
  <Image
    source={visibleSections.skinConcerns ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
    style={{ width: 13, height: 13 }}
  />
</Pressable>

{visibleSections.skinConcerns && (
  <View className="flex flex-wrap flex-row gap-2 mb-6">
    {SKIN_CONCERNS.map((concern, index) => (
      <Pressable
        key={index}
        onPress={() => toggleConcern(concern)}
        className={`px-4 py-2 rounded-full border ${
          requestSkinConcerns.includes(concern)
            ? 'bg-pink-100 border-pink-400'
            : 'bg-white border-gray-300'
        }`}
      >
        <Text className={requestSkinConcerns.includes(concern) ? 'text-pink-600' : 'text-gray-600'}>
          {concern}
        </Text>
      </Pressable>
    ))}
  </View>
)}

      <Pressable
        onPress={handleSubmit}
        className="bg-dark-pink py-3 rounded-full mb-8 mt-3"
      >
        <Text className="text-center text-white font-semibold">Send Request</Text>
      </Pressable>

      {/* Line */}
                    <View className="border-b border-gray-100 mb-5" />

      {/* Filters + Search */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold">Popular Requests</Text>
        <Pressable
          onPress={() => navigation.navigate('RequestArticleFilter')}
          className="px-3 py-1 bg-gray-100 rounded-full border border-gray-300"
        >
          <Text className="text-sm text-gray-600">Filter</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Zoek op onderwerp..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="border border-gray-300 rounded-full px-4 py-2 mb-4 bg-white"
      />

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="mb-4 border border-gray-100 rounded-xl p-4 shadow-sm bg-white">
            <Text className="font-semibold text-base">{item.subject}</Text>
            {item.skinType && (
              <Text className="text-sm text-gray-600 mt-1">Skin type: {item.skinType}</Text>
            )}
            {item.skinConcerns?.length > 0 && (
              <Text className="text-sm text-gray-600 mt-1">Concerns: {item.skinConcerns.join(', ')}</Text>
            )}
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-sm text-gray-500">Votes: {item.voteCount}</Text>
              <Pressable
                onPress={() => handleVote(item)}
                className="px-4 py-1.5 rounded-full bg-dark-pink"
              >
                <Text className="text-white text-sm">Vote</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-2xl w-[80%]">
            <Text className="text-lg font-semibold text-center mb-2">Request Submitted</Text>
            <Text className="text-center text-gray-600 mb-4">
              Your article request has been successfully submitted!
            </Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-dark-pink py-2 px-4 rounded-full self-center"
            >
              <Text className="text-white font-semibold">OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
