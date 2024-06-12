import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; 
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

const SkinConcernOption = ({ concern, icon, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: isSelected ? '#B4A18A' : '#ddd',
        borderRadius: 50,
        margin: 7,
        backgroundColor: isSelected ? '#F2EFD7' : 'white',
      }}
    >
      <Image source={icon} style={{ width: 24, height: 29, marginRight: 8 }} />
      <Text style={{ color: isSelected ? '#B4A18A' : 'black', fontFamily: 'Montserrat_600SemiBold' }} className="text-base">
        {concern}
      </Text>
    </TouchableOpacity>
  );
};

export default function UserSkinType() {
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState([]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    step1Data: '',
    step2Data: '',
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        if (userId) {
          const userPrefRef = doc(db, 'userPreferences', userId);
          const userPrefDoc = await getDoc(userPrefRef);
          if (userPrefDoc.exists()) {
            const userData = userPrefDoc.data();
            setSkinConcerns(userData.skinConcerns || []);
            setSelectedSkinType(userData.skinType || '');
          }
        }
      } catch (error) {
        console.error('Error getting user preferences:', error);
      }
    };
  
    fetchUserPreferences();
  }, [userId]);
  

  const handleToggleSkinConcern = (concern) => {
    setSkinConcerns(prevConcerns => {
      if (prevConcerns.includes(concern)) {
        return prevConcerns.filter(item => item !== concern);
      } else {
        return [...prevConcerns, concern];
      }
    });
  };

  const skinConcernList = [
    { name: 'Dryness', icon: require('../../assets/images/skins/dryness.png') },
    { name: 'Acne', icon: require('../../assets/images/skins/acne.png') },
    { name: 'Redness', icon: require('../../assets/images/skins/redness.png') },
    { name: 'Hyperpigmentation', icon: require('../../assets/images/skins/acne.png') },
    { name: 'Whiteheads', icon: require('../../assets/images/skins/whiteheads.png') },
    { name: 'Wrinkles', icon: require('../../assets/images/skins/wrinkles.png') },
    { name: 'Rosacea', icon: require('../../assets/images/skins/rosesea.png') },
    { name: 'Pores', icon: require('../../assets/images/skins/pores.png') },
    { name: 'Blackheads', icon: require('../../assets/images/skins/blackheads.png') },
    { name: 'Eyebags', icon: require('../../assets/images/skins/eyebags.png') },
    { name: 'Eczema', icon: require('../../assets/images/skins/eczema.png') }
  ];

  const handleSavePreferences = async () => {
    try {
      const userPrefRef = doc(db, 'userPreferences', userId);
      await setDoc(userPrefRef, { userId: userId, skinType: selectedSkinType, skinConcerns }, { merge: true });
      navigation.navigate('UserCardTwo');
      console.log('User preferences saved successfully!');
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const progressStepsStyle = {
    activeStepIconBorderColor: '#63254E',
    activeLabelColor: '#63254E',
    activeStepNumColor: 'white',
    activeStepIconColor: '#63254E',
    completedStepIconColor: '#63254E',
    completedProgressBarColor: '#63254E',
    completedCheckColor: 'white',
    borderWidth: 1,
  };

  const buttonNext = {
    padding: 10,
    color: 'white',
    backgroundColor: '#63254E'
  };

  const buttonPrevious = {
    color: 'white',
    backgroundColor: '#63254E',
    padding: 10,
  };

  return (
    <View className="flex-1 pt-16 bg-white">
      {step === 1 && (
        <View>
          <View className="flex-row justify-start">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="bg-primary-dark p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
              <Image className="absolute top-0 left-4 w-5 h-5" 
                source={require('../../assets/icons/left-arrow.png')} />
            </TouchableOpacity>
          </View>

          <View className="justify-center items-center">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
              className="mx-24 text-center text-dark-pink mb-3">Step 1</Text>

            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}
              className=" text-center mb-8">Let's get to know your {"\n"} skin type!</Text>

            <View className="flex-row ">
              <TouchableOpacity 
                className={`bg-white justify-center border border-gray-100 shadow-md rounded-md p-3 m-2 w-40 items-center ${selectedSkinType === 'Dry' && 'border-dark-pink'}`}
                onPress={() => setSelectedSkinType('Dry')}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                  className={`text-lg font-semibold ${selectedSkinType === 'Dry' ? 'text-dark-pink' : 'text-black'}`}>Dry</Text>

                <Image style={{ width: 80, height: 100}} className="mt-2 mb-3 "
                  source={require('../../assets/images/dry-skintype.png')} />

                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 12 }} 
                  className="text-center mb-2">Tight, flaky and sensitive 
                  to redness and itching.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-white border border-gray-100 shadow-md rounded-md p-3 m-2 w-40 items-center ${selectedSkinType === 'Oily' && 'border-dark-pink'}`}
                onPress={() => setSelectedSkinType('Oily')}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                  className={`text-lg font-semibold ${selectedSkinType === 'Oily' ? 'text-dark-pink' : 'text-black'}`}>Oily</Text>

                <Image style={{ width: 80, height: 100}} className="mt-2 mb-3 "
                  source={require('../../assets/images/oily-skintype.png')} />

                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 12 }}
                  className="text-center">Shiny, oily with 
                  pores and prone to acne.</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className={`bg-white border border-gray-100 shadow-md rounded-md p-3 m-2 w-40 items-center ${selectedSkinType === 'Combination' && 'border-dark-pink'}`}
                onPress={() => setSelectedSkinType('Combination')}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                  className={`text-lg font-semibold ${selectedSkinType === 'Combination' ? 'text-dark-pink' : 'text-black'}`}>Combination</Text>

                <Image style={{ width: 80, height: 100}} className="mt-2 mb-3 "
                  source={require('../../assets/images/combi-skintype.png')} />

                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 12 }}
                  className="text-center">Mix of dry and oily parts, 
                  often the T-zone is oily 
                  and cheeks are drier.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-white  border border-gray-100 shadow-md rounded-md p-3 m-2 w-40 items-center ${selectedSkinType === 'Normal' && 'border-dark-pink'}`}
                onPress={() => setSelectedSkinType('Normal')}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                  className={`text-lg font-semibold ${selectedSkinType === 'Normal' ? 'text-dark-pink' : 'text-black'}`}>Normal</Text>

                <Image style={{ width: 80, height: 100}} className="mt-2 mb-3 "
                  source={require('../../assets/images/normal-skintype.png')} />

                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 12 }}
                  className="text-center">Balanced skin in aspects of dryness and oilyness.</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={openModal} className="mt-5 border border-gray-200 rounded-xl py-2 px-2 flex-row">
              <Image className="w-3.5 h-3.5 mr-1" style={{ tintColor: "#A8A8A8"}}
                source={require('../../assets/icons/info.png')} />
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 13 }}
                className="text-gray-500">I don't know my skin type</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} className="mt-8 py-2.5 bg-dark-pink rounded-full mb-5 w-60 flex mx-auto shadow-md">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                className="text-xl font-bold text-center text-white">Next</Text>
            </TouchableOpacity>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={closeModal}
            >
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                className="flex-1 justify-center align-center">
                <View className="bg-white p-7 mx-20 rounded-md">
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
                    className="text-center mb-3">Don’t know your skin type?</Text>
                  
                  <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 15 }}
                    className="text-center mb-5">Wash your face with a gentle cleanser and wait 
                    15-30 minutes. Look and feel your face to see which skin type
                    and description matches your skin.</Text>

                  <TouchableOpacity onPress={closeModal} className="bg-dark-pink py-1.5 mx-12 rounded-xl"> 
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                      className="text-white text-center">I got it!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      )}

      {step === 2 && (
        <View className="justify-center items-center pt-4">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
            className="mx-24 text-center text-dark-pink mb-3">Step 2</Text>

          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}
            className="mx-18 text-center mb-8">What are your Skin  {"\n"} Concerns?</Text>

          <View className="p-5">
            <View className="flex-row flex-wrap justify-center">
              {skinConcernList.map(concern => (
                <SkinConcernOption
                  key={concern.name}
                  concern={concern.name}
                  icon={concern.icon}
                  isSelected={skinConcerns.includes(concern.name)}
                  onPress={() => handleToggleSkinConcern(concern.name)}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={handleSavePreferences} className="mt-8 py-2.5 bg-dark-pink rounded-full mb-5 w-60 flex mx-auto shadow-md">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
              className="text-xl font-bold text-center text-white">Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePrevious}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
              className="pt-5 color-gray-500">Go back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
