import React from 'react';
import NavigationStack from './navigation/AppNavigation'
import {  useFonts, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import { Belleza_400Regular } from '@expo-google-fonts/belleza'

export default function App() {
    let [fontsLoaded] = useFonts({
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,

        Belleza_400Regular,

      });
    
      if (!fontsLoaded) {
        return null;
      }

    return (
            <NavigationStack />
    );
}
