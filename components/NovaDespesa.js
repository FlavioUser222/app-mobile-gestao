import axios from 'axios';
import { useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';

export default function Cliente() {

    const [modal, setModal] = useState(false)
    const [listaDespesa, setListaDespesa] = useState([])
    let [nome, setNome] = useState('')
    let [valor, setValor] = useState()
    let [data, setData] = useState()


    useState(() => {
        async function fetchData() {
            let res = await axios.get('https://app-mobile-gestao.onrender.com/despesas')

            setListaDespesa(res.data)
        }

        fetchData()
    }, [])



    async function handleInputs() {
        const novaDespesa = {
            nome,
            valor,
            data
        }
        try {
            let res = await axios.post('https://app-mobile-gestao.onrender.com/despesa', novaDespesa)
        } catch (err) {

            alert('Erro ao cadastrar despesa')
        }

    }






    return (
        <View>
            <View>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text>Cadastrar nova despesa</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text>Despesas pendentes</Text>
                <View>
                    <Text>Data</Text>
                    <Text>Nome despesa</Text>
                </View>
                <View>
                    <Text>valor despesa</Text>
                </View>
            </View>

            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View>
                    <View>
                        <TouchableOpacity onPress={() => { setModal(false) }}><Text>X</Text></TouchableOpacity>
                    </View>
                    <View>
                        <TextInput style={styles.input} value={nome} placeholder='Nome' onChangeText={(text) => { setNome(text) }} />
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
