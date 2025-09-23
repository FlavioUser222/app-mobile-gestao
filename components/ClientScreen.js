import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Modal, TextInput, FlatList  } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Feather } from '@expo/vector-icons';


export default function Cliente() {

    const [modal, setModal] = useState(false)
    let [clientes, setClientes] = useState([])
    let [nome, setNome] = useState('')
    let [data, setData] = useState('')
    let [email, setEmail] = useState('')
    let [telefone, setTelefone] = useState()
    let [vendasCliente, setVendasClientes] = useState([])


    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                let resClientes = await axios.get('https://app-mobile-gestao.onrender.com/clientes')
                setClientes(resClientes.data)

                let resVendasCliente = await axios.get('https://app-mobile-gestao.onrender.com/clientes-vendas')

                setVendasClientes(resVendasCliente.data)
            } catch (err) {
                console.log('Erro ao buscar clientes')
            }
        }

        fetchData()
    }, [])

    async function handleInputs() {
        const novoCliente = {
            nome,
            data,
            email,
            telefone: Number(telefone),
        };

        console.log('🔼 Enviando para backend:', novoCliente);

        try {
            const res = await axios.post('https://app-mobile-gestao.onrender.com/cliente', novoCliente);
            console.log('✅ Cliente cadastrado com sucesso:', res.data);

            setClientes([...clientes, res.data]);
            alert('Despesa cadastrada com sucesso')

            setNome('');
            setData('');
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
            let res = await axios.delete(`https://app-mobile-gestao.onrender.com/venda/${id}`)
            setClientes(clientes.filter(item => item._id !== id))
            alert('Cliente deletado com sucesso!')
        } catch (error) {
            res.status(500)
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
                            <TouchableOpacity onPress={() => setOpen(true)} style={styles.input}>
                                <Text>{formatarDataSemHora(date.toISOString()) || 'Selecione uma data'}</Text>
                            </TouchableOpacity>
                            <TextInput style={styles.input} value={data} placeholder='Data(XXXX-XX-XX)' onChangeText={(text) => { setData(text) }} />
                            <TextInput style={styles.input} value={email} placeholder='Email' onChangeText={(text) => { setEmail(text) }} />
                            <TextInput style={styles.input} value={telefone} placeholder='Telefone' onChangeText={(text) => { setTelefone(text) }} />
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
