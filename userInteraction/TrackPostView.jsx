// trackPostView.js
import { firestore } from '../config/firebase'; 

export async function TrackPostView(userId, postId) {
  const postSnapshot = await firestore.collection('posts').doc(postId).get();
  const postTags = postSnapshot.data().skincareProductTags;

  await firestore.collection('userInteractions').add({
    userId: userId,
    postId: postId,
    timestamp: new Date(),
    skincareProductTags: postTags
  });
}
