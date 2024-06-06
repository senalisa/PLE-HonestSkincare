// trackPostView.js
import { db } from '../config/firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, limit, deleteDoc, where, getDocs } from 'firebase/firestore';

export async function TrackPostView(userId, postId) {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const postTags = postSnapshot.data().skincareProductTags;
      const userInteractionCollectionRef = collection(db, 'userInteractions', userId, 'interactions');

      // Voeg een nieuwe interactie toe
      await addDoc(userInteractionCollectionRef, {
        postId: postId,
        timestamp: new Date(),
        skincareProductTags: postTags
      });

      // Beperk het aantal interacties tot de laatste 50
      const interactionQuery = query(userInteractionCollectionRef, orderBy('timestamp', 'desc'), limit(50));
      const interactionSnapshot = await getDocs(interactionQuery);

      const interactionDocs = interactionSnapshot.docs;

      if (interactionDocs.length > 50) {
        // Verwijder oudere interacties als er meer dan 50 zijn
        const excessInteractions = interactionDocs.slice(50);
        const batch = db.batch();
        
        excessInteractions.forEach(doc => {
          batch.delete(doc.ref);
        });

        await batch.commit();
      }
    } else {
      console.error('Post not found');
    }
  } catch (error) {
    console.error('Error tracking post view:', error);
  }
}

