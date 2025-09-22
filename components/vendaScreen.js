import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Picker } from '@react-native-picker/picker'

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


    return (
        <View>
            <View>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text>Cadastrar nova venda</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text>Vendas realizadas</Text>
                <FlatList data={listaVendas} renderItem={({ item }) => (<View>
                    <View>
                        <Text>{item.data}</Text>
                        <Image />
                    </View>
                    <View>
                        <Text>{item.quantidadeVendas}</Text>
                        <Text>{item.cliente_id}</Text>
                        <Text>{item.valor}</Text>
                    </View>

                </View>)} />

            </View>
            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View>
                    <View>
                        <TouchableOpacity onPress={() => { setModal(false) }}><Text>X</Text></TouchableOpacity>    //icone
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


                        <TextInput style={styles.input} value={quantidadeVendas} placeholder='Quantidade vendida' onChangeText={(text) => { setQuantidadeVendas(text) }} />
                        <TextInput style={styles.input} value={valor} placeholder='Valor' onChangeText={(text) => { setValor(text) }} />
                        <TextInput style={styles.input} value={data} placeholder='Data(XXXX-XX-XX)' onChangeText={(text) => { setData(text) }} />
                        <TouchableOpacity onPress={() => { handleInputs() }}>
                            <Text>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>
    );
}
