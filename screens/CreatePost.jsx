import { View, TouchableOpacity, Modal, TextInput, FlatList, Text, ImageBackground, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { query, where, getDocs, collection, addDoc } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import { Linking } from 'react-native';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { storage, storageRef } from './../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import Swiper from 'react-native-swiper';

export default function CreatePost() {

  const [postType, setPostType] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkinTypeTags, setSelectedSkinTypeTags] = useState([]);
  const [selectedSkinConcernTags, setSelectedSkinConcernTags] = useState([]);
  const [selectedSkincareProductTags, setSelectedSkincareProductTags] = useState([]);
  const [userId, setUserId] = useState(null);

  const [products, setProducts] = useState([]); // Array om de geselecteerde producten bij te houden
  const [searchInput, setSearchInput] = useState(''); // Invoerveld om te zoeken naar producten
  const [searchResults, setSearchResults] = useState([]); // Array om zoekresultaten weer te geven
  const [modalVisible, setModalVisible] = useState(false); // State om de zichtbaarheid van de modal aan te passen

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    step1Data: '',
    step2Data: '',
    step3Data: '',
  });

  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const totalSteps = 3;

  const progress = (step / totalSteps) * 100;

  const renderStepIndicator = (currentStep) => {
    const indicators = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} className="flex-row items-center shadow-sm">
          <View
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              i <= step ? 'border-dark-pink bg-dark-pink w-8 h-8' : 'border-white bg-white'
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

  const [visibleSections, setVisibleSections] = useState({
    skinType: true,
    skinConcern: false,
    skincareProduct: false,
  });

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePostTypeSelection = (type) => {
    setPostType(type);
  };

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
      default:
        break;
    }
  };
  const renderTags = (tags, type) => {
    return (
      <>
        {visibleSections[type] && ( // Controleer of de sectie zichtbaar is
          <View className="flex-row flex-wrap">
            {tags.map(tag => (
              <TouchableOpacity
                key={tag}
                className={`border border-gray-100 px-5 py-1.5 rounded-full mr-2 mb-2 bg-white ${
                  selectedSkinTypeTags.includes(tag) ? tagStyles.skinType : ''
                } ${
                  selectedSkinConcernTags.includes(tag) ? tagStyles.skinConcern : ''
                } ${
                  selectedSkincareProductTags.includes(tag) ? tagStyles.skincareProduct : ''
                }`}
                onPress={() => toggleTag(tag, type)}>
                <Text 
                  style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                  className={`text-center ${
                    selectedSkinTypeTags.includes(tag) ? 'text-blue' : 
                    selectedSkinConcernTags.includes(tag) ? 'text-dark-yellow' :
                    selectedSkincareProductTags.includes(tag) ? 'text-pink' : ''
                  }`}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </>
    );
  };

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
  
  // Roep de functie aan om alle producten op te halen
  fetchAllProducts();
  

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
  
  // Functie om een product toe te voegen aan de lijst met geselecteerde producten
  const addProductToList = (product) => {
    setModalVisible(false);
    setProducts(prevProducts => {
      console.log('Product toegevoegd:', product);
      return [...prevProducts, product]; // Voeg het productobject toe aan de lijst met geselecteerde producten
    });
  };

  // Functie om een product uit de lijst met geselecteerde producten te verwijderen
  const removeProductFromList = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1); // Verwijder het product op de opgegeven index
    setProducts(updatedProducts); // Werk de lijst met geselecteerde producten bij
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

  const buttonTextStyle = {
    color: '#393939',
    marginTop: '-30px'
  };

  const tagStyles = {
    skinType: 'bg-light-blue border-2 border-blue',
    skinConcern: 'bg-yellow border-2 border-dark-yellow',
    skincareProduct: 'bg-pinkie border-2 border-pink',
  };

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

  const [images, setImages] = useState([]);

  const pickImages = async () => {
    console.log('Opening image picker...');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we hebben toestemming nodig om dit te doen!');
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

  const uploadImages = async (images) => {
    try {
      // Controleer of er afbeeldingen zijn geselecteerd
      if (images.length === 0) {
        console.log('Geen afbeeldingen geselecteerd.');
        return [];
      }
  
      // Upload elke afbeelding en verzamel de download-URL's
      const downloadURLs = await Promise.all(images.map(async (imageUri) => {
        try {
          // Haal de bestandsnaam op uit de URI
          const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
          // Maak een verwijzing naar het specifieke bestand
          const fileRef = ref(storageRef, `images/${filename}`);
          // Haal de blob op van de afbeelding
          const response = await fetch(imageUri);
          const blob = await response.blob();
          // Upload het bestand naar Firebase Storage
          const snapshot = await uploadBytes(fileRef, blob);
          // Verkrijg de download-URL van het geüploade bestand
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL;
        } catch (error) {
          console.error('Fout bij het uploaden van een afbeelding:', error);
          throw error;
        }
      }));
  
      // Geef de array met download-URL's terug
      return downloadURLs;
    } catch (error) {
      // Als er een fout optreedt, log de fout en gooi een foutmelding
      console.error('Fout bij het uploaden van afbeeldingen:', error);
      throw error;
    }
  };

  const handleSavePost = async () => {
    try {
      // Controleer of alle vereiste velden zijn ingevuld
      if (!userId || !postType || !title || !description) {
        console.error('Please fill in all required fields');
        return;
      }

      // Upload de afbeeldingen en verkrijg de download-URL's
      const imageUrls = await uploadImages(images);

      // Maak een referentie naar een nieuwe post binnen de 'posts' collectie
      const postsCollectionRef = collection(db, 'posts');

      // Voeg een nieuw document toe aan de collectie met een willekeurige document-ID
      const newPostRef = await addDoc(postsCollectionRef, {
        userId: userId,
        postType: postType,
        title: title,
        description: description,
        skinTypeTags: selectedSkinTypeTags,
        skinConcernTags: selectedSkinConcernTags,
        skincareProductTags: selectedSkincareProductTags,
        products: products,
        imageUrls: imageUrls, // Voeg de URL's van de geüploade afbeeldingen toe aan het document
        // Voeg eventueel andere velden toe die je wilt opslaan
      });

      console.log('Post saved successfully!');
      Alert.alert('Post saved!', 'De post is succesvol opgeslagen.');
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Error', 'Er is een fout opgetreden bij het opslaan van de post.');
    }
  };

  return (
    <ScrollView className="h-full bg-white">
    <View className="flex-1 h-min-screen">

      <ImageBackground source={require('./../assets/images/bg3.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>
      <View className="pt-12 pb-10">
     

        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 18 }}
        className="text-center mt-8 shadow-md">Create a post</Text>

        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }}
        className="text-center mt-1 color-dark-pink shadow-md">{getStepText(step)}</Text>

        {/* Progress Bar */}
        <View className="flex-row items-center justify-center my-5 w-20 mx-auto">
          {renderStepIndicator(step)}
        </View>

       
      </View>
      </ImageBackground>

       {step === 1 && (
          <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8 h-screen">
              {/* Type */}
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-2">Post Type</Text>

                  <View className="flex-row">
                    <TouchableOpacity
                      className={`py-3 px-7 rounded-full shadow-sm mr-5 ${postType === 'Question' ? 'bg-dark-pink' : 'bg-white'}`}
                      onPress={() => handlePostTypeSelection('Question')}>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }}
                      className={` ${postType === 'Question' ? 'text-white' : 'text-black'}`}>Question</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`py-3 px-10 rounded-full shadow-sm ${postType === 'Advise' ? 'bg-dark-pink' : 'bg-white'}`}
                      onPress={() => handlePostTypeSelection('Advise')}>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }}
                      className={` ${postType === 'Advise' ? 'text-white' : 'text-black'}`}>Advise</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              {/* Title */}
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-2">Title</Text>
                  <TextInput
                    className="border border-gray-300 rounded p-3 shadow-md"
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Description</Text>
                <TextInput
                  className="border border-gray-300 rounded p-3 h-48"
                  placeholder="Enter Description"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Next Button */}
              <View className="flex justify-center items-center">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2.5 bg-dark-pink rounded-full mt-10 w-60 shadow-md">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }} 
                    className="text-xl font-bold text-center text-white">
                    Next
                  </Text>
                </TouchableOpacity>
              </View>

          </View>
        )}

      {step === 2 && (
            <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8 h-screen">
            <View>
              <TouchableOpacity onPress={() => toggleSection('skinType')} className="flex-row justify-between items-center">
                <Text className="text-lg font-bold mb-5">Skin Type Tags</Text>
                <Image className="-mt-4"
                  source={visibleSections.skinType ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} // Pas de grootte van het icoontje aan zoals nodig
                />
              </TouchableOpacity>
              {renderTags(['Oily', 'Dry', 'Normal', 'Combination'], 'skinType')}

              <View className="border-b border-gray-100 mt-5" />
  
              <TouchableOpacity onPress={() => toggleSection('skinConcern')} className="flex-row justify-between items-center my-5">
                <Text className="text-lg font-bold">Skin Concern Tags</Text>
                <Image
                  source={visibleSections.skinConcern ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} // Pas de grootte van het icoontje aan zoals nodig
                />
              </TouchableOpacity>
              {renderTags(['Redness', 'Hyperpigmentation', 'Acne', 'Wrinkles', 'Rosacea', 'Pores', 'Blackheads'], 'skinConcern')}

              <View className="border-b border-gray-100 mt-5" />
  
              <TouchableOpacity onPress={() => toggleSection('skincareProduct')} className="flex-row justify-between items-center my-5">
                <Text className="text-lg font-bold">Skincare Product Tags</Text>
                <Image
                  source={visibleSections.skincareProduct ? require('../assets/icons/up2.png') : require('../assets/icons/down2.png')}
                  style={{ width: 13, height: 13 }} // Pas de grootte van het icoontje aan zoals nodig
                />
              </TouchableOpacity>
              {renderTags(['Cleanser', 'Moisturizer', 'Essence', 'Serum', 'Sunscreen', 'Exfoliant', 'Toner', 'Mask', 'Lip care',], 'skincareProduct')}
            </View>
  
            <TouchableOpacity onPress={handleNext} className="mt-8 py-2.5 bg-dark-pink rounded-full mb-5 w-60 flex mx-auto shadow-md">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }} className="text-xl font-bold text-center text-white">
                Next
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={handlePrevious} className="mx-auto shadow-md">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }} className="pt-0 color-gray-500">
                Go back
              </Text>
            </TouchableOpacity>
          </View>
      )}

      {step === 3 && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">
            <Text className="text-lg font-bold mb-5">Products</Text>

            {/* Knop om de modal te openen */}
            <TouchableOpacity onPress={() => setModalVisible(true)} className="mb-5 border border-gray-200 py-2 px-5 rounded-xl flex-row shadow-sm">
              <Image className="w-3 h-3 mr-3 mt-0.5" 
                                          source={require('./../assets/icons/plus.png')} />
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
              className=""
              >Add a product</Text>
            </TouchableOpacity>

            {/* Lijst met geselecteerde producten */}
            <View>
              {products.map((product, index) => (
                <View key={index} className="align-center my-2">
                  <View className="flex-row border border-gray-100 rounded-md px-3 py-2 items-center">
                   <Image className="w-12 h-12"
                                source={{ uri: product.productImage }} />

                      <View className="flex pl-3">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
                        className="text-black pr-12 mr-12">{product.productName}</Text>

                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }}
                        className="text-black pt-1 text-dark-pink">{product.brandName}</Text>
                      </View>
                  </View>

                  <View className="flex-row justify-between mt-2">
                    <TouchableOpacity onPress={() => openProductURL(product.productURL)}>
                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                      className="color-dark-pink">URL to product</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeProductFromList(index)}>
                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 13 }}
                      className="color-red-800">Delete Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Modal voor het toevoegen van producten */}
            <Modal
              animationType="slide"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center mb-20 mt-20">

                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 22 }}
                className="mb-5">Add a product</Text>

                {/* Invoerveld voor het zoeken naar producten */}
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

                {/* Lijst met zoekresultaten */}
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.productName}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addProductToList(item)} 
                    className="px-3 py-3 border border-gray-200 rounded-xl my-2 w-80 flex-row items-center">

                      <Image className="rounded-md w-12 h-12"
                                source={{ uri: item.productImage }} />

                      <View className="flex pl-3">
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
                        className="text-black pr-12">{item.productName}</Text>
                        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }}
                        className="text-black pt-1 text-dark-pink">{item.brandName}</Text>
                      </View>

                    </TouchableOpacity>
                  )}
                />

                {/* Knop om de modal te sluiten */}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text>Sluiten</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {/* Image */}
            <Text className="text-lg font-bold mb-5 mt-10">Image</Text>

            <View className="mb-10">

              <TouchableOpacity
                onPress={pickImages}
                className="mb-5 border border-gray-200 py-2 px-5 rounded-xl flex-row shadow-sm"
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 16 }}
              className=""
                >Add image(s)</Text>
              </TouchableOpacity>

              <Swiper
                      style={{ height: 300 }}
                      showsButtons={false}
                      paginationStyle={{ bottom: -23 }}
                      dotStyle={{ borderRadius: 100, width: 10, height: 10, backgroundColor: 'grey' }}
                      activeDotStyle={{ borderRadius: 100, width: 10, height: 10, backgroundColor: '#63254E' }}
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

            <View className="pb-20">

            <TouchableOpacity onPress={handleSavePost} className="mt-8 py-2.5 bg-dark-pink rounded-full mb-3 w-60 flex mx-auto shadow-md">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
              className="text-xl font-bold text-center text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePrevious} className="mx-auto shadow-md">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 17 }}
                className="pt-5 color-gray-500">Go back</Text>
            </TouchableOpacity>

            </View>

          </View>
        )}

  </View>
  </ScrollView>
  )
}