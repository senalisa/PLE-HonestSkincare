import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Modal, ScrollView, Image, ImageBackground } from 'react-native';

export default function Leaderboard() {
  const [selectedSkinType, setSelectedSkinType] = useState('Oily skin');
  const [selectedSkinConcern, setSelectedSkinConcern] = useState('Acne');
  const [skinTypeModalVisible, setSkinTypeModalVisible] = useState(false);
  const [skinConcernModalVisible, setSkinConcernModalVisible] = useState(false);

  const skinTypes = ['Oily', 'Dry', 'Combination', 'Normal'];
  const skinConcerns = ['Acne', 'Redness', 'Wrinkles', 'Dryness', 'Eye bags', 'Pores', 'Blackheads', 'Whiteheads', 'Rosacea'];

  return (
    <ScrollView>
      <StatusBar />
      <View className="flex-1">
        <ImageBackground source={require('./../assets/images/bg11.png')} imageStyle= {{opacity:0.6, width: '100%', height: '100%' }}>

        {/* Title */}
        <View className="mt-20 flex-row justify-between px-8">
          {/* INTRO: Welcome user + text */}
          <View className="-mt-3 mb-0 flex">
            <Text className="mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Leaderboard</Text>
          </View>

          <TouchableOpacity className="bg-dark-pink -mt-3 px-6 py-2 rounded-full">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-white">Vote</Text>
          </TouchableOpacity>
        </View>

        {/* Skin Type & Concern tags */}
        <View className="mt-5">
          <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-base text-center">See the top voted products for</Text>
          
          <View className="flex-row mx-auto mt-2">

            {/* Skin Type */}
            <TouchableOpacity
              className="flex-row justify-between items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-40 mr-3"
              onPress={() => setSkinTypeModalVisible(true)}
            >
              <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-ms text-center">{selectedSkinType}</Text>
              <Image className="w-3 h-3 mr-1 mt-1" 
                                  source={require('./../assets/icons/down2.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row justify-between items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-40"
              onPress={() => setSkinConcernModalVisible(true)}
            >
              <Text style={{ fontFamily: 'Montserrat_500Medium' }} className="text-ms text-center">{selectedSkinConcern}</Text>
              <Image className="w-3 h-3 mr-1 mt-1" 
                                  source={require('./../assets/icons/down2.png')} />
            </TouchableOpacity>

          </View>
        </View>

        <View>
          {/* First Product */}
          <TouchableOpacity className="items-center mt-6">
            <Image className="w-[240] h-[240]" 
                      source={require('./../assets/images/firstproduct.png')} />
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                  className="text-center text-sm -mt-2">1247 votes</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-0 pb-16">
          {/* Third Product */}
          <TouchableOpacity className="items-center -mt-8 mr-0">
            <Image className="w-[180] h-[180]" 
                      source={require('./../assets/images/thirdproduct.png')} />
             <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                  className="text-center text-sm -mt-2 ">328 votes</Text>
          </TouchableOpacity>

           {/* Second Product */}
           <TouchableOpacity className="items-center mt-0">
            <Image className="w-[200] h-[210]" 
                      source={require('./../assets/images/secondproduct.png')} />
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                  className="text-center text-sm -mt-2">761 votes</Text>
          </TouchableOpacity>
        </View>
        
        </ImageBackground>

        {/* Info about products */}
        <View className="bg-white rounded-t-[35px] outline outline-offset-6 pb-32 pt-0 -mt-8">
         
          {/* First place info */}
          <View className="flex-row justify-between px-8 py-3 items-center pt-8">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-2xl text-dark-pink">
              1
            </Text>

            <View className="flex-1 ml-8">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-base">
                Serum X
              </Text>
              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="text-md">
                Brand Name X
              </Text>
            </View>

            <View>
              <View className="flex-row justify-center">
                <Image className="w-4 h-4 mr-1 -ml-1" 
                      source={require('./../assets/icons/speech-bubble.png')} />
                <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                className="text-center text-xs mb-1">989</Text>
              </View>

              <TouchableOpacity className="bg-dark-pink rounded-full px-3 py-2">
                <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                className="text-white text-xs">Reviews</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-b border-gray-200 mt-3 mx-8" />

          {/* Second place info */}
          <View className="flex-row justify-between px-8 py-3 items-center mt-2">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-2xl text-dark-pink">
              2
            </Text>

            <View className="flex-1 ml-8">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-base">
                Moisturizer Y
              </Text>
              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="text-md">
                Brand Name Y
              </Text>
            </View>

            <View>
              <View className="flex-row justify-center">
                <Image className="w-4 h-4 mr-1 -ml-1" 
                      source={require('./../assets/icons/speech-bubble.png')} />
                <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                className="text-center text-xs mb-1">578</Text>
              </View>

              <TouchableOpacity className="bg-dark-pink rounded-full px-3 py-2">
                <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                className="text-white text-xs">Reviews</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-b border-gray-200 mt-3 mx-8" />

          {/* Third place info */}
          <View className="flex-row justify-between px-8 py-3 items-center mt-2">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-2xl text-dark-pink">
              3
            </Text>

            <View className="flex-1 ml-8">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-base">
                Cleanser Z
              </Text>
              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="text-md">
                Brand Name Z
              </Text>
            </View>

            <View>
              <View className="flex-row justify-center">
                <Image className="w-4 h-4 mr-1 -ml-1" 
                      source={require('./../assets/icons/speech-bubble.png')} />
                <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                className="text-center text-xs mb-1">139</Text>
              </View>

              <TouchableOpacity className="bg-dark-pink rounded-full px-3 py-2">
                <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                className="text-white text-xs">Reviews</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>

      {/* Modal voor Skin Type */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={skinTypeModalVisible}
        onRequestClose={() => setSkinTypeModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white p-5 rounded-lg w-80 py-10">
            
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-center mb-5 text-base">
              Choose a Skin Type
            </Text>

            <View className="flex-row flex-wrap w-full items-center justify-center">
            {skinTypes.map((concern) => (
              <TouchableOpacity
                key={concern}
                className="bg-light-blue border-2 border-blue px-5 py-1.5 rounded-full mr-2 mb-2"
                onPress={() => {
                  setSelectedSkinConcern(concern);
                  setSkinConcernModalVisible(false);
                }}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                className="text-center text-md text-blue">{concern}</Text>
              </TouchableOpacity>
            ))}
            </View>

            <TouchableOpacity
              className="bg-dark-pink py-2 mx-12 rounded-full mt-8"
              onPress={() => setSkinTypeModalVisible(false)}
            >
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                    className="text-white text-center">Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Modal voor Skin Concern */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={skinConcernModalVisible}
        onRequestClose={() => setSkinConcernModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white p-5 rounded-lg w-80 py-10">
            
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
            className="text-center mb-5 text-base">
              Choose a Skin Concern
            </Text>

            <View className="flex-row flex-wrap w-full items-center justify-center">
            {skinConcerns.map((concern) => (
              <TouchableOpacity
                key={concern}
                className="bg-yellow border-2 border-dark-yellow px-5 py-1.5 rounded-full mr-2 mb-2"
                onPress={() => {
                  setSelectedSkinConcern(concern);
                  setSkinConcernModalVisible(false);
                }}
              >
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 13 }}
                className="text-center text-md text-dark-yellow">{concern}</Text>
              </TouchableOpacity>
            ))}
            </View>

            <TouchableOpacity
              className="bg-dark-pink py-2 mx-12 rounded-full mt-8"
              onPress={() => setSkinConcernModalVisible(false)}
            >
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 15 }}
                    className="text-white text-center">Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
