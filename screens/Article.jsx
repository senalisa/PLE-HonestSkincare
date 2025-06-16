import React, { useState, useEffect } from 'react';
import { View, Text, PixelRatio, TextInput, TouchableOpacity, FlatList, Pressable, Image, ImageBackground, KeyboardAvoidingView, Platform} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, arrayUnion, Timestamp, deleteDoc} from 'firebase/firestore';
import { db, auth } from '../config/firebase'; 
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import ExpertPopUp from '../components/ExpertPopUp'

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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [showAuthor, setShowAuthor] = useState(false);

   //Responsive font size
      const fontScale = PixelRatio.getFontScale();
      const getFontSize = size => size / fontScale;


  //Fetch the article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(db, 'articles', articleId);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
          const data = articleSnap.data();
          setArticle(data);
          const userId = auth.currentUser?.uid;
          if (userId) {
            setIsLiked(data.likedBy?.includes(userId));
            setIsSaved(data.savedBy?.includes(userId));
          }
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

  const toggleLike = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId || !article) return;

  const articleRef = doc(db, 'articles', articleId);

  if (isLiked) {
    await updateDoc(articleRef, {
      likedBy: arrayRemove(userId),
      likes: article.likes - 1
    });
    setIsLiked(false);
    setArticle(prev => ({ ...prev, likes: prev.likes - 1 }));
  } else {
    await updateDoc(articleRef, {
      likedBy: arrayUnion(userId),
      likes: article.likes + 1
    });
    setIsLiked(true);
    setArticle(prev => ({ ...prev, likes: prev.likes + 1 }));
  }
};


  const toggleSave = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const articleRef = doc(db, 'articles', articleId);
    if (isSaved) {
      await updateDoc(articleRef, { savedBy: arrayRemove(userId) });
      setIsSaved(false);
    } else {
      await updateDoc(articleRef, { savedBy: arrayUnion(userId) });
      setIsSaved(true);
    }
  };

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
  if (!article.sections || !Array.isArray(article.sections)) return null;

  return article.sections.map((section, index) => (
    <View key={index} className="mt-6">
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>
        {section.subtitle}
      </Text>
      <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }} className="mt-1">
        {section.text}
      </Text>
      {section.image && (
        <Image
          source={{ uri: section.image }}
          className="mt-2 w-full h-48 rounded-lg"
          resizeMode="cover"
        />
      )}
    </View>
  ));
};

