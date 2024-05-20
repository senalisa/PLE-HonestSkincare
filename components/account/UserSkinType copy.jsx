import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; // Firebase-configuratie importeren

export default function UserSkinType() {
  const [userId, setUserId] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState([]);

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

  const handleSavePreferences = async () => {
    try {
      const userPrefRef = doc(db, 'userPreferences', userId);
      await setDoc(userPrefRef, { userId: userId, skinType: selectedSkinType, skinConcerns }, { merge: true });
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
    <View className="flex-1 pt-14 bg-white">
       <ProgressSteps {...progressStepsStyle}>

        <ProgressStep label="Skin Type" nextBtnTextStyle={buttonNext}>
          <View className="flex-1 justify-center items-center">

            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }}
            className="mx-24 text-center"
            >Let's get to know your skin type!
            </Text>

            <View className="flex-row ">
                <TouchableOpacity 
                  className={`bg-white justify-center border border-gray-100 shadow-sm rounded-md p-3 m-2 w-40 ${selectedSkinType === 'Dry' && 'bg-blue-500'}`}
                  onPress={() => setSelectedSkinType('Dry')}
                >
                  <Text className={`text-lg font-semibold ${selectedSkinType === 'Dry' ? 'text-white' : 'text-black'}`}>Dry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`bg-white border border-gray-100 shadow-sm rounded-md p-3 m-2 w-40 ${selectedSkinType === 'Normal' && 'bg-blue-500'}`}
                  onPress={() => setSelectedSkinType('Normal')}
                >
                  <Text className={`text-lg font-semibold ${selectedSkinType === 'Normal' ? 'text-dark-pink' : 'text-black'}`}>Normal</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row">
                <TouchableOpacity
                  className={`bg-white border border-gray-100 shadow-sm rounded-md p-3 m-2 w-40 ${selectedSkinType === 'Oily' && 'bg-blue-500'}`}
                  onPress={() => setSelectedSkinType('Oily')}
                >
                  <Text className={`text-lg font-semibold ${selectedSkinType === 'Oily' ? 'text-white' : 'text-black'}`}>Oily</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`bg-white  border border-gray-100 shadow-sm rounded-md p-3 m-2 w-40 ${selectedSkinType === 'Combination' && 'bg-blue-500'}`}
                  onPress={() => setSelectedSkinType('Combination')}
                >
                  <Text className={`text-lg font-semibold ${selectedSkinType === 'Combination' ? 'text-white' : 'text-black'}`}>Combination</Text>
                </TouchableOpacity>
            </View>
          </View>
        </ProgressStep>

        
        <ProgressStep label="Skin Concerns" onSubmit={handleSavePreferences} previousBtnTextStyle={buttonPrevious} finishBtnText="Submit">
          <View className="p-4">
            <TouchableOpacity
              onPress={() => handleToggleSkinConcern('Dryness')}
              className={`p-3 border rounded mb-3 ${skinConcerns.includes('Dryness') ? 'bg-blue-500' : 'bg-white'}`}
            >
              <Text className={`${skinConcerns.includes('Dryness') ? 'text-white' : 'text-black'}`}>Dryness</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleToggleSkinConcern('Acne')}
              className={`p-3 border rounded mb-3 ${skinConcerns.includes('Acne') ? 'bg-blue-500' : 'bg-white'}`}
            >
              <Text className={`${skinConcerns.includes('Acne') ? 'text-white' : 'text-black'}`}>Acne</Text>
            </TouchableOpacity>
            {/* Voeg andere huidzorgopties op dezelfde manier toe */}
          </View>

          <View className="flex-1 justify-center items-center">
            <TouchableOpacity
              className="bg-blue-500 rounded-md p-4"
              onPress={handleSavePreferences}
            >
              <Text className="text-lg font-semibold text-black">Opslaan</Text>
            </TouchableOpacity>
          </View>
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
}
