// In ReportModal.jsx
import React, { useState } from 'react';
import { Modal, TextInput, Button, View } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Importeer Firestore functies
import { db } from '../../config/firebase'; // Importeer je Firestore database instantie

const ReportModal = ({ itemId, itemType, reporterId, onClose }) => {
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const addReport = async () => {
    try {
      await addDoc(collection(db, 'reports'), {
        itemId,
        itemType,  // 'post' or 'comment'
        reportReason,
        reportDescription,
        reporterId,
        timestamp: serverTimestamp(),
      });
      onClose(); // Sluit de modal na het rapporteren
    } catch (error) {
      console.error('Error reporting item: ', error);
    }
  };

  return (
    <Modal visible={true}>
      <View>
        <TextInput
          value={reportReason}
          onChangeText={setReportReason}
          placeholder="Reason for reporting"
        />
        <TextInput
          value={reportDescription}
          onChangeText={setReportDescription}
          placeholder="Additional details"
        />
        <Button title="Report" onPress={addReport} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default ReportModal;
