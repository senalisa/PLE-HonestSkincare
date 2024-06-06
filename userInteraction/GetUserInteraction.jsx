// getUserInteractions.js
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GetUserInteractions(userId) {
  const interactions = [];
  try {
    const interactionsRef = collection(db, 'userInteractions', userId, 'interactions');
    const interactionsQuery = query(interactionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(interactionsQuery);

    querySnapshot.forEach((doc) => {
      interactions.push(doc.data());
    });
  } catch (error) {
    console.error('Error getting user interactions:', error);
  }
  return interactions;
}
