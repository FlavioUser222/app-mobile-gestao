import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';


export default function Cliente() {

    const [modal, setModal] = useState(false)

    const [listaVendas, setListaVendas] = useState([])
    let [quantidadeVendas, setQuantidadeVendas] = useState()
    let [data, setData] = useState()
    let [valor, setValor] = useState()



    useEffect(() => {
        async function fetchData() {
            let res = await axios.get('https://app-mobile-gestao.onrender.com/vendas')
            setListaVendas(res.data)
        }

        fetchData()
    }, [])


    async function handleInputs() {
        const novaVenda = {
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
                        <Text>{item.cliente}</Text>
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
                        <TextInput style={styles.input} value={nome} placeholder='Nome' onChangeText={(text) => { setQuantidadeVendas(text) }} />
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
