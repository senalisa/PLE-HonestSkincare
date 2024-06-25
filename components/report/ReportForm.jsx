import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export default function ReportForm({ route }) {
  const { postId, title } = route.params;
  const [reportText, setReportText] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigation = useNavigation();
  const user = auth.currentUser;

  const reasons = ["Spam", "Harassment", "False Information", "Inappropriate Content"]; // Voeg hier meer redenen toe indien nodig

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setDropdownVisible(false);
  };

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      setModalMessage('Please select a reason for reporting.');
      setModalVisible(true);
      return;
    }

    if (!reportText.trim()) {
      setModalMessage('Please enter a report description.');
      setModalVisible(true);
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        postId,
        reportText,
        selectedReason,
        reportedBy: user.uid,
        timestamp: serverTimestamp(),
      });
      setModalMessage('Report submitted successfully. Your report has been sent to the Moderators of Honest Skincare and will be reviewed. Thank you!');
      setModalVisible(true);
    } catch (error) {
      setModalMessage('There was an error submitting the report.');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalMessage.includes('successfully')) {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <View className="px-5 flex-1 pt-16 bg-white">

      <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image className="absolute top-0  w-5 h-5" 
                                    source={require('../../assets/icons/left-arrow.png')} />
       </TouchableOpacity>

      <View>
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
        className="text-xl text-center">
          Report
        </Text>
      </View>

        <Text className="text-lg mt-8"
        style={{ fontFamily: 'Montserrat_500Medium'}}>You are reporting: </Text>
        <Text style={{ fontFamily: 'Montserrat_500Medium'}} className="text-black text-lg mb-8">{title}</Text>
        

        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}} className="mb-2 text-xl">What is the reason?</Text>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} className="border border-gray-400 px-4 py-2 mb-2 rounded-full">
          <Text className={`text-base ${!selectedReason ? 'text-gray-400' : 'text-black'}`} style={{ fontFamily: 'Montserrat_500Medium'}}>
            {selectedReason || "Select a reason..."}
          </Text>
        </TouchableOpacity>
        
        {dropdownVisible && (
          <View className="border border-gray-400 mb-4 rounded-xl pt-2 pb-4">
            {reasons.map((reason, index) => (
              <TouchableOpacity key={index} onPress={() => handleReasonSelect(reason)}>
                <Text className="py-2 px-4 text-base" style={{ fontFamily: 'Montserrat_500Medium'}}>{reason}</Text>
                <View className="border-b border-gray-200 mx-5" />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Text style={{ fontFamily: 'Montserrat_600SemiBold'}} className="mt-4 mb-2 text-xl">Description of the report</Text>
        <TextInput
          className="h-24 border border-gray-400 p-4 mb-4 rounded-xl"
          placeholder="Describe the issue..."
          value={reportText}
          onChangeText={setReportText}
          multiline
        />
        
        <TouchableOpacity onPress={handleSubmitReport} className="bg-dark-pink px-4 py-2.5 mt-4 rounded-full w-48 mx-auto">
          <Text className="text-white text-center text-lg" style={{ fontFamily: 'Montserrat_600SemiBold'}}>Submit Report</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className="bg-white p-4 rounded-md w-3/4 py-10">
              <Text className="text-lg mb-4 text-center mt-4" style={{ fontFamily: 'Montserrat_500Medium'}}>{modalMessage}</Text>
              <TouchableOpacity onPress={closeModal} className="bg-dark-pink px-4 py-2.5 rounded-md w-48 mx-auto rounded-full">
                <Text className="text-white text-center text-lg" style={{ fontFamily: 'Montserrat_600SemiBold'}}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
