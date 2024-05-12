import { View, TouchableOpacity, Modal, TextInput, FlatList, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { query, where, getDocs, collection, addDoc } from 'firebase/firestore';
import { db, auth } from './../config/firebase';
import { Linking } from 'react-native';

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

  const handleSavePost = async () => {
    try {
      // Controleer of alle vereiste velden zijn ingevuld
      if (!userId || !postType || !title || !description) {
        console.error('Please fill in all required fields');
        return;
      }
  
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
        // Voeg eventueel andere velden toe die je wilt opslaan
      });
  
      console.log('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

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
      <View className="flex-row flex-wrap">
        {tags.map(tag => (
        <TouchableOpacity
          key={tag}
          className={`border-2 border-white px-5 py-2 rounded-full mr-2 mb-2 bg-white ${selectedSkinTypeTags.includes(tag) ? tagStyles.skinType : ''} ${selectedSkinConcernTags.includes(tag) ? tagStyles.skinConcern : ''} ${selectedSkincareProductTags.includes(tag) ? tagStyles.skincareProduct : ''}`}
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
  

  return (
    <View className="flex-1 mt-12 mb-20">
    <ProgressSteps>

        <ProgressStep label="First Step" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
          <View className="flex-1 p-4">
              {/* Type */}
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-2">Step 1: Post Type</Text>
                  <TouchableOpacity
                    className={`py-2 px-4 rounded ${postType === 'Question' ? 'bg-blue-200' : 'bg-gray-200'}`}
                    onPress={() => handlePostTypeSelection('Question')}>
                    <Text>Question</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`py-2 px-4 rounded ${postType === 'Advise' ? 'bg-blue-200' : 'bg-gray-200'}`}
                    onPress={() => handlePostTypeSelection('Advise')}>
                    <Text>Advise</Text>
                  </TouchableOpacity>
                </View>

              {/* Title */}
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-2">Step 2: Title</Text>
                  <TextInput
                    className="border border-gray-300 rounded p-2"
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Step 3: Description</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2 h-24"
                  placeholder="Enter Description"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
          </View>
        </ProgressStep>

        <ProgressStep label="Second Step">
          <View className="p-4">
              <Text className="text-lg font-bold mb-2">Step 2: Skin Type Tags</Text>
              {renderTags(['Oily', 'Dry', 'Normal', 'Combination'], 'skinType')}
              <Text className="text-lg font-bold my-2">Step 3: Skin Concern Tags</Text>
              {renderTags(
                ['Redness', 'Hyperpigmentation', 'Acne', 'Wrinkles', 'Rosacea', 'Pores', 'Blackheads', '+ more'],
                'skinConcern'
              )}
              <Text className="text-lg font-bold my-2">Step 4: Skincare Product Tags</Text>
              {renderTags(
                ['Cleanser', 'Moisturizer', 'Lip Balm', 'Serum', 'Sunscreen', 'Exfoliant', 'Toner', 'Mask', 'Oil', '+ more'],
                'skincareProduct'
              )}
          </View>
        </ProgressStep>

        <ProgressStep label="Third Step" onSubmit={handleSavePost}>
          <View className="flex-1 mx-5">
            {/* Knop om de modal te openen */}
            <TouchableOpacity onPress={() => setModalVisible(true)} className="mb-5">
              <Text>Voeg Product Toe</Text>
            </TouchableOpacity>

            {/* Lijst met geselecteerde producten */}
            <View>
              {products.map((product, index) => (
                <View key={index} className="flex-row align-center w-80 border border-gray-200 px-3 py-2">
                  <View>
                    <Text>{product.productName}</Text>
                    <Text>{product.brandName}</Text>
                  </View>

                  <TouchableOpacity onPress={() => openProductURL(product.productURL)}>
                    <Text style={{ color: 'blue', marginLeft: 10 }}>URL naar product</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => removeProductFromList(index)}>
                    <Text style={{ color: 'red', marginLeft: 10 }}>Verwijderen</Text>
                  </TouchableOpacity>
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
                {/* Invoerveld voor het zoeken naar producten */}
                <TextInput
                  placeholder="Zoek naar een product"
                  className="w-60 py-2 px-3 rounded-xl border border-black"
                  value={searchInput}
                  onChangeText={(text) => {
                    setSearchInput(text);
                    searchProducts(text); // Zoek producten terwijl de gebruiker typt
                  }}
                />

                {/* Lijst met zoekresultaten */}
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.productName}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addProductToList(item)} 
                    className="px-10 py-2 border border-gray-200 rounded-xl my-2">
                      <Text className="text-black">{item.productName}</Text>
                      <Text className="text-black">{item.brandName}</Text>
                    </TouchableOpacity>
                  )}
                />

                {/* Knop om de modal te sluiten */}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text>Sluiten</Text>
                </TouchableOpacity>
              </View>
            </Modal>

          </View>
        </ProgressStep>

    </ProgressSteps>
  </View>
  )
}