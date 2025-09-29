import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { RNDateTimePicker } from '@react-native-community/datetimepicker';


export default function Cliente() {

    const [modal, setModal] = useState(false)
    let [clientes, setClientes] = useState([])
    let [nome, setNome] = useState('')
    // let [data, setData] = useState('')
    let [email, setEmail] = useState('')
    let [telefone, setTelefone] = useState()
    let [vendasCliente, setVendasClientes] = useState([])
    const [usuarioId, setUsuarioId] = useState(null);


    const [data, setData] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);



    useEffect(() => {
        async function fetchData() {
            const id = await AsyncStorage.getItem('@usuario_id');
            setUsuarioId(id);
            if (!id) return;

            try {
                const resClientes = await axios.get(`https://app-mobile-gestao.onrender.com/clientes?usuario_id=${id}`);
                setClientes(resClientes.data);

                const resVendasCliente = await axios.get(`https://app-mobile-gestao.onrender.com/clientes-vendas?usuario_id=${id}`);
                setVendasClientes(resVendasCliente.data);
            } catch (err) {
                console.error('Erro ao buscar clientes ou vendas:', err);
            }
        }

        fetchData();
    }, []);

    async function handleInputs() {


        if (!nome || nome.trim().length < 2) {
            alert("Informe um nome válido com pelo menos 2 caracteres.");
            return;
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            alert("Informe um e-mail válido.");
            return;
        }

        const telefoneNumerico = telefone.replace(/\D/g, '')
        if (!telefoneNumerico || telefoneNumerico.length < 8) {
            alert("Informe um telefone válido com pelo menos 8 números.")
            return
        }

        if (!data || !(data instanceof Date)) {
            alert("Selecione uma data válida.");
            return;
        }




        const novoCliente = {
            nome,
            data: data.toISOString(),
            email,
            telefone: Number(telefone),
            usuario_id: usuarioId
        };

        console.log('🔼 Enviando para backend:', novoCliente);

        try {
            const res = await axios.post('https://app-mobile-gestao.onrender.com/cliente', novoCliente);
            console.log('✅ Cliente cadastrado com sucesso:', res.data);

            setClientes([...clientes, res.data]);
            alert('Cliente cadastrado com sucesso')


            setNome('');
            setEmail('');
            setTelefone('');
            setModal(false);
        } catch (error) {
            console.error('❌ Erro ao cadastrar cliente:', error.response?.data || error.message);
            alert('Erro ao cadastrar cliente');
        }
    }


    async function deletarCliente(id) {
        try {
            let res = await axios.delete(`https://app-mobile-gestao.onrender.com/cliente/${id}?usuario_id=${usuarioId}`)

            console.log('✅ Cliente cadastrado com sucesso:', res.data)
            setClientes(clientes.filter(item => item.id !== id))
            alert('Cliente deletado com sucesso!')
        } catch (error) {
            console.error(500)
        }
    }

    function onChangeDate(event, selectedDate) {
        setShowDatePicker(false)
        if (selectedDate) {
            setData(selectedDate)
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

    return (
        <View style={styles.container}>
            <View style={styles.viewCadastro2}>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text style={styles.textButton}>Cadastrar novo cliente</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topoDatela}>
                <Text style={styles.textTitle}>Clientes cadastrados</Text>
                <FlatList
                    data={clientes}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={({ item }) => {

                        const vendaInfo = vendasCliente.find(vc => vc.nome === item.nome);

                        return (

                            <TouchableOpacity onLongPress={() => { deletarCliente(item.id) }} style={styles.viewClientes}>
                                <View style={styles.clientesCard}>
                                    <View style={styles.clienteData}>
                                        <Text style={styles.textData}>{formatarDataSemHora(item.data)}</Text>
                                        <Text style={styles.textNome}>Nome: {item.nome}</Text>
                                        <Text>{item.email}</Text>
                                        <Text>Tel: {item.telefone}</Text>
                                    </View>
                                    <View style={styles.clienteVendas}>
                                        <Text style={styles.textVendas}>Vendas: {vendaInfo ? vendaInfo.totalvendas : 0}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        );
                    }}
                />

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
                            <TextInput style={styles.input} value={email} placeholder='Email' keyboardType='email-address'
                                autoCapitalize='none' onChangeText={(text) => { setEmail(text) }} />
                            <TextInput style={styles.input} value={telefone} placeholder='Telefone' keyboardType='numeric' onChangeText={(text) => { setTelefone(text) }} />
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