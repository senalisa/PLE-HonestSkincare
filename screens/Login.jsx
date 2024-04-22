import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if(email && password) { 
      try {
        await signInWithEmailAndPassword(auth, email, password);

        navigation.navigate('Home');
      } catch(err) {
        setError('Ongeldige gebruikersnaam of wachtwoord.');
      }

    }
  }

  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView className="flex">
        {/* Backbutton */}
        <View className="flex-row justify-start">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="bg-primary-dark p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View className="flex-1 bg-primary px-8 pt-8"> 
        <Text className="text-white font-bold text-2xl text-center mb-12">
          Login met je NPO-account
        </Text>

        <View className="form space-y-2">
          {/* Foutmelding */}
          {error ? <Text className="text-red-500 text-lg text-center mb-6">{error}</Text> : null}

          {/* Email input */}
          <Text className="text-white font-semibold text-xl">E-mailadres</Text>
          <TextInput 
            className="p-4 bg-gray-200 text-gray-700 rounded-md border border-gray-300 text-l font-medium mb-6"
            value={email}
            onChangeText={value => setEmail(value)}
            placeholder=''
          />

          {/* Wachtwoord input */}
          <Text className="text-white font-semibold text-xl">Wachtwoord</Text>
          <TextInput 
            className="p-4 bg-gray-200 text-gray-700 rounded-md border border-gray-300 text-l font-medium mb-6"
            secureTextEntry
            value={password}
            onChangeText={value => setPassword(value)}
            placeholder=''
          />

          {/* Wachtwoord vergeten optie */}
          <TouchableOpacity className="flex items-start mb-7">
            <Text className="text-secondary text-lg font-semibold">Wachtwoord vergeten?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 bg-secondary rounded-md mb-7"
            onPress={handleSubmit}
          >
            <Text className="text-xl font-bold text-center text-white">Login</Text>
          </TouchableOpacity>

          {/* Nog geen account */}
          <View className="flex-row justify-center">
            <Text className="text-white font-medium">Heb je nog geen NPO account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="font-semibold text-secondary"> Registreren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}