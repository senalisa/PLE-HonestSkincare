import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image, ImageBackground, KeyboardAvoidingView, Platform} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, arrayUnion, Timestamp, deleteDoc} from 'firebase/firestore';
import { db, auth } from '../config/firebase'; 
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert } from 'react-native';

const addComment = async (articleId, text, authorId, authorName) => {
  try {
    await addDoc(collection(db, 'articles', articleId, 'comments'), {
      text,
      authorId,
      authorName,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding comment: ', error);
  }
};

const addReply = async (articleId, commentId, text, authorId, authorName) => {
    try {
      const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const existingReplies = commentSnap.data().replies || [];
      
      const timestamp = Timestamp.now(); 
      const updatedReplies = [...existingReplies, { text, authorId, authorName, timestamp }];
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
    const navigation = useNavigation();

  const route = useRoute();
  const { articleId } = route.params; 

  const user = auth.currentUser;

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newInput, setNewInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // Toegevoegd om bij te houden op welke comment er wordt gereplied
  const [expandedComments, setExpandedComments] = useState({});
  const [replying, setReplying] = useState(false);
  const [replyingAuthorName, setReplyingAuthorName] = useState(null);


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

   // Definieer de containsLink functie
   const containsLink = (text) => {
    const urlPattern = /(?:https?|ftp):\/\/[\n\S]+|www\.[\S]+/ig;
    return urlPattern.test(text);
};

const handleAddInput = async () => {
  if (newInput.trim().length === 0) {
    return;
  }
  
  // Check of de input een link bevat
  if (containsLink(newInput)) {
    // Toon een pop-up om de gebruiker te informeren over het linkbeleid
    Alert.alert(
      'Link Policy',
      'The posting of links is not allowed to ensure the safety and integrity of our community. For more info read the Community Guidelines',
      [{ text: 'OK' }]
    );
    return;
}
    
    const user = auth.currentUser;
    
    if (!user || !user.displayName) {
      console.error('User is not logged in or has no display name.');
      return;
    }
  
    const authorId = user.uid;
    const authorName = user.displayName;
  
    if (replyingTo) {
      await addReply(articleId, replyingTo, newInput, authorId, authorName); 
      setReplyingTo(null);
    } else {
      await addComment(articleId, newInput, authorId, authorName); 
    }
    
    setNewInput('');
    const updatedComments = await getComments(articleId);
    setComments(updatedComments);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'articles', articleId, 'comments', commentId));
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment: ', error);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const existingReplies = commentSnap.data().replies || [];
      const updatedReplies = existingReplies.filter(reply => reply.id !== replyId);
      await updateDoc(commentRef, { replies: updatedReplies });
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: updatedReplies };
        } else {
          return comment;
        }
      });
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting reply: ', error);
    }
  };
  

  const toggleReply = (commentId, authorName) => {
    setReplyingTo(commentId);
    setReplyingAuthorName(authorName); // Stel de naam van de auteur in voor weergave
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

  const renderHeader = () => (
    <View>
      <ImageBackground source={{ uri: article.articleImage }} resizeMode="cover">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-primary-dark px-2 rounded-tr-2xl rounded-bl-2xl ml-4 pb-40 pt-14 shadow">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View className="-mt-14 bg-white rounded-t-xl pt-8 pb-5 px-6">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }}
        className="font-bold">{article.articleTitle}</Text>

        <Text className="mt-5" style={{ fontFamily: 'Montserrat_500Medium', fontSize: 16 }}>
        {article.articleDescription}
        </Text>

        <Text className="mt-5 text-dark-pink" style={{ fontFamily: 'Montserrat_500Medium_Italic', fontSize: 16 }}>
        Share your thoughts and experiences!
        </Text>

        <View className="flex-row pt-8">
                        <Text
                        style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                            Honest Skincare Staff
                        </Text>

                        <Image className="w-1 h-1 mt-1 ml-3" style={{ tintColor: "#63254E"}}
                                                source={require('./../assets/images/user.png')} />

                        <Text 
                        className="ml-3"
                        style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                            4 days ago
                        </Text>
        </View>

        <View className="mt-10 border-b border-gray-100 pb-5">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
                >Comments</Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View className="px-8 pr-14 py-3 flex-row">

                <View>
                                <Image className="w-6 h-6" 
                                                        source={require('./../assets/images/user.png')} />
                </View>

              <View className="ml-3">               

              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
              className="font-bold mb-1">Author: {item.authorName}</Text>
             
              <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }} className="pr-8">{item.text}</Text>

              <View className="flex-row justify-between">
  
                  <TouchableOpacity onPress={() => {
                  toggleReply(item.id, item.authorName);
                  setReplying(true);
                  }}>
                  <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                  className="text-gray-400 mt-2">
                      Reply
                  </Text>
                  </TouchableOpacity>

                  {item.authorId === user.uid && (
                      <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                        className="text-red-500 underline mt-2">Delete</Text>
                      </TouchableOpacity>
                    )}

              </View>

             

              {item.replies && item.replies.length > 0 && (
                <TouchableOpacity onPress={() => toggleComment(item.id)}>
                  <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                  className="text-gray-400 mt-2 flex-row">
                    <Image className="w-5 h-5 -mt-1.5 mr-1" style={{ tintColor: "#CBCACA"}}
                                      source={require('./../assets/icons/minus.png')} />
                    {expandedComments[item.id] ? 'Hide Replies' : 'Show Replies'}
                  </Text>
                </TouchableOpacity>
              )}
              {expandedComments[item.id] && item.replies && item.replies.map((reply, index) => (
                <View key={index} className="ml-8 mt-5">

                  <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                  className="mb-1">Author: {reply.authorName}</Text>

                  <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }}>{reply.text}</Text>

                  {reply.authorId === user.uid && (
                    <TouchableOpacity onPress={() => handleDeleteReply(item.id, reply.timestamp)}>
                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                      className="text-red-500 underline mt-2">Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              </View>
            </View>
          )}
        />

<View className=" bg-white border-t border-gray-300 shadow-xl">

  <View className="flex-row justify-between mt-3 mx-5">

  {replying && (
  <View className="replyIndicator">
    <Text style={{ fontFamily: 'Montserrat_500Medium_Italic', fontSize: 13 }}
    className="replyIndicatorText">Replying to: {replyingAuthorName}</Text>
  </View>
)}
  
    
  {replying && (
    <TouchableOpacity onPress={() => {
      setReplying(false);
      setReplyingTo(null);
    }}
    className="bg-white">
      <View>
        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
        className="text-dark-pink underline">
          Cancel Reply
        </Text>
      </View>
    </TouchableOpacity>
  )}

</View>

  <View className="flex-row bg-white p-4 pb-8 justify-between">
    <TextInput
      className="border border-gray-300 p-2 rounded-lg w-[350]"
      placeholder={replyingTo ? "Reply to comment..." : "Add a comment..."}
      value={newInput}
      onChangeText={setNewInput}
    />
    <TouchableOpacity onPress={handleAddInput} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2">
      <Image className="w-6 h-6 -mt-2" style={{ tintColor: "#63254E"}} source={require('../assets/icons/send.png')} />
    </TouchableOpacity>
  </View>
</View>

      </View>
    </KeyboardAvoidingView>
  );
};

