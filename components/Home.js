import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Feather, Ionicons, FontAwesome5
} from 'react-native-vector-icons'

export default function Home({ navigation }) {
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);
  const [despesasTotais, setDespesasTotais] = useState(0);
  const [lucro, setLucro] = useState(0);

  useEffect(() => {
    async function fetchFaturamento() {
      try {
        const res = await axios.get('https://app-mobile-gestao.onrender.com/faturamentoTotal');
        setFaturamentoTotal(res.data.faturamento);
      } catch (error) {
        console.error('Erro ao buscar faturamento:', error);
      }
    }

    async function fetchDespesas() {
      try {
        const res = await axios.get('https://app-mobile-gestao.onrender.com/despesas-totais');
        setDespesasTotais(res.data.despesas);
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    }

    async function fetchLucro() {
      try {
        const res = await axios.get('https://app-mobile-gestao.onrender.com/lucro');
        setLucro(res.data.lucro);
      } catch (error) {
        console.error('Erro ao buscar lucro:', error);
      }
    }

    fetchFaturamento();
    fetchDespesas();
    fetchLucro();
  }, []);



  function formatReal(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <View style={styles.container}>
      <View style={styles.faturamento}>
        <Text style={{ fontWeight: 'bold' }}>Faturamento total</Text>
        <Text>{formatReal(faturamentoTotal)}</Text>
      </View>

      <View style={styles.faturamento}>
        <Text style={{ fontWeight: 'bold' }}>Faturamento líquido (após despesas)</Text>
        <Text>{formatReal(lucro)}</Text>
      </View>

      <View style={styles.faturamento}>
        <Text style={{ fontWeight: 'bold' }}>Total de despesas</Text>
        <Text>{formatReal(despesasTotais)}</Text>
      </View>

      <View style={styles.viewCadastro}>
        <TouchableOpacity onPress={() => navigation.navigate('Cliente')} style={styles.opcoesCadasto}>
          <Text style={styles.textCadastro} >Cadastro de clientes</Text>
          <Ionicons name={"people"} size={25} color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Venda')} style={styles.opcoesCadasto}>
          <Text style={styles.textCadastro}>Cadastro de vendas</Text>
          <FontAwesome5 name={"money-bill"} size={25} color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Despesa')} style={styles.opcoesCadasto}>
          <Text style={styles.textCadastro}>Cadastro de despesas</Text>
          <Ionicons name={"receipt"} size={25} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
