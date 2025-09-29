import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Picker } from '@react-native-picker/picker'
import { Feather, Ionicons } from 'react-native-vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { RNDateTimePicker } from '@react-native-community/datetimepicker';




export default function Cliente() {

    const [modal, setModal] = useState(false)

    const [listaVendas, setListaVendas] = useState([])
    let [quantidadeVendas, setQuantidadeVendas] = useState()
    // let [data, setData] = useState()
    let [valor, setValor] = useState()
    const [clienteIdSelecionado, setClienteIdSelecionado] = useState(null);
    const [listaClientes, setListaClientes] = useState([])
    const [usuarioId, setUsuarioId] = useState(null)
    const [data, setData] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [isPressed, setIsPressed] = useState()

    const [nome_produto, setNome_produto] = useState('')

    const [foipaga, setFoipaga] = useState('')
    const [listaDeOpcoes, setListaDeOpcoes] = useState(['Recebida', 'A pagar', 'Parcialmente paga'])


    useEffect(() => {
        async function fetchData() {
            const id = await AsyncStorage.getItem('@usuario_id');
            setUsuarioId(id);

            if (!id) return;
            try {
                let vendasRes = await axios.get(`https://app-mobile-gestao.onrender.com/vendas?usuario_id=${id}`);
                setListaVendas(vendasRes.data);

                let clientesRes = await axios.get(`https://app-mobile-gestao.onrender.com/clientes?usuario_id=${id}`);
                setListaClientes(clientesRes.data);
            } catch (error) {
                console.error('Erro ao buscar vendas/clientes:', error);
            }
        }

        fetchData();
    }, []);


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

    function onChangeDate(event, selectedDate) {
        setShowDatePicker(false)
        if (selectedDate) {
            setData(selectedDate)
        }
    }

    async function handleInputs() {

        if (
            !clienteIdSelecionado ||
            !quantidadeVendas || isNaN(Number(quantidadeVendas)) ||
            !valor || isNaN(Number(valor)) ||
            !data || !(data instanceof Date) ||
            !nome_produto || !isNaN(nome_produto)
        ) {
            alert("Preencha todos os campos corretamente.");
            return;
        }


        const novaVenda = {
            cliente_id: clienteIdSelecionado,
            quantidadeVendas,
            data,
            valor,
            usuario_id: usuarioId,
            nome_produto,
            foipaga
        }


        try {
            let res = await axios.post('https://app-mobile-gestao.onrender.com/venda', novaVenda)
            setListaVendas([...listaVendas, res.data])
            alert('Produto cadastrado com sucesso')
            setQuantidadeVendas('');
            setNome_produto('')
            setValor(0)
            setModal(false);
        } catch (err) {

            alert('Erro ao cadastrar despesa')
        }

    }


    function formatReal(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    async function deletarVenda(id) {
        try {
            let res = await axios.delete(`https://app-mobile-gestao.onrender.com/venda/${id}?usuario_id=${usuarioId}`)
            setListaVendas(listaVendas.filter(item => item.id !== id))
            alert('Venda deletada com sucesso!')
        } catch (error) {
            console.error(500)
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
                    <Text style={styles.textButton}>Cadastrar nova venda</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topoDatela}>
                <Text style={styles.textTitle}> Vendas realizadas</Text>
                <FlatList data={listaVendas} renderItem={({ item }) => (
                    <TouchableOpacity style={styles.viewVendas} onLongPress={() => { deletarVenda(item.id) }}>
                        <View style={styles.vendasCard}>
                            <View style={styles.vendasData}>
                                <Text style={styles.textData}>{formatarDataSemHora(item.data)}</Text>
                                <Text style={styles.textData}>{item.nome_produto}</Text>
                            </View>
                            <View style={styles.opcoes}>
                                <Text>Vendas:{item.quantidadevendas}</Text>
                                <Text style={styles.textNome}>Cliente:{buscarNomeClientePorId(item.cliente_id)}</Text>
                                <Text style={styles.textVendas}>Valor:{formatReal(item.valor)}</Text>
                                <Text style={styles.textStatus}>Status: {item.foipaga || 'Não informado'}</Text>
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
                                style={{ height: 50, marginBottom: 10, backgroundColor: '#d3d3d3ff', borderWidth: 0, padding: 10 }}
                            >
                                <Picker.Item label="Selecione um cliente" value={null} />
                                {listaClientes.map(cliente => (
                                    <Picker.Item key={cliente.id} label={cliente.nome} value={cliente.id} />
                                ))}
                            </Picker>

                            <Picker
                                selectedValue={foipaga}
                                onValueChange={(itemValue) => setFoipaga(itemValue)}
                                style={{ height: 50, marginBottom: 10, backgroundColor: '#d3d3d3ff', borderWidth: 0, padding: 10 }}
                            >
                                <Picker.Item label="Selecione o status do pagamento" value={null} />
                                {listaDeOpcoes.map((opcao, index) => (
                                    <Picker.Item key={index} label={opcao} value={opcao} />
                                ))}
                            </Picker>



                            <View style={styles.viewInput}>
                                <TextInput style={styles.input} value={nome_produto} placeholder='Nome do produto' onChangeText={(text) => { setNome_produto(text) }} />
                                <TextInput style={styles.input} value={quantidadeVendas} placeholder='Quantidade vendida' onChangeText={(text) => { setQuantidadeVendas(text) }} />
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

                                <TouchableOpacity onPress={() => { handleInputs() }} style={styles.buttonCadastrar}>
                                    <Text style={styles.textButton}>Cadastrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
}
