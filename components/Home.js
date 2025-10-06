import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { styles } from '../styles/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Feather, Ionicons, FontAwesome5
} from 'react-native-vector-icons'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';




export default function Home({ navigation }) {
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);
  const [despesasTotais, setDespesasTotais] = useState(0);
  const [lucro, setLucro] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState([])

  useFocusEffect(
    useCallback(() => {
      async function fetchDados() {
        try {
          const id = await AsyncStorage.getItem('@usuario_id');
          console.log('usuario_id do AsyncStorage:', id);
          if (!id) return;

          const faturamentoRes = await axios.get(`https://app-mobile-gestao.onrender.com/faturamentoTotal?usuario_id=${id}`);
          setFaturamentoTotal(faturamentoRes.data.faturamento);

          const despesasRes = await axios.get(`https://app-mobile-gestao.onrender.com/despesas-totais?usuario_id=${id}`);
          setDespesasTotais(despesasRes.data.despesas);


          const lucroRes = await axios.get(`https://app-mobile-gestao.onrender.com/lucro?usuario_id=${id}`);
          setLucro(lucroRes.data.lucro);

          const movimentacoesRes = await axios.get(`https://app-mobile-gestao.onrender.com/ultimas-movimentacoes?usuario_id=${id}`)
          setMovimentacoes(movimentacoesRes.data)

        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      }

      fetchDados();
    }, [])

  )



  function formatReal(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const chartData = [];

  if (faturamentoTotal > 0) chartData.push({ value: faturamentoTotal, color: "#2196F3" });
  if (despesasTotais > 0) chartData.push({ value: despesasTotais, color: "#F44336" });
  if (lucro > 0) chartData.push({ value: lucro, color: "#4CAF50" });



  return (

    <ScrollView>

      <View style={styles.container}>
        <View style={styles.faturamento}>
          <Text style={{ fontWeight: 'bold' }}>Faturamento bruto</Text>
          <Text>{formatReal(faturamentoTotal)}</Text>
        </View>


        <View style={styles.faturamento}>
          <Text style={{ fontWeight: 'bold' }}>Faturamento líquido</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('Produtos')} style={styles.opcoesCadasto}>
            <Text style={styles.textCadastro} >Cadastro de Produtos</Text>
            <FontAwesome6 name={"boxes-stacked"} size={25} color={"white"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Venda')} style={styles.opcoesCadasto}>
            <Text style={styles.textCadastro}>Lançamento de vendas</Text>
            <FontAwesome5 name={"money-bill"} size={25} color={"white"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Despesa')} style={styles.opcoesCadasto}>
            <Text style={styles.textCadastro}>Lançamento de despesas</Text>
            <Ionicons name={"receipt"} size={25} color={"white"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.textTitle2}>Últimas movimentacoes</Text>
        {movimentacoes.map((item, index) => (
          <View key={index} style={
            item.tipo === 'venda' ? [
              item.descricao === 'Venda Recebida' && {
                backgroundColor: '#3bf17281', alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                marginTop: 15,
                width: 300,
                height: 100,
                borderRadius: 150
              },
              item.descricao === 'Venda Não paga' && {
                backgroundColor: '#f86363ff', alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                marginTop: 15,
                width: 300,
                height: 100,
                borderRadius: 150
              },
              item.descricao === 'Venda Parcialmente recebida' && {
                backgroundColor: '#f0873280', alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                marginTop: 15,
                width: 300,
                height: 100,
                borderRadius: 150
              },] : styles.viewMovimentacaoDespesa
          }>
            <Text style={{ fontWeight: 'bold' }}>
              {item.tipo === 'venda' ? 'Venda' : 'Despesa'}: {item.descricao}
            </Text>
            <Text>{formatReal(item.valor)} - {new Date(item.data).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView >

  );
}
