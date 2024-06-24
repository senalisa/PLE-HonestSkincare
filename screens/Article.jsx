import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image, ImageBackground, KeyboardAvoidingView, Platform} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, arrayUnion, Timestamp, deleteDoc} from 'firebase/firestore';
import { db, auth } from '../config/firebase'; 
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

//Function to add a comment
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

//Function to add a reply to a comment
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

//Function to get the comments of the article
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
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [replying, setReplying] = useState(false);
  const [replyingAuthorName, setReplyingAuthorName] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  //Fetch the article
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

  //Fetch the comment count
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const commentsRef = collection(db, 'articles', articleId, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        setCommentCount(commentsSnapshot.size);
      } catch (error) {
        console.error('Error fetching comment count:', error);
      }
    };

    fetchCommentCount();
  }, [comments, articleId]);

  //Check if the user's comment contains a link
  const containsLink = (text) => {
    const urlPattern = /(?:https?|ftp):\/\/[\n\S]+|www\.[\S]+/ig;
    return urlPattern.test(text);
  };

  // Add the reply
  const handleAddInput = async () => {
    if (newInput.trim().length === 0) {
      return;
    }

    if (containsLink(newInput)) {
      Alert.alert(
        'Link Policy',
        'The posting of links is not allowed to ensure the safety and integrity of our community. For more info read the Community Guidelines',
        [{ text: 'OK' }]
      );
      return;
    }

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

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'articles', articleId, 'comments', commentId));
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment: ', error);
    }
  };

  // Function to toggle a reply
  const toggleReply = (commentId, authorName) => {
    setReplyingTo(commentId);
    setReplyingAuthorName(authorName);
  };

  // Function to toggle comments
  const toggleComment = (commentId) => {
    setExpandedComments({
      ...expandedComments,
      [commentId]: !expandedComments[commentId],
    });
  };

  // Function to get the time ago of a comment 
  const getTimeAgo = (timestamp) => {
    const currentDate = new Date();
    const commentDate = timestamp.toDate();

    const timeDifference = currentDate - commentDate;
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return `${secondsDifference} sec ago`;
    } else if (secondsDifference < 3600) {
      const minutesDifference = Math.floor(secondsDifference / 60);
      return `${minutesDifference} min ago`;
    } else if (secondsDifference < 86400) {
      const hoursDifference = Math.floor(secondsDifference / 3600);
      return `${hoursDifference} hours ago`;
    } else {
      const daysDifference = Math.floor(secondsDifference / 86400);
      return `${daysDifference} days ago`;
    }
  };

  // RRender the description of an article
  const renderDescription = () => {
    return article.articleDescription.map((desc, index) => (
      <Text
        key={index}
        className="mt-5"
        style={{ fontFamily: 'Montserrat_500Medium', fontSize: 16 }}
      >
        {desc}
      </Text>
    ));
  };

  // Load indicator
  if (!article) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Head of an article
  const renderHeader = () => (
    <View>
      {/* Background image */}
      <ImageBackground source={{ uri: article.articleImage }} resizeMode="cover">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-primary-dark px-2 rounded-tr-2xl rounded-bl-2xl ml-4 pb-40 pt-14 shadow">
            <Image className="w-5 h-5" source={require('./../assets/icons/left-arrow.png')} />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Title */}
      <View className="-mt-14 bg-white rounded-t-xl pt-8 pb-5 px-6">
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }}
        className="font-bold">{article.articleTitle}</Text>

      {/* Description */}
      <View>
        {renderDescription()}
      </View>

        {/* Finish line */}
        <Text className="mt-5 text-dark-pink" style={{ fontFamily: 'Montserrat_500Medium_Italic', fontSize: 16 }}>
        Share your thoughts and experiences!
        </Text>

        {/* Author */}
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

        </View>

        {/* Comments text */}
        <View className="mt-6 mb-2 mx-5 flex-row">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-lg">
                Comments 
                </Text>

                <View className="-mt-1">
                    <View className="bg-gray-300 px-1.5 rounded-full ml-1">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                        className="py-0.5 text-white">
                            {commentCount} 
                        </Text>
                    </View>
                </View>
        </View>
    </View>
  );

  return (
    // Comments
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <View className="flex-1">

    <LinearGradient
        colors={['#FCFCFC', '#FCFCFC', '#FCFCFC']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        renderItem={({ item }) => (
          <View className="px-5 pr-14 py-3 flex-row w-full">

              <View>
                              <Image className="w-6 h-6" 
                                                      source={require('./../assets/images/user.png')} />
              </View>

            <View className="ml-3">               

                <View className="bg-white p-3 rounded-xl shadow-sm">
                    <View className="flex-row">

                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                        className="font-bold mb-1">{item.authorName} </Text>

                        <Text className="ml-2 mt-0.5 text-gray-400"
                        style={{ fontFamily: 'Montserrat_500Medium', fontSize: 10 }}
                        >{getTimeAgo(item.timestamp)}</Text>

                    </View>
                
                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }} className="pr-8">{item.text}</Text>
                </View>

            <View className="flex-row">

                <TouchableOpacity onPress={() => {
                toggleReply(item.id, item.authorName);
                setReplying(true);
                }}>
                <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                className="text-gray-400 mt-2 mr-5">
                    Reply
                </Text>
                </TouchableOpacity>

                {item.replies && item.replies.length > 0 && (
                <TouchableOpacity onPress={() => toggleComment(item.id)}>
                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                    className="text-gray-400 mt-1.5 flex-row mr-5">
                    <Image className="w-5 h-5 -mt-2 mr-1" style={{ tintColor: "#CBCACA"}}
                                        source={require('./../assets/icons/minus.png')} />
                    {expandedComments[item.id] ? `Hide ${item.replies.length} Replies` : `Show ${item.replies.length} Replies`}
                    </Text>
                </TouchableOpacity>
                )}

                {item.authorId === user.uid && (
                    <View className="justify-self-end">
                        <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                        className="text-red-500 underline mt-2">Delete</Text>
                        </TouchableOpacity>
                    </View>
                  )}

            </View>

            {/* Replies on comment */}
            {expandedComments[item.id] && item.replies && item.replies.map((reply, index) => (
                <View>
                    <View key={index} className="ml-8 mt-5 flex-row">

                        {/* Image */}
                        <View>
                           <Image className="w-6 h-6" 
                              source={require('./../assets/images/user.png')} />
                        </View>

                    {/* Author + date + text */}
                    <View className="bg-white p-3 rounded-xl ml-3 shadow-sm">
                        <View className="flex-row">
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12 }}
                            className="font-bold mb-1">{reply.authorName} </Text>

                            <Text className="ml-2 mt-0.5 text-gray-400"
                            style={{ fontFamily: 'Montserrat_500Medium', fontSize: 10 }}
                            >{getTimeAgo(reply.timestamp)}</Text>
                        </View>
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 14 }} className="pr-8">{reply.text}</Text>
                    </View>
                    
                    </View>

                    <View className="flex-end">
                    </View>
                </View>
            ))}
            </View>
          </View>
        )}
      />
      </LinearGradient>

<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-xl">

{/* Bottom text input bar to write a comment or reply */}
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

<View className="flex-row bg-white px-4 pt-2 pb-10 justify-between">
    <View>
                                <Image className="w-6 h-6 mt-2 mr-4 ml-2" 
                                                        source={require('./../assets/images/user.png')} />
                </View>
  <TextInput
    className="border border-gray-300 p-2 pl-4 rounded-full flex-1"
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
  )
};

