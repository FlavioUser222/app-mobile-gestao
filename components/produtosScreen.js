import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList, Alert } from 'react-native';
import { styles } from '../styles/styles';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Produtos() {

    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)


    const [listaDeProdutos, setListaProdutos] = useState([])
    let [nome, setNome] = useState('')
    let [valor, setValor] = useState()
    let [estoque, setEstoque] = useState()

    const [usuarioId, setUsuarioId] = useState(null)
    const [produtoIdEdicao, setProdutoIdEdicao] = useState(null)


    useEffect(() => {
        async function fetchData() {
            const id = await AsyncStorage.getItem('@usuario_id');
            setUsuarioId(id);

            if (!id) return;

            try {
                let res = await axios.get(`https://app-mobile-gestao.onrender.com/produtos?usuario_id=${id}`);
                setListaProdutos(res.data);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
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
        if (!estoque || isNaN(Number(estoque))) {
            Alert.alert("Erro", "Informe um valor numérico válido.");
            return
        }

        const novoProduto = {
            nome,
            preco: valor,
            estoque,
            usuario_id: usuarioId
        }
        try {
            let res = await axios.post('https://app-mobile-gestao.onrender.com/produto', novoProduto)
            setListaProdutos([...listaDeProdutos, res.data])

            setNome('');
            setValor()
            setEstoque()
            setModal(false);
        } catch (err) {
            alert('Erro ao cadastrar produto')
        }

    }

    function formatReal(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    async function atualizarProduto(id) {


        const produtoAtualizado = {
            nome,
            preco: valor,
            estoque,
            usuario_id: usuarioId
        }

        try {
            let res = await axios.put(`https://app-mobile-gestao.onrender.com/produto/${id}`, produtoAtualizado)
            alert("Produto atualizado com sucesso", res.data)

            setListaProdutos(listaDeProdutos.map(item =>
                item.id === id ? { ...item, ...res.data.produto } : item
            ));
            setModal2(false)

        } catch (error) {
            alert("Erro ao atualizar produto")
        }
    }



    return (
        <View style={styles.container}>
            <View style={styles.viewCadastro2}>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text style={styles.textButton}>Cadastrar novo produto</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topoDatela}>
                <Text style={styles.textTitle}>Produtos cadastrados</Text>
                <FlatList data={listaDeProdutos} renderItem={({ item }) => (
                    <TouchableOpacity style={styles.viewDespesas}>
                        <View style={styles.despesasCard}>
                            <View style={styles.viewBetweenData}>
                                <Text style={styles.textNome}>{item.nome}</Text>
                            </View>
                            <View style={styles.valorText}>
                                <Text style={styles.textVendas}>Valor:{formatReal(item.preco)}</Text>
                                <Text style={styles.textVendas}>Estoque:{item.estoque}</Text>
                            </View>

                            <TouchableOpacity onPress={() => {
                                setProdutoIdEdicao(item.id)
                                setNome(item.nome)
                                setValor(item.preco.toString())
                                setEstoque(item.estoque.toString()); setModal2(true)

                            }}><Text style={{color:"#e42f2fff",fontWeight:600}}>Editar Produto</Text></TouchableOpacity>
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
                            <TextInput style={styles.input} value={estoque} placeholder='Quantidade Estoque' onChangeText={(text) => { setEstoque(text) }} />

                            <TouchableOpacity onPress={() => { handleInputs() }} style={styles.buttonCadastrar}>
                                <Text style={styles.textButton}>Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={modal2} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View>
                            <TouchableOpacity onPress={() => { setModal2(false) }} style={styles.modalClose}><Text><Feather name='x' size={30} color={'Black'} /></Text></TouchableOpacity>
                        </View>
                        <View style={styles.viewInput}>
                            <TextInput style={styles.input} value={nome} placeholder='Novo nome' onChangeText={(text) => { setNome(text) }} />
                            <TextInput style={styles.input} value={valor} placeholder='Novo valor' onChangeText={(text) => { setValor(text) }} />
                            <TextInput style={styles.input} value={estoque} placeholder='Nova Quantidade no Estoque' onChangeText={(text) => { setEstoque(text) }} />

                            <TouchableOpacity onPress={() => { atualizarProduto(produtoIdEdicao) }} style={styles.buttonCadastrar2}>
                                <Text style={styles.textButton}>Atualizar produto</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
}
