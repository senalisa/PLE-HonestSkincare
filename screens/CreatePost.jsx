import { View, TouchableOpacity, Modal, TextInput, FlatList, Text, ImageBackground, Image, ScrollView, Alert, Pressable, PixelRatio } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { query, where, getDocs, collection, addDoc } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import { Linking } from 'react-native';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { storage, storageRef } from './../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

export default function CreatePost() {
  const navigation = useNavigation();

    //Responsive font size
          const fontScale = PixelRatio.getFontScale();
          const getFontSize = size => size / fontScale;

  const [postType, setPostType] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkinTypeTags, setSelectedSkinTypeTags] = useState([]);
  const [selectedSkinConcernTags, setSelectedSkinConcernTags] = useState([]);
  const [selectedSkincareProductTags, setSelectedSkincareProductTags] = useState([]);
  const [selectedSustainabilityTags, setSelectedSustainabilityTags] = useState([]);
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState('');

  const [products, setProducts] = useState([]); 
  const [searchInput, setSearchInput] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalAlertVisible, setModalAlertVisible] = useState(false);

  //MULTI-STEP-PROGRESS
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  const [formData, setFormData] = useState({
    step1Data: '',
    step2Data: '',
    step3Data: '',
  });

  //Button to go to the next step
  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  //Button to go back to the previous step
  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  //Progress step indicator
  const renderStepIndicator = (currentStep) => {
    const indicators = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} className="flex-row items-center shadow-sm">
          <View
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              i <= step ? 'border-dark-pink bg-dark-pink w-7 h-7' : 'border-white bg-white'
            }`}
          >
            <Text className={`font-bold ${i <= step ? 'text-white' : 'text-gray-200'}`}>
              {i}
            </Text>
          </View>
          {i < totalSteps && (
            <View
              className={`h-0.5 flex-1 ${
                i < step ? 'bg-dark-pink' : 'bg-white'
              } mx-1`}
            />
          )}
        </View>
      );
    }
    return indicators;
  };

    // Dynamic titles of the steps
    const getStepText = (step) => {
      switch (step) {
        case 1:
          return "What is your post about?";
        case 2:
          return "Select tags about your post";
        case 3:
          return "Add a product or image";
        default:
          return "What is your post about?";
      }
    };

  //TAGS
  const [visibleSections, setVisibleSections] = useState({
    skinType: true,
    skinConcern: false,
    skincareProduct: false,
    sustainability: false, 
  });

  // Styles of the tags
  const tagStyles = {
    skinType: 'bg-light-blue border-1 border-blue',
    skinConcern: 'bg-yellow border-1 border-dark-yellow',
    skincareProduct: 'bg-light-pink border-1 border-dark-pink',
    sustainability: 'bg-green-50 border-1 border-green-600',
  };

  //Toggle section of tags
  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };  

  //Toggle function of the tags
  const toggleTag = (tag, type) => {
    switch (type) {
      case 'skinType':
        setSelectedSkinTypeTags(prevTags =>
          prevTags.includes(tag) ? prevTags.filter(item => item !== tag) : [...prevTags, tag]
        );
        break;
      case 'skinConcern':
        setSelectedSkinConcernTags(prevTags =>
          prevTags.includes(tag) ? prevTags.filter(item => item !== tag) : [...prevTags, tag]
        );
        break;
      case 'skincareProduct':
        setSelectedSkincareProductTags(prevTags =>
          prevTags.includes(tag) ? prevTags.filter(item => item !== tag) : [...prevTags, tag]
        );
        break;
      case 'sustainability':
        setSelectedSustainabilityTags(prevTags =>
          prevTags.includes(tag) ? prevTags.filter(item => item !== tag) : [...prevTags, tag]
        );
        break;

      default:
        break;
    }
  };

  //Render the tags
  const renderTags = (tags, type) => {
    return (
      <>
        {visibleSections[type] && ( // Controleer of de sectie zichtbaar is
          <View className="flex-row flex-wrap w-full">
            {tags.map(tag => (
              <Pressable
                key={tag}
                className={`border border-gray-100 px-5 py-1.5 rounded-full mr-2 mb-3 bg-white ${
                  selectedSkinTypeTags.includes(tag) ? tagStyles.skinType : ''
                } ${
                  selectedSkinConcernTags.includes(tag) ? tagStyles.skinConcern : ''
                } ${
                  selectedSkincareProductTags.includes(tag) ? tagStyles.skincareProduct : ''
                } ${
                  selectedSustainabilityTags.includes(tag) ? tagStyles.sustainability : ''
                }`}
                onPress={() => toggleTag(tag, type)}>
                <Text 
                  style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                  className={`text-center ${
                    selectedSkinTypeTags.includes(tag) ? 'text-blue' : 
                    selectedSkinConcernTags.includes(tag) ? 'text-dark-yellow' :
                    selectedSkincareProductTags.includes(tag) ? 'text-pink' :
                    selectedSustainabilityTags.includes(tag) ? 'text-green-600' : ''
                  }`}>
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </>
    );
  };

  //POST TYPE
   const handlePostTypeSelection = (type) => {
    setPostType(type);
  };

  //PRODUCTS
  //Fetch all products from database
  const fetchAllProducts = async () => {
    try {
      // Maak een query om alle items uit de database te halen
      const querySnapshot = await getDocs(collection(db, 'productLink'));
  
      // Maak een array om alle producten op te slaan
      const allProducts = [];
  
      // Loop door alle items en voeg ze toe aan de array
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allProducts.push(data);
      });
  
      // Log alle producten naar de console
      // console.log('All products:', allProducts);
  
      return allProducts;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  };
  
  // Call the function to get all products
  fetchAllProducts();
  
  //Search products
  const searchProducts = async (searchTerm) => {
    try {
      // Maak een query om alle producten te halen
      const allProducts = await fetchAllProducts();
  
      // Filter de producten op basis van de zoekterm
      const searchResults = allProducts.filter(product => {
        // Controleer of de productnaam de zoekterm bevat (case-insensitive)
        return product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName.toLowerCase().includes(searchTerm.toLowerCase());
      });
  
      // Bijwerken van de searchResults-state met de gevonden resultaten
      setSearchResults(searchResults);
  
      // Retourneer de zoekresultaten
      return searchResults;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };
  
  // Function to add a product to the list of selected products
  const addProductToList = (product) => {
    setModalVisible(false);
    setProducts(prevProducts => {
      console.log('Product toegevoegd:', product);
      return [...prevProducts, product]; // Voeg het productobject toe aan de lijst met geselecteerde producten
    });
  };

  // Function to delete a product out of the list with selected products
  const removeProductFromList = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1); // Verwijder het product op de opgegeven index
    setProducts(updatedProducts); // Werk de lijst met geselecteerde producten bij
  };

  // Function to open the URL of a product in the browser
  const openProductURL = (url) => {
    if (url && typeof url === 'string') {
      Linking.openURL(url)
        .then(() => console.log('URL geopend'))
        .catch((error) => console.error('Fout bij het openen van URL:', error));
    } else {
      console.error('Ongeldige URL:', url);
    }
  };

  //IMAGES
  const [images, setImages] = useState([]);

  //Function to pick the images from the phone
  const pickImages = async () => {
    console.log('Opening image picker...');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Please give us permission to see your gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImages(selectedImages);
      console.log('Selected images URIs:', selectedImages);
    }
  };

  //Function to upload the chosen image to Firebase storage
  const uploadImages = async (images) => {
    try {
      if (images.length === 0) {
        console.log('Geen afbeeldingen geselecteerd.');
        return [];
      }
  
      const downloadURLs = await Promise.all(images.map(async (imageUri) => {
        try {
          const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
          const fileRef = ref(storageRef, `images/${filename}`);
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const snapshot = await uploadBytes(fileRef, blob);
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL;
        } catch (error) {
          console.error('Fout bij het uploaden van een afbeelding:', error);
          throw error;
        }
      }));
  
      return downloadURLs;
    } catch (error) {
      console.error('Fout bij het uploaden van afbeeldingen:', error);
      throw error;
    }
  };

// Check if the post contains links
const containsLink = (text) => {
  const urlPattern = /(?:https?|ftp):\/\/[\n\S]+|www\.[\S]+/ig;
  return urlPattern.test(text);
};

//AUTH
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      setUserId(user.uid);
      setDisplayName(user.displayName); 
    } else {
      setUserId(null);
      setDisplayName(''); 
    }
  });

  return () => unsubscribe();
}, []);

//SAVE THE POST
const handleSavePost = async () => {
  try {
    if (!userId || !postType || !title || !description ) {
      Alert.alert(
        'Could not publish post',
        'Please fill in all required fields.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (containsLink(title) || containsLink(description)) {
      setModalAlertVisible(true);
      return;
    }

    const imageUrls = await uploadImages(images);

    const postsCollectionRef = collection(db, 'posts');

    const newPostRef = await addDoc(postsCollectionRef, {
      userId: userId,
      displayName: displayName,  
      postType: postType,
      title: title,
      description: description,
      skinTypeTags: selectedSkinTypeTags,
      skinConcernTags: selectedSkinConcernTags,
      skincareProductTags: selectedSkincareProductTags,
      sustainabilityTags: selectedSustainabilityTags,
      products: products,
      imageUrls: imageUrls,
    });

    const newPostData = {
      userId: userId,
      displayName: displayName,  
      postType: postType,
      title: title,
      description: description,
      skinTypeTags: selectedSkinTypeTags,
      skinConcernTags: selectedSkinConcernTags,
      skincareProductTags: selectedSkincareProductTags,
      sustainabilityTags: selectedSustainabilityTags,
      products: products,
      imageUrls: imageUrls,
    };

    setTitle('');
    setDescription('');
    setSelectedSkinTypeTags([]);
    setSelectedSkinConcernTags([]);
    setSelectedSkincareProductTags([]);
    setSelectedSustainabilityTags([]);
    setProducts([]);
    setImages([]);

    navigation.navigate('PostCreated', { post: newPostData });
  } catch (error) {
    console.error('Error saving post:', error);
    Alert.alert('Error', 'Er is een fout opgetreden bij het opslaan van de post.');
  }
};


  return (
    <ScrollView className="h-full bg-white">
    <View className="flex-1 h-min-screen">

      {/* Background Image */}
      <ImageBackground source={require('./../assets/images/bg3.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

      {/* Fixed top bar */}
      <View className="pt-12 pb-10">
  
        {/* Title */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
        className="text-center mt-8 shadow-md">Create a post</Text>

        {/* Title of the step */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(20) }}
        className="text-center mt-1 color-dark-pink shadow-md">{getStepText(step)}</Text>

        {/* Progress Bar */}
        <View className="flex-row items-center justify-center my-5 w-20 mx-auto">
          {renderStepIndicator(step)}
        </View>

      </View>

      </ImageBackground>

      {/* Step 1 */}
       {step === 1 && (
          <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8 h-screen">

            {/* Next Button */}
              <View className="flex justify-center items-end -mt-2 -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-1 bg-dark-pink rounded-full w-16">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Next
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Post Type */}
                <View className="mb-6">
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                  className="font-bold mb-2">Post Type</Text>

                  <View className="flex-row">
                    <TouchableOpacity
                      className={`mt-2 py-2 px-5 rounded-full shadow-sm mr-5 ${postType === 'Question' ? 'bg-dark-pink' : 'bg-white'}`}
                      onPress={() => handlePostTypeSelection('Question')}>

                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14) }}
                      className={`${postType === 'Question' ? 'text-white' : 'text-black'}`}>Question</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`mt-2 py-2 px-5 rounded-full shadow-sm ${postType === 'Advice' ? 'bg-dark-pink' : 'bg-white'}`}
                      onPress={() => handlePostTypeSelection('Advice')}>

                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14)}}
                      className={`${postType === 'Advice' ? 'text-white' : 'text-black'}`}>Advice</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              {/* Post Title */}
                <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                  className= "mb-3">Title</Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
                </View>

              {/* Post Description */}
              <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                className="mb-3">Description</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl shadow-sm py-3 px-6 h-48 bg-white"
                  placeholder="Enter Description"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                  style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                />
              </View>
          </View>
        )}

      {/* Step 2 */}
      {step === 2 && (
            <View className="flex-1 bg-white rounded-t-3xl shadow-xl -mt-8 h-screen">
              {/* Back Button */}
              <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7 px-8 pt-8">
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-16 ">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="text-center text-gray-400">
                    Back
                  </Text>
                </TouchableOpacity>

                {/* Next button */}
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-1 bg-dark-pink rounded-full w-16">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="text-center text-white">
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
              
            {/* Tags */}
            <View>
              {/* Tags for skin type */}
              <TouchableOpacity onPress={() => toggleSection('skinType')} className="flex-row justify-between items-center mx-8">
                <View className="flex-row mb-5">
                    <Image className="w-8 h-10" source={require('../assets/images/oily-skintype.png')} />

                    <View className="ml-3 mt-1">
                      <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Choose a tag for the</Text>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Skin Type</Text>
                    </View>
                </View>
            
                <Image className="-mt-4"
                  source={visibleSections.skinType ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(['Oily', 'Dry', 'Normal', 'Combination'], 'skinType')}
              </View>

              {/* Line */}
              <View className="border-b border-gray-100 mt-5" />
  
              {/* Tags for skin concern */}
              <TouchableOpacity onPress={() => toggleSection('skinConcern')} className="flex-row justify-between items-center my-5 mx-8">
                <View className="flex-row mb-1">
                    <Image className="w-8 h-10" source={require('../assets/images/acne.png')} />

                    <View className="ml-3 mt-1">
                     <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Choose a tag for the</Text>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Skin Concern</Text>
                    </View>
                </View>
                
                <Image
                  source={visibleSections.skinConcern ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(['Redness', 'Hyperpigmentation', 'Acne', 'Wrinkles', 'Rosacea', 'Pores', 'Blackheads', 'Eyebags', 'Whiteheads', 'Dryness', 'Eczema'], 'skinConcern')}
              </View>

              {/* Line */}
              <View className="border-b border-gray-100 mt-5" />
  
              {/* Tags for skincare product */}
              <TouchableOpacity onPress={() => toggleSection('skincareProduct')} className="flex-row justify-between items-center my-5 mx-8">
                <View className="flex-row mb-1">
                    <Image className="w-6 h-9" source={require('../assets/images/serum-2.png')} />

                    <View className="ml-3 mt-1">
                      <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Choose a tag for the</Text>

                     <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Skincare Product</Text>
                    </View>
                </View>

                <Image
                  source={visibleSections.skincareProduct ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Eye cream', 'Lip balm',], 'skincareProduct')}
              </View>

              {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Tags for sustainability */}
              <TouchableOpacity onPress={() => toggleSection('sustainability')} className="flex-row justify-between items-center my-5 mx-8">
                <View className="flex-row mb-1">
                  <Image className="w-9 h-9" source={require('../assets/images/eco.png')} />

                  <View className="ml-3 mt-1">
                    <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Choose a tag for</Text>
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Sustainability</Text>
                  </View>
                </View>

                <Image
                  source={visibleSections.sustainability ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(['Vegan', 'Cruelty-Free', 'Plastic-Free', 'Refillable', 'Recyclable'], 'sustainability')}
              </View>

            </View>
  
          </View>
      )}

      {/* Step 3 */}
      {step === 3 && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8 pb-24">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-16 ">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="text-center text-gray-400">
                    Back
                  </Text>
                </TouchableOpacity>

                {/* Next Button */}
                <TouchableOpacity 
                  onPress={handleSavePost} 
                  className="py-1 bg-dark-pink rounded-full w-16">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="text-center text-white">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Products */}
              <View className="flex-row justify-between mb-3">

                <View className="flex">
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mb-1">Products</Text>

                  <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="text-gray-400">Optional</Text>
                </View>

                {/* Button to open the Modal of products */}
                <TouchableOpacity onPress={() => setModalVisible(true)} className="border border-gray-200 py-0 px-5 rounded-full bg-white flex-row shadow-sm justify-center items-center">
                  <Image className="w-2 h-2 mr-1 mt-1" 
                                              source={require('./../assets/icons/plus.png')} />
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(12) }}
                  className="text-center mt-1"
                  >Add a product</Text>
                </TouchableOpacity>

              </View>


            {/* List of selected products */}
            <View>
              {products.map((product, index) => (
                <View key={index} className="align-center my-2">
                  <View className="flex-row border border-gray-100 rounded-md px-3 py-2 items-center bg-white shadow-sm">
                   <Image className="w-12 h-12"
                                source={{ uri: product.productImage }} />

                      <View className="flex pl-3">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}}
                        className="text-black pr-12 mr-12">{product.productName}</Text>

                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                        className="text-black pt-0.5 text-dark-pink">{product.brandName}</Text>
                      </View>
                  </View>

                  <View className="flex-row justify-between mt-2">
                    <TouchableOpacity onPress={() => openProductURL(product.productURL)}>
                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                      className="color-dark-pink">URL to product</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeProductFromList(index)}>
                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                      className="color-black">Delete Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Modal to search add products */}
            <Modal
              animationType="slide"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center mb-20 mt-20">

                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(18) }}
                className="mb-5">Add a product</Text>

                {/* Textinput with search */}
                <View className="flex-row mx-14 px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 text-l font-medium mb-1 shadow-sm">
                  <Image className="w-5 h-5 mr-3" style={{ tintColor: "#CBCACA"}}
                                          source={require('./../assets/icons/search.png')} />
                  <TextInput
                      placeholder="Search for a product"
                      placeholderTextColor="#A0AEC0"
                      className="w-full"
                      value={searchInput}
                      onChangeText={(text) => {
                        setSearchInput(text);
                        searchProducts(text); 
                      }}
                  />
                </View>

                {/* List of search results */}
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.productName}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addProductToList(item)} 
                    className="px-3 py-3 border border-gray-200 rounded-xl my-2 w-[350] flex-row items-center">

                      <Image className="rounded-md w-12 h-12"
                                source={{ uri: item.productImage }} />

                      <View className="flex pl-3">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}
                        className="text-black pr-12">{item.productName}</Text>
                        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(12) }}
                        className="text-black pt-1 text-dark-pink">{item.brandName}</Text>
                      </View>

                    </TouchableOpacity>
                  )}
                />

                {/* Button to close modal */}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="font-bold text-base">Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            <View className="border-b border-gray-100 mt-5" />

            {/* Images */}
            <View className="mb-10 mt-8">

            <View className="flex-row justify-between mb-3">

              <View className="flex">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                    className="mb-1">Image(s)</Text>

                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                    className="text-gray-400">Optional</Text>
              </View>

              {/* Button to open phone gallery and add one or multiple images */}
              <TouchableOpacity onPress={pickImages} className="border border-gray-200 py-2 px-5 rounded-full bg-white flex-row shadow-sm justify-center items-center">
                <Image className="w-2 h-2 mr-1 mt-1" 
                                            source={require('./../assets/icons/plus.png')} />
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(12) }}
                className="text-center mt-1"
                >Add Image(s)</Text>
              </TouchableOpacity>

            </View>

              {/* Swiper for the selected Images */}
              <Swiper
                      style={{ height: 300 }}
                      showsButtons={false}
                      paginationStyle={{ bottom: -23 }}
                      dotStyle={{ borderRadius: 100, width: 10, height: 10, backgroundColor: 'grey' }}
                      activeDotStyle={{ borderRadius: 100, width: 10, height: 10, backgroundColor: '#63254E' }}
                      className="mt-5"
                    >
                      {images.map((uri, index) => (
                        <View key={index}>
                          <Image
                            source={{ uri }}
                            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                          />
                        </View>
                      ))}
              </Swiper>
            </View>

          </View>
        )}

      {/* Modal for Alert */}
      <Modal
              animationType="fade"
              transparent={true}
              visible={modalAlertVisible}
              onRequestClose={() => {
                setModalVisible(!modalAlertVisible);
              }}
            >
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                className="flex-1 justify-center align-center">
                <View className="bg-white p-7 mx-20 rounded-md">
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                    className="text-center text-lg mb-4">Link Policy</Text>
                  
                  <Text style={{ fontFamily: 'Montserrat_400Regular'}}
                    className="text-center text-base">The posting of links is not allowed to ensure the safety and integrity of our community. For more info read</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CGlong')}>
                      <Text className="text-center mb-7 underline text-dark-pink text-base" style={{ fontFamily: 'Montserrat_400Regular' }}>the Community Guidelines.</Text>
                    </TouchableOpacity>

                  <TouchableOpacity onPress={() => setModalAlertVisible(!modalAlertVisible)} className="bg-dark-pink py-1.5 mx-12 rounded-full"> 
                    <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                      className="text-white text-center text-base">I got it!</Text>
                  </TouchableOpacity>
                </View>
              </View>
      </Modal>

  </View>
  </ScrollView>
  )
}