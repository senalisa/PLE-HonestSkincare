import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; 

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

const addReply = async (articleId, commentId, text, authorId) => {
  try {
    const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    const existingReplies = commentSnap.data().replies || [];
    
    const timestamp = Timestamp.now(); 
    const updatedReplies = [...existingReplies, { text, authorId, timestamp }];
    await updateDoc(commentRef, { replies: updatedReplies });
  } catch (error) {
    console.error('Error adding reply: ', error);
  }
};

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
  const { articleId } = route.params; 

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newInput, setNewInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // Toegevoegd om bij te houden op welke comment er wordt gereplied
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

  const handleAddInput = async () => {
    if (newInput.trim().length === 0) {
      return;
    }
    
    if (replyingTo) {
      await addReply(articleId, replyingTo, newInput, 'currentUserId'); 
      setReplyingTo(null);
    } else {
      await addComment(articleId, newInput, 'currentUserId'); 
    }
    
    setNewInput('');
    const updatedComments = await getComments(articleId);
    setComments(updatedComments);
  };

  const toggleReply = (commentId) => {
    setReplyingTo(commentId); // Zet de commentId in state wanneer er op "Reply" wordt geklikt
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
            <TouchableOpacity onPress={() => toggleReply(item.id)}>
              <Text className="text-blue underline mt-2">
                {replyingTo === item.id ? 'Cancel Reply' : 'Reply'}
              </Text>
            </TouchableOpacity>
            {/* Weergave van reply-indicator */}
            {replyingTo === item.id && (
              <View className="replyIndicator">
                <Text className="replyIndicatorText">Replying to: {item.author}</Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Text className="closeButton">✕</Text>
                </TouchableOpacity>
              </View>
            )}

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
          </View>
        )}
      />

      {/* TextInput voor nieuwe input (comment of reply) */}
            <TextInput
        className="border border-gray-300 p-2 mt-2 rounded-lg"
        placeholder={replyingTo ? "Reply to comment..." : "Add a comment..."}
        value={newInput}
        onChangeText={setNewInput}
      />
      <TouchableOpacity onPress={handleAddInput} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2">
        <Text className="addButtonText">{replyingTo ? "Post Reply" : "Add comment"}</Text>
      </TouchableOpacity>
    </View>
  );
}


