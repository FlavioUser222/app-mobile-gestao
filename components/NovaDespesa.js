import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList, Alert } from 'react-native';
import { styles } from '../styles/styles';
import { Feather } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { RNDateTimePicker } from '@react-native-community/datetimepicker';


export default function Cliente() {

    const [modal, setModal] = useState(false)
    const [listaDespesa, setListaDespesa] = useState([])
    let [nome, setNome] = useState('')
    let [valor, setValor] = useState()
    // let [data, setData] = useState()
    const [usuarioId, setUsuarioId] = useState(null);

    const [data, setData] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const id = await AsyncStorage.getItem('@usuario_id');
            setUsuarioId(id);

            if (!id) return;

            try {
                let res = await axios.get(`https://app-mobile-gestao.onrender.com/despesas?usuario_id=${id}`);
                setListaDespesa(res.data);
            } catch (err) {
                console.error('Erro ao buscar despesas:', err);
            }
        }

        fetchData();
    }, [])

    async function handleInputs() {
        if (!nome || nome.trim() === '') {
            Alert.alert("Erro", "O campo nome é obrigatório.");
            return;
        }

        if (!valor || isNaN(Number(valor))) {
            Alert.alert("Erro", "Informe um valor numérico válido.");
            return;
        }

        if (!data || !(data instanceof Date)) {
            Alert.alert("Erro", "Selecione uma data válida.");
            return;
        }



        const novaDespesa = {
            nome,
            valor,
            data,
            usuario_id: usuarioId
        }
        try {
            let res = await axios.post('https://app-mobile-gestao.onrender.com/despesa', novaDespesa)
            setListaDespesa([...listaDespesa, res.data])

            setNome('');
            setValor('')
            setModal(false);
        } catch (err) {

            alert('Erro ao cadastrar despesa')
        }

    }

    function onChangeDate(event, selectedDate) {
        setShowDatePicker(false)
        if (selectedDate) {
            setData(selectedDate)
        }
    }



    async function deletarDespesa(id) {
        try {
            let res = await axios.delete(`https://app-mobile-gestao.onrender.com/despesa/${id}?usuario_id=${usuarioId}`)
            setListaDespesa(listaDespesa.filter(item => item.id !== id))
            alert('Despesa deletada com sucesso!')
        } catch (error) {
            console.error(500)
        }
    }
    function formatarDataSemHora(dataHora) {
        if (!dataHora) return '';

        const data = dataHora.split('T')[0]; // "2025-09-23"
        const [ano, mes, dia] = data.split('-');

        const nomesMeses = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];

        const mesExtenso = nomesMeses[parseInt(mes, 10) - 1];

        return `${dia} de ${mesExtenso} de ${ano}`;
    }




    function formatReal(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    return (
        <View style={styles.container}>
            <View style={styles.viewCadastro2}>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text style={styles.textButton}>Cadastrar nova despesa</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topoDatela}>
                <Text style={styles.textTitle}>Despesas pendentes</Text>
                <FlatList data={listaDespesa} renderItem={({ item }) => (
                    <TouchableOpacity onLongPress={() => { deletarDespesa(item.id) }} style={styles.viewDespesas}>
                        <View style={styles.despesasCard}>
                            <View style={styles.viewBetweenData}>
                                <Text style={styles.textData}>{formatarDataSemHora(item.data)}</Text>
                                <Text style={styles.textNome}>{item.nome}</Text>
                            </View>
                            <View style={styles.valorText}>
                                <Text style={styles.textVendas}>Valor:{formatReal(item.valor)}</Text>
                            </View>

                        </View>
                    </TouchableOpacity>)} />

            </View>

            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View>
                            <TouchableOpacity onPress={() => { setModal(false) }} style={styles.modalClose}><Text><Feather name='x' size={30} color={'Black'} /></Text></TouchableOpacity>
                        </View>
                        <View style={styles.viewInput}>
                            <TextInput style={styles.input} value={nome} placeholder='Nome' onChangeText={(text) => { setNome(text) }} />
                            <TextInput style={styles.input} value={valor} placeholder='Valor' onChangeText={(text) => { setValor(text) }} />
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                <Text>
                                    {data ? data.toLocaleDateString('pt-BR') : 'Selecionar data'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={data}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}





                            {/* <TextInput style={styles.input} value={data} placeholder='Data(XXXX-XX-XX)' onChangeText={(text) => { setData(text) }} /> */}
                            <TouchableOpacity onPress={() => { handleInputs() }} style={styles.buttonCadastrar}>
                                <Text style={styles.textButton}>Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
}