const getReadTime = (sections) => {
  const totalWords = sections.reduce((count, section) => {
    const wordsInText = section.text?.split(/\s+/).length || 0;
    const wordsInSubtitle = section.subtitle?.split(/\s+/).length || 0;
    return count + wordsInText + wordsInSubtitle;
  }, 0);

  const minutes = Math.ceil(totalWords / 200); // 200 woorden per minuut lezen
  return `${minutes} min${minutes > 1 ? 's' : ''} read`;
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
  const renderHeader = () => {const formattedDate = format(article.createdAt.toDate(), 'MMM d, yyyy'); 

return (
    
    <View>
      {/* Background image */}
      <ImageBackground source={{ uri: article.articleCover }} resizeMode="cover">
         <View
                className="flex-row justify-between bg-primary-dark px-2 rounded-tr-2xl rounded-bl-2xl mx-4 pb-40 pt-14 shadow">
                        {/* Back button */}
                        <Pressable onPress={() => navigation.goBack()}>
                            <Image className="w-5 h-5" 
                                            source={require('./../assets/icons/left-arrow.png')} />
                        </Pressable>
        
                        {/* Article Tag */}
                        <View className="flex-row flex-wrap gap-2">
                        {article.tags.articleCategory?.map((tag, index) => (
                          <View key={index} className="border border-dark-pink bg-dark-pink rounded-xl px-2 py-0.5">
                            <Text
                              style={{ fontFamily: 'Montserrat_600SemiBold' }}
                              className="text-white text-xs">
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>
                </View> 
      </ImageBackground>

      <View className="-mt-20 bg-white rounded-t-3xl pb-5 px-6" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 }, // naar boven
            shadowOpacity: 0.08,
            shadowRadius: 6,
            zIndex: 5, // zodat hij boven andere elementen ligt indien nodig
          }}>

        <View className="flex-row justify-between items-center mt-7 mb-2 px-1">
          {/* Links: datum + leestijd */}
          <Text
            style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11) }}
            className="text-gray-500"
          >
            {formattedDate} – {getReadTime(article.sections)}
          </Text>

          {/* Rechts: Save button */}
          <Pressable onPress={toggleSave}>
            <Image
              source={require('../assets/icons/save.png')}
              className="w-5 h-5"
              style={{ tintColor: '#888' }} // Optioneel: kleur aanpassen
            />
          </Pressable>
        </View>


        {/* Title */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(20) }}
        className="font-bold">{article.articleTitle}</Text>

        {/* Intro */}
        <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }}
        className="font-bold mt-3">{article.articleIntro}</Text>

        {/* Tags */}
        <View className="mt-3 space-y-2 flex-row flex-wrap items-center">
            {/* Skin Types */}
            {article.tags?.skinTypes?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 items-center mr-2">
                {/* <Text className="text-gray-600" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}>Skin Type:</Text> */}
                {article.tags.skinTypes.map((tag, index) => (
                  <View key={index} className="bg-light-blue px-2 py-0.5 rounded-full border border-blue">
                    <Text className="text-blue" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(11) }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Skin Concerns */}
            {article.tags?.skinConcerns?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 items-center mr-2">
                {/* <Text className="text-xs font-semibold text-gray-600">Concerns:</Text> */}
                {article.tags.skinConcerns.map((tag, index) => (
                  <View key={index} className="bg-yellow px-2 py-0.5 rounded-full border border-dark-yellow">
                    <Text className="text-xs text-dark-yellow" style={{ fontFamily: 'Montserrat_500Medium' , fontSize: getFontSize(11) }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Ingredient Tags */}
            {article.tags?.ingredients?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 items-center mr-2">
                {/* <Text className="text-xs font-semibold text-gray-600">Ingredients:</Text> */}
                {article.tags.ingredients.map((tag, index) => (
                  <View key={index} className="bg-red-50 px-2 py-0.5 rounded-full border border-red-700">
                    <Text className="text-xs text-red-700" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(11) }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Sustainability Tags */}
            {article.tags?.sustainability?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 items-center mr-2">
                {/* <Text className="text-xs font-semibold text-gray-600">Sustainability:</Text> */}
                {article.tags.sustainability.map((tag, index) => (
                  <View key={index} className="bg-green-50 border border-green-800 px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-green-800" style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(11) }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

      <Pressable className="flex-row items-center pt-3" onPress={() => setShowAuthor(true)}>
        <Image className="w-5 h-5" source={require('./../assets/images/user.png')} />
        <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12) }} className="px-2 underline text-dark-pink">
          {article.author}
        </Text>
      </Pressable>

      {/* Line */}
      <View className="border-b border-gray-300 mt-5" />

      {/* Description */}
      <View>
        {renderDescription()}
      </View>

      {/* Line */}
      <View className="border-b border-gray-300 mt-8" />

      <View className="flex-row justify-between items-center mt-4 px-2">
      {/* Like button */}
      <TouchableOpacity onPress={toggleLike}>
        <View className="flex-row items-center">
          <Image
            source={require('../assets/icons/like.png')}
            className="w-6 h-6 mr-2"
            style={{ tintColor: '#888' }}
          />
          <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}>
            {article.likes ?? 0}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Comment button */}
      <TouchableOpacity onPress={() => console.log('Comment')}>
        <View className="flex-row items-center">
          <Image
            source={require('../assets/icons/speech-bubble.png')}
            className="w-6 h-6 mr-2"
            style={{ tintColor: '#888' }}
          />
          <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}>
            {commentCount}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Info button */}
      <TouchableOpacity onPress={() => console.log('Info')}>
        <Image
          source={require('../assets/icons/info.png')}
          className="w-6 h-6"
          style={{ tintColor: '#888' }}
        />
      </TouchableOpacity>
    </View>

      
      </View>

        {/* Comments text */}
        <View className="mt-6 mb-2 mx-5 flex-row">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-lg">
                Comments 
                </Text>

                {/* <View className="-mt-1">
                    <View className="bg-gray-300 px-1.5 rounded-full ml-1">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                        className="py-0.5 text-white">
                            {commentCount} 
                        </Text>
                    </View>
                </View> */}
        </View>

        <ExpertPopUp
          visible={showAuthor}
          onClose={() => setShowAuthor(false)}
          onViewProfile={() => {
            setShowAuthor(false);
            navigation.navigate('ExpertProfile');
          }}
        />

    </View>
    
    );
  };

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

                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(12) }}
                        className="font-bold mb-1">{item.authorName} </Text>

                        <Text className="ml-2 mt-0.5 text-gray-400"
                        style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(10) }}
                        >{getTimeAgo(item.timestamp)}</Text>

                    </View>
                
                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }} className="pr-8">{item.text}</Text>
                </View>

            <View className="flex-row">

                <TouchableOpacity onPress={() => {
                toggleReply(item.id, item.authorName);
                setReplying(true);
                }}>
                <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                className="text-gray-400 mt-2 mr-5">
                    Reply
                </Text>
                </TouchableOpacity>

                {item.replies && item.replies.length > 0 && (
                <TouchableOpacity onPress={() => toggleComment(item.id)}>
                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                    className="text-gray-400 mt-2 mr-5">
                    {expandedComments[item.id] ? `Hide ${item.replies.length} Replies` : `Show ${item.replies.length} Replies`}
                    </Text>
                </TouchableOpacity>
                )}

                {item.authorId === user.uid && (
                    <View className="justify-self-end">
                        <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
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
    <Image className="w-6 h-6 -mt-2" style={{ tintColor: "#FB6F93"}} source={require('../assets/icons/send.png')} />
  </TouchableOpacity>
</View>
</View>

</View>
  </KeyboardAvoidingView>
  )
};

