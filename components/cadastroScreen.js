import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Picker } from '@react-native-picker/picker'
import { Feather, Ionicons } from 'react-native-vector-icons'


export default function CadastrarUsuario() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')


    async function postUsuario() {
        let newUser = {
            email,
            senha
        }
        try {
            let res = await axios.post("https://app-mobile-gestao.onrender.com/cadastrarUser", newUser)
            alert('Usuario cadastrado',res.data)
        } catch (error) {
            alert(500, "Erro ao cadastrar usuario")
        }
    }

    return (
        <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
                <Text>Cadastrar no sistema</Text>
                <TextInput value={email} onChangeText={(text) => { setEmail(text) }} style={styles.input} placeholder='Cadastrar email' />
                <TextInput value={senha} onChangeText={(text) => { setSenha(text) }} style={styles.input} placeholder='Cadastrar senha' />
                <TouchableOpacity onPress={() => { postUsuario() }} style={styles.buttonCadastrar}>
                    <Text style={styles.textButton}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )








}
