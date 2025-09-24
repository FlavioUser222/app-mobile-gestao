import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import { styles } from '../styles/styles';
import { Picker } from '@react-native-picker/picker'
import { Feather, Ionicons } from 'react-native-vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function loginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    async function entrarNoSistema() {
        let User = {
            email,
            senha
        }
        try {
            let res = await axios.post("https://app-mobile-gestao.onrender.com/login", User)
            if (res.status === 200) {
                const usuario_id = res.data.usuario.id
                await AsyncStorage.setItem('@usuario_id', usuario_id.toString())

                alert('Bem-vindo ao sistema')
                navigation.navigate('Home')
            }

        } catch (error) {
            alert("Erro ao realizar login")
        }
    }

    return (
        <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
                <Text>Entrar no sistema</Text>
                <TextInput value={email} onChangeText={(text) => { setEmail(text) }} style={styles.input} placeholder='Email' />
                <TextInput value={senha} onChangeText={(text) => { setSenha(text) }} style={styles.input} placeholder='senha' />
                <TouchableOpacity onPress={() => { entrarNoSistema() }} style={styles.buttonCadastrar}>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Cadastro') }} style={styles.buttonCadastrar}>
                    <Text style={styles.textButton}>Não possui conta?</Text>
                </TouchableOpacity>
            </View>
        </View>
    )








}
