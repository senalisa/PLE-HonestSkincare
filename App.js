import React from 'react';
import NavigationStack from './navigation/AppNavigation'
import {  useFonts, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function App() {
    let [fontsLoaded] = useFonts({
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

    return (
            <NavigationStack />
    );
}
