import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Picker } from '@react-native-picker/picker'
import { Feather } from 'react-native-vector-icons'

export default function Cliente() {

    const [modal, setModal] = useState(false)

    const [listaVendas, setListaVendas] = useState([])
    let [quantidadeVendas, setQuantidadeVendas] = useState()
    let [data, setData] = useState()
    let [valor, setValor] = useState()
    const [clienteIdSelecionado, setClienteIdSelecionado] = useState(null);
    const [listaClientes, setListaClientes] = useState([])



    useEffect(() => {
        async function fetchData() {
            let vendasRes = await axios.get('https://app-mobile-gestao.onrender.com/vendas')
            setListaVendas(vendasRes.data)

            let clientesRes = await axios.get('https://app-mobile-gestao.onrender.com/clientes')
            setListaClientes(clientesRes.data)
        }

        fetchData()
    }, [])





    async function handleInputs() {
        const novaVenda = {
            cliente_id: clienteIdSelecionado,
            quantidadeVendas,
            data,
            valor
        }
        try {
            let res = await axios.post('https://app-mobile-gestao.onrender.com/venda', novaVenda)
            setListaVendas([...listaVendas, res.data])
            setData('');
            setQuantidadeVendas('');
            setValor(0)
            setModal(false);


        } catch (err) {

            alert('Erro ao cadastrar despesa')
        }

    }

    async function deletarVenda(id) {
        try {
            let res = await axios.delete(`https://app-mobile-gestao.onrender.com/venda/${id}`)
            setListaVendas(listaVendas.filter(item => item._id !== id))
            alert('Venda deletada com sucesso!')
        } catch (error) {
            res.status(500)
        }
    }

    function buscarNomeClientePorId(id) {
        const cliente = listaClientes.find(cliente => cliente.id === id);
        return cliente ? cliente.nome : 'Cliente não encontrado';
    }



    return (
        <View style={styles.containerVendas}>
            <View style={styles.viewCadastro2}>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text>Cadastrar nova venda</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topoDatela}>
                <Text>Vendas realizadas</Text>
                <FlatList data={listaVendas} renderItem={({ item }) => (
                    <TouchableOpacity style={styles.viewVendas} onLongPress={() => { deletarVenda(item.id) }}>
                        <View style={styles.vendasCard}>
                            <View style={styles.vendasData}>
                                <Text>{item.data}</Text>
                                <Image />
                            </View>
                            <View style={styles.opcoes}>
                                <Text>Vendas:{item.quantidadevendas}</Text>
                                <Text>Cliente:{buscarNomeClientePorId(item.cliente_id)}</Text>
                                <Text>Valor:{item.valor}</Text>
                            </View>

                        </View></TouchableOpacity>)} />

            </View>
            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View>
                            <TouchableOpacity onPress={() => { setModal(false) }} style={styles.modalClose}><Text><Feather name='x' size={30} color={'Black'} /></Text></TouchableOpacity>
                        </View>

                        <View>
                            <Picker
                                selectedValue={clienteIdSelecionado}
                                onValueChange={(itemValue) => setClienteIdSelecionado(itemValue)}
                                style={{ height: 50 }}
                            >
                                <Picker.Item label="Selecione um cliente" value={null} />
                                {listaClientes.map(cliente => (
                                    <Picker.Item key={cliente.id} label={cliente.nome} value={cliente.id} />
                                ))}
                            </Picker>

                            <View style={styles.viewInput}>
                                <TextInput style={styles.input} value={quantidadeVendas} placeholder='Quantidade vendida' onChangeText={(text) => { setQuantidadeVendas(text) }} />
                                <TextInput style={styles.input} value={valor} placeholder='Valor' onChangeText={(text) => { setValor(text) }} />
                                <TextInput style={styles.input} value={data} placeholder='Data(XXXX-XX-XX)' onChangeText={(text) => { setData(text) }} />
                                <TouchableOpacity onPress={() => { handleInputs() }} style={styles.buttonCadastrar}>
                                    <Text>Cadastrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
}
