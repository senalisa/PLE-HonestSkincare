import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, arrayUnion, Timestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Linking } from 'react-native';
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { TrackPostView } from '../userInteraction/TrackPostView';

const addComment = async (postId, text, authorId, authorName) => {
  try {
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      text,
      authorId,
      authorName,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding comment: ', error);
  }
};

const addReply = async (postId, commentId, text, authorId, authorName) => {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const existingReplies = commentSnap.data().replies || [];
      
      const timestamp = Timestamp.now(); 
      const updatedReplies = [...existingReplies, { text, authorId, authorName, timestamp }];
      await updateDoc(commentRef, { replies: updatedReplies });
    } catch (error) {
      console.error('Error adding reply: ', error);
    }
  };

const getComments = async (postId) => {
  try {
    const commentsQuery = query(collection(db, 'posts', postId, 'comments'), orderBy('timestamp', 'asc'));
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting comments: ', error);
  }
};

export default function PostDetail({ route }) {
  const { post } = route.params;
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [comments, setComments] = useState([]);
  const [newInput, setNewInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [replying, setReplying] = useState(false);
  const [replyingAuthorName, setReplyingAuthorName] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  
  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getComments(post.id);
      setComments(comments);
    };

    fetchComments();
  }, [post.id]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const commentsRef = collection(db, 'posts', post.id, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        setCommentCount(commentsSnapshot.size); // Set het aantal comments voor de post
      } catch (error) {
        console.error('Error fetching comment count:', error);
      }
    };

    fetchCommentCount();
  }, [post.id]);

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
  
    const authorId = user.uid;
    const authorName = user.displayName;
  
    if (replyingTo) {
      await addReply(post.id, replyingTo, newInput, authorId, authorName);
      setReplyingTo(null);
    } else {
      await addComment(post.id, newInput, authorId, authorName);
    }
    
    setNewInput('');
    const updatedComments = await getComments(post.id);
    setComments(updatedComments);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'posts', post.id, 'comments', commentId));
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment: ', error);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const commentRef = doc(db, 'posts', post.id, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const existingReplies = commentSnap.data().replies || [];
      const updatedReplies = existingReplies.filter(reply => reply.timestamp !== replyId);
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

  // Pas toggleReply aan om de commentId en auteur naam door te geven
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

  // Functie om de URL van het product te openen in de standaardbrowser
  const openProductURL = (url) => {
    if (url && typeof url === 'string') {
      Linking.openURL(url)
        .then(() => console.log('URL geopend'))
        .catch((error) => console.error('Fout bij het openen van URL:', error));
    } else {
      console.error('Ongeldige URL:', url);
    }
  };

  const getTimeAgo = (timestamp) => {
    const currentDate = new Date();
    const commentDate = timestamp.toDate(); // Converteer Firestore timestamp naar een JavaScript Date-object
  
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

  const renderHeader = () => (
    <View>
        <View className="bg-white rounded-b-3xl shadow-sm">

        <ImageBackground source={require('./../assets/images/postcreate-bg.png')} resizeMode="cover" imageStyle= {{opacity:0.2}}>
        <View
        className="flex-row justify-between px-5 pt-14 pb-5">
                {/* Back button */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image className="w-5 h-5" 
                                    source={require('./../assets/icons/left-arrow.png')} />
                </TouchableOpacity>

                {/* Question or advise tag */}
                <View className="border border-dark-pink rounded-xl w-20 p-0.5">
                            <Text 
                            style={{ fontFamily: 'Montserrat_500Medium' }}
                            className="text-dark-pink text-center text-xs">
                                {post.postType}
                            </Text>
                </View>
        </View> 
        </ImageBackground>

        <View className="px-6 pt-3">


        <View className=" mt-2 flex-wrap">

         {/* Post info card */}
         <View className="flex-row justify-between">
                {/* Title */}
                <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 19 }}
                        className="pt-3 px-1 mb-3 w-80">
                       {post.title}
                </Text>

                {/* Save */}
                <TouchableOpacity>
                        <Image className="w-5 h-5 mt-3 ml-8" style={{ tintColor: "gray"}}
                                                source={require('./../assets/icons/save.png')} />
                </TouchableOpacity>
          </View>

            {/* Tags */}
            <View className="flex-row flex-wrap">
                {post.skinTypeTags.map((tag, index) => (
                    <TouchableOpacity 
                    key={index}
                    className="bg-light-blue border border-blue rounded-xl px-3 py-0.5 mx-1 mb-2">
                    <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold' }}
                        className="text-center text-blue text-xs">
                        {tag}
                    </Text>
                    </TouchableOpacity>
                ))}

                {post.skinConcernTags.map((tag, index) => (
                    <TouchableOpacity 
                    key={index}
                    className="bg-yellow border border-dark-yellow rounded-xl px-3 py-0.5 mx-1 mb-2">
                    <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold'}}
                        className="text-center text-dark-yellow text-xs">
                        {tag}
                    </Text>
                    </TouchableOpacity>
                ))}

                {post.skincareProductTags.map((tag, index) => (
                    <TouchableOpacity 
                    key={index}
                    className="bg-pinkie border border-pink rounded-xl px-3 py-0.5 mx-1 mb-2">
                    <Text 
                        style={{ fontFamily: 'Montserrat_600SemiBold' }}
                        className="text-center text-pink text-xs">
                        {tag}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
        </View>
        
        <View>
            {/* Description */}
            <Text 
                    style={{ fontFamily: 'Montserrat_500Medium' }}
                    className="pt-2 px-2 mb-3 w-100 text-md">
                    {post.description}
            </Text>
        </View>
        
        <View>
        {post.products.length > 0 && (
            post.products.map((product, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 3, borderRadius: 8, marginTop: 12, padding: 12 }}>
                {/* Product Image */}
                <Image style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} source={{ uri: product.productImage }} />
                {/* Product Details */}
                <View style={{ flex: 1 }}>
                {/* Product Name */}
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15, marginBottom: 4 }} numberOfLines={2} ellipsizeMode="tail">
                    {product.productName}
                </Text>
                {/* Brand Name */}
                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 15 }}>{product.brandName}</Text>
                </View>
                {/* Link Button */}
                <TouchableOpacity onPress={() => openProductURL(product.productURL)} style={{ backgroundColor: '#63254E', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 12, height: 12, tintColor: 'white', marginRight: 4 }} source={require('./../assets/icons/link.png')} />
                    <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12, color: 'white' }}>Link</Text>
                </View>
                </TouchableOpacity>
            </View>
            ))
        )}
        </View>


        <View className="flex-row mt-8 mb-8 justify-between">
            {/* Author + date */}
            <View className="flex-row">
                <View>
                    <Image className="w-6 h-6" 
                                            source={require('./../assets/images/user.png')} />
                </View>

                <View className="flex-row pt-1.5 mx-2">
                    <Text
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                        Jane Ipsum
                    </Text>

                    <Image className="w-1 h-1 mt-1 ml-3" style={{ tintColor: "#63254E"}}
                                            source={require('./../assets/images/user.png')} />

                    <Text 
                    className="ml-3"
                    style={{ fontFamily: 'Montserrat_300Light', fontSize: 12 }}>
                        1 day ago
                    </Text>
                </View>
            </View>

            {/* Likes + Comments */}
            <View className="flex-row mt-1">
                {/* Likes */}
                <View className="flex-row">
                    <Image className="w-5 h-5 " style={{ tintColor: "gray"}}
                                        source={require('./../assets/icons/like.png')} />
                    {/* <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15 }}
                    className="pl-2 mt-0.5">
                        100
                    </Text> */}
                </View>
            </View>
        </View>

        </View>
        </View>

        <View className="mt-8 mb-2 mx-5 flex-row">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="text-base">
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

                    {/* {reply.authorId === user.uid && (
                    <TouchableOpacity onPress={() => handleDeleteReply(item.id, reply.timestamp)}>
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                        className="text-red-500 underline mt-2">Delete</Text>
                    </TouchableOpacity>
                    )} */}

                    </View>
                </View>
            ))}
            </View>
          </View>
        )}
      />
      </LinearGradient>

<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-xl">

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
}