import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.faturamento}>
        <Text>Faturamento total da semana</Text>
        <Text>R${ }</Text>
      </View>
      <View>
        <Text>
          Faturamento total liquido da semana(apos despesas e impostos)
        </Text>
        <Text>R${ }</Text>
      </View>

      <View>
        <View>
          <TouchableOpacity onPress={() => { navigation.navigate('Cliente') }}>
            <Text>Cadastro de clientes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('Venda') }}>
            <Text>Cadastro de vendas</Text>
          </TouchableOpacity >
          <TouchableOpacity onPress={() => { navigation.navigate('Despesa') }}>
            <Text>Cadastro de despesas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
