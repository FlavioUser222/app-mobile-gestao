import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home'
import Cliente from './components/ClientScreen'
import Despesa from './components/NovaDespesa'
import Venda from './components/vendaScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{
          headerStyle: { backgroundColor: '#3b6cf1ff' },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="Cliente" component={Cliente} options={{
          headerStyle: { backgroundColor: '#3b6cf1ff' },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="Despesa" component={Despesa} options={{
          headerStyle: { backgroundColor: '#3b6cf1ff' },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="Venda" component={Venda} options={{
          headerStyle: { backgroundColor: '#3b6cf1ff' },
          headerTintColor: 'white',
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
