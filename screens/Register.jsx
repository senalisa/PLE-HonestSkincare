import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image} from 'react-native'
import React, { useState } from 'react'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Register() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // Voeg displayName toe
  const [error, setError] = useState('');

  const handlesubmit = async () => {
    if(email && password && displayName) { // Controleer of displayName is ingevuld
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile met displayName
        await updateProfile(user, { displayName: displayName });
        navigation.navigate('Home');

      } catch(err) {
        switch(err.code) {
          case 'auth/email-already-in-use':
            setError('Dit e-mailadres is al in gebruik.');
            break;
          case 'auth/invalid-email':
            setError('Ongeldig e-mailadres.');
            break;
          case 'auth/weak-password':
            setError('Het wachtwoord is te zwak. Vul een wachtwoord in van minimaal 6 tekens.');
            break;
          default:
            setError('Er is een fout opgetreden bij het registreren.');
        }
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
                <ArrowLeftIcon size="20" color="white"></ArrowLeftIcon>
            </TouchableOpacity>
        </View>

      </SafeAreaView>

      <View className="flex-1 bg-primary px-8 pt-8"> 
        <Text className="text-white font-bold text-2xl text-center mb-12">
                Registreren voor NPO Stories
        </Text>

        <View className="form space-y-2">
            
            {/* Username */}
            <Text className="text-white font-semibold text-xl">Gebruikersnaam</Text>
            <TextInput 
                className="p-4 bg-gray-200 text-gray-700 rounded-md border border-gray-300 text-l font-medium mb-6"
                placeholder=''
                value={displayName}
                onChangeText={value => setDisplayName(value)}
            >
            </TextInput>

            {/* Email input */}
            <Text className="text-white font-semibold text-xl">E-mailadres</Text>
            <TextInput 
                className="p-4 bg-gray-200 text-gray-700 rounded-md border border-gray-300 text-l font-medium mb-6"
                placeholder=''
                value={email}
                onChangeText={value => setEmail(value)}
            >
            </TextInput>

            {/* Wachtwoord input */}
            <Text className="text-white font-semibold text-xl">Wachtwoord</Text>
            <TextInput 
                className="p-4 bg-gray-200 text-gray-700 rounded-md border border-gray-300 text-l font-medium mb-10"
                secureTextEntry
                placeholder=''
                value={password}
                onChangeText={value => setPassword(value)}
            >
            </TextInput>

            {error ? <Text className="text-red-500 mb-4 -mt-6">{error}</Text> : null}

            <TouchableOpacity className="py-3 bg-secondary rounded-md mb-7"
                              onPress={handlesubmit}
            >
                <Text className="text-xl font-bold text-center text-white">Registreren</Text>
            </TouchableOpacity>

            {/* Nog geen account */}
            <View className="flex-row justify-center">
                <Text className="text-white font-medium">Heb je al een NPO account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text className="font-semibold text-secondary"> Inloggen</Text>
                </TouchableOpacity>
            </View>
        </View>

      </View>
    </View>
  )
}