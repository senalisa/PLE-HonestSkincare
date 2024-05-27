import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../config/firebase'; // Zorg ervoor dat het pad naar je configuratiebestand correct is
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

// Functie om een comment toe te voegen
const addComment = async (articleId, text, authorId) => {
    try {
      await addDoc(collection(db, 'articles', articleId, 'comments'), {
        text,
        authorId,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

//Functie om replies toe te voegen aan een comment
const addReply = async (articleId, commentId, text, authorId) => {
    try {
      const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const existingReplies = commentSnap.data().replies || [];
      
      const timestamp = Timestamp.now(); // Genereer de timestamp hier
      
      const updatedReplies = [...existingReplies, { text, authorId, timestamp }];
      await updateDoc(commentRef, { replies: updatedReplies });
    } catch (error) {
      console.error('Error adding reply: ', error);
    }
  };
  
  
  
  // Functie om comments op te halen
  const getComments = async (articleId) => {
    try {
      const commentsQuery = query(collection(db, 'articles', articleId, 'comments'), orderBy('timestamp', 'asc'));
      const commentsSnapshot = await getDocs(commentsQuery);
      return commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting comments: ', error);
    }
  };

export default function Article() {
  const route = useRoute();
  const { articleId } = route.params; // Zorg ervoor dat je de articleId correct doorgeeft in de navigatie

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(db, 'articles', articleId);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
          setArticle(articleSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    const fetchComments = async () => {
        const comments = await getComments(articleId);
        setComments(comments);
      };

    fetchArticle();
    fetchComments();
  }, [articleId]);

  const handleAddComment = async () => {
    if (newComment.trim().length === 0) {
      return;
    }
    await addComment(articleId, newComment, 'currentUserId'); // Vervang 'currentUserId' met de daadwerkelijke user ID
    setNewComment('');
    const updatedComments = await getComments(articleId);
    setComments(updatedComments);
  };

  const handleAddReply = async (commentId) => {
    const replyText = newReply[commentId];
    if (replyText.trim().length === 0) {
      return;
    }
    await addReply(articleId, commentId, replyText, 'currentUserId'); // Vervang 'currentUserId' met de daadwerkelijke user ID
    setNewReply({ ...newReply, [commentId]: '' });
    const updatedComments = await getComments(articleId);
    setComments(updatedComments);
  };

  const toggleComment = (commentId) => {
    setExpandedComments({
      ...expandedComments,
      [commentId]: !expandedComments[commentId],
    });
  };

  if (!article) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="mt-20 mx-10">
    <Text className="">Titel:</Text>
    <Text className="font-bold">{article.articleTitle}</Text>
  
    <FlatList
      data={comments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View className="p-8 border border-gray-100">
          <Text>{item.text}</Text>
          {/* Toggle-knop voor replies */}
          {item.replies && item.replies.length > 0 && (
            <TouchableOpacity onPress={() => toggleComment(item.id)}>
              <Text className="text-blue underline mt-2">
                {expandedComments[item.id] ? 'Hide Replies' : 'Show Replies'}
              </Text>
            </TouchableOpacity>
          )}
          {/* Weergave van replies */}
          {expandedComments[item.id] && item.replies && item.replies.map((reply, index) => (
            <View key={index} className="ml-8 mt-2">
              <Text>{reply.text}</Text>
            </View>
          ))}
          {/* TextInput voor nieuwe reply */}
          <TextInput
            className="border border-gray-300 p-2 mt-2 rounded-lg"
            placeholder="Add a reply..."
            value={newReply[item.id] || ''}
            onChangeText={(text) => setNewReply({ ...newReply, [item.id]: text })}
          />
          <TouchableOpacity onPress={() => handleAddReply(item.id)} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2">
            <Text>Post Reply</Text>
          </TouchableOpacity>
        </View>
      )}
    />
    
    {/* TextInput voor nieuwe comment */}
    <TextInput
      className="border border-gray-300 p-2 my-3 rounded-lg"
      placeholder="Add a comment..."
      value={newComment}
      onChangeText={setNewComment}
    />
    <TouchableOpacity onPress={handleAddComment} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
      <Text>Add comment</Text>
    </TouchableOpacity>
  </View>
  
    
  );
}
