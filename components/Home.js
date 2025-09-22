import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

  return (
    <View style={styles.container}>
      <View style={styles.faturamento}>
        <Text style={{ fontWeight: 'bold' }}>Faturamento total</Text>
        <Text>R$ {Number(faturamentoTotal).toFixed(2)}</Text>
      </View>

      <View style={styles.faturamento}>
        <Text style={{ fontWeight: 'bold' }}>Faturamento líquido (após despesas)</Text>
        <Text>R$ {Number(lucro).toFixed(2)}</Text>
      </View>

      <View style={styles.faturamento}>
        <Text style={{ fontWeight: 'bold' }}>Total de despesas</Text>
        <Text>R$ {Number(despesasTotais).toFixed(2)}</Text>
      </View>

      <View style={styles.viewCadastro}>
        <TouchableOpacity onPress={() => navigation.navigate('Cliente')} style={styles.opcoesCadasto}>
          <Text style={styles.textCadastro}>Cadastro de clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Venda')} style={styles.opcoesCadasto}>
          <Text style={styles.textCadastro}>Cadastro de vendas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Despesa')} style={styles.opcoesCadasto}>
          <Text style={styles.textCadastro}>Cadastro de despesas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
