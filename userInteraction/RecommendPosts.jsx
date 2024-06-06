// recommendPosts.js
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { TrainModel } from './TrainModel';

export async function RecommendPosts(userId) {
  const interactions = await getUserInteractions(userId);
  const model = await TrainModel(interactions);

  // Haal alle posts op
  const postsSnapshot = await getDocs(collection(db, 'posts'));
  const allPosts = [];
  postsSnapshot.forEach(doc => allPosts.push({ id: doc.id, ...doc.data() }));

  // Maak feature vectoren voor alle posts
  const postVectors = allPosts.map(post => ({
    id: post.id,
    vector: post.skinCareProductTags.map(tag => tagToIndex(tag))
  }));

  // Voorspel scores voor elke post
  const scores = postVectors.map(post => ({
    id: post.id,
    score: model.predict(tf.tensor2d([post.vector])).dataSync()[0]
  }));

  // Sorteer posts op score
  scores.sort((a, b) => b.score - a.score);

  // Return de gesorteerde posts
  const recommendedPosts = scores.map(score => allPosts.find(post => post.id === score.id));
  return recommendedPosts;
}
