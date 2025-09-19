import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';



export default function Cliente() {

    const [modal, setModal] = useState(false)
    let [clientes, setClientes] = useState([])
    let [nome, setNome] = useState('')
    let [data, setData] = useState('')
    let [email, setEmail] = useState('')
    let [telefone, setTelefone] = useState()
    let [vendasCliente,setVendasClientes] = useState([])


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


    return (
        <View>
            <View>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text>Cadastrar novo cliente</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text>Clientes cadastrados</Text>
                <FlatList
                    data={clientes}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <View>
                                <Text>Data: {item.data}</Text>
                                <Text>Nome: {item.nome}</Text>
                            </View>
                            <View>
                                <Text>Vendas:</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View style={styles.modal}>
                    <View>
                        <TouchableOpacity onPress={() => { setModal(false) }}><Text>X</Text></TouchableOpacity>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput style={styles.input} value={nome} placeholder='Nome' onChangeText={(text) => { setNome(text) }} />
                        <TextInput style={styles.input} value={data} placeholder='Data(XXXX-XX-XX)' onChangeText={(text) => { setData(text) }} />
                        <TextInput style={styles.input} value={email} placeholder='Email' onChangeText={(text) => { setEmail(text) }} />
                        <TextInput style={styles.input} value={telefone} placeholder='Telefone' onChangeText={(text) => { setTelefone(text) }} />
                        <TouchableOpacity onPress={() => { handleInputs() }}>
                            <Text >Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
