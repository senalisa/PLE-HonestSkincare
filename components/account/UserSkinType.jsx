import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; 
import { useNavigation } from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'

// Definieer de herbruikbare component
const SkinConcernOption = ({ concern, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: isSelected ? '#63254E' : '#ddd',
        borderRadius: 20,
        margin: 8,
        backgroundColor: isSelected ? '#63254E' : 'white',
      }}
    >
      <Text style={{ color: isSelected ? 'white' : 'black', fontFamily: 'Montserrat_500Medium', fontSize: 16  }}>{concern}</Text>
    </TouchableOpacity>
  );
};

export default function UserSkinType() {
  const navigation = useNavigation()

  const [userId, setUserId] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState([]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    step1Data: '',
    step2Data: '',
    // Voeg hier meer stappen toe indien nodig
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
    // Haal de gebruikers-id op zodra de gebruiker is ingelogd
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
    // Haal de voorkeuren van de gebruiker op uit de database wanneer de component wordt geladen
    const fetchUserPreferences = async () => {
      try {
        if (userId) { // Controleer of userId niet null is
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

  // Lijst van skin concerns
  const skinConcernList = ['Dryness', 'Acne', 'Redness', 'Hyperpigmentation', 'Wrinkles', 'Rosacea', 'Pores', 'Blackheads'];

  const handleSavePreferences = async () => {
    try {
      const userPrefRef = doc(db, 'userPreferences', userId);
      await setDoc(userPrefRef, { userId: userId, skinType: selectedSkinType, skinConcerns }, { merge: true });
      navigation.navigate('UserCardTwo')
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

           {/* Backbutton */}
           <View className="flex-row justify-start">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="bg-primary-dark p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                    <ArrowLeftIcon size="20" color="black"></ArrowLeftIcon>
                </TouchableOpacity>
            </View>

          <View className="justify-center items-center">

            {/* Step 1 */}
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
            className="mx-24 text-center text-dark-pink mb-3"
            >Step 1
            </Text>

            {/* Title */}
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}
            className=" text-center mb-8"
            >Let's get to know your {"\n"} skin type!
            </Text>

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
                  className="text-center">Balanced, smooth 
                  and healty.</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={openModal} className="mt-5 border border-gray-200 rounded-xl py-2 px-2 flex-row">
              <Image className="w-3.5 h-3.5 mr-1" style={{ tintColor: "#A8A8A8"}}
                              source={require('../../assets/icons/info.png')} />
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 13 }}
              className="text-gray-500"
              >I don't know my skin type</Text>
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
          <View className="justify-center items-center pt-9">

             {/* Step 2*/}
             <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
            className="mx-24 text-center text-dark-pink mb-3"
            >Step 2
            </Text>

            {/* Title */}
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}
            className="mx-18 text-center mb-8"
            >What are your Skin  {"\n"} Concerns?
            </Text>

            <View className="p-10">
              <View className="flex-row flex-wrap justify-center">
                {skinConcernList.map(concern => (
                  <SkinConcernOption
                    key={concern}
                    concern={concern}
                    isSelected={skinConcerns.includes(concern)}
                    onPress={() => handleToggleSkinConcern(concern)}
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
