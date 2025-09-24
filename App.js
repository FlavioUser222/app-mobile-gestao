import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home'
import Cliente from './components/ClientScreen'
import Despesa from './components/NovaDespesa'
import Venda from './components/vendaScreen'
import CadastrarUsuario from './components/cadastroScreen';
import loginScreen from './components/loginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={loginScreen} options={{
          headerStyle: { backgroundColor: '#3b6cf1ff' },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="Cadastro" component={CadastrarUsuario} options={{
          headerStyle: { backgroundColor: '#3b6cf1ff' },
          headerTintColor: 'white',
        }} />
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
