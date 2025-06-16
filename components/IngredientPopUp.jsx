import React from 'react';
import { Modal, Pressable, View, Text, PixelRatio} from 'react-native';

export default function IngredientPopUp({ visible, onClose, ingredient, onNavigate }) {
  if (!ingredient) return null;

   //Responsive font size
        const fontScale = PixelRatio.getFontScale();
        const getFontSize = size => size / fontScale;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Outer pressable: detecteert klik buiten de modal */}
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={onClose}
      >
        {/* Inner pressable: stopt klik zodat modal niet sluit */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl px-8 py-10 w-11/12 max-w-xl shadow-lg"
        >

          {/* Titel */}
          <Text className="font-bold text-gray-900 text-center mb-2" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(20) }}>
            {ingredient.name}
          </Text>

          {/* Beschrijving */}
          <Text className="leading-5 text-center" style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14) }}>
            {ingredient.description}
          </Text>

        {/* Skin Type */}
          <Text className="mt-6 mb-2 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>
            Skin Types
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {ingredient.skinTypes?.map((type, index) => {
              return (
                <View
                  className="border border-blue bg-light-blue px-4 py-1 rounded-full mr-2 mb-2"
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat_600SemiBold',
                      fontSize: getFontSize(11),
                    }}
                    className="text-blue"
                  >
                    {type}
                  </Text>
                </View>
              );
            }) || (
              <Text className="text-gray-700" style={{ fontFamily: 'Montserrat_500Medium',  }}>
                None
              </Text>
            )}
          </View>

          {/* Skin Concerns */}
           <Text className="mt-5 mb-2 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }}>
            Skin Concerns
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {ingredient.skinConcerns?.map((concern, index) => {
              return (
                <View
                  className="border border-dark-yellow bg-yellow px-4 py-1 rounded-full mr-2 mb-2"
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat_600SemiBold',
                      fontSize: getFontSize(11),
                    }}
                    className="text-dark-yellow"
                  >
                    {concern}
                  </Text>
                </View>
              );
            }) || (
              <Text className="text-sm text-gray-700" style={{ fontFamily: 'Montserrat_500Medium' }}>
                None
              </Text>
            )}
          </View>


          {/* Knoppen */}
          <View className="flex-row justify-center space-x-3">
            {/* <Pressable
              onPress={onClose}
              className="py-2 px-4 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-600" style={{ fontFamily: 'Montserrat_500Medium' }}>
                Close
              </Text>
            </Pressable> */}

            <Pressable
              onPress={() => {
                onClose();
                onNavigate(ingredient.name, ingredient.id);
              }}
              className="py-3 px-10 rounded-full bg-dark-pink mt-6"
            >
              <Text className="text-white" style={{ fontFamily: 'Montserrat_600SemiBold',  fontSize: getFontSize(13), }}>
                More information
              </Text>
            </Pressable>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}
