import { useState } from 'react';
import { Text, TouchableOpacity, View, Modal,TextInput } from 'react-native';

export default function Cliente() {

    const [modal, setModal] = useState(false)

    return (
        <View>
            <View>
                <TouchableOpacity onPress={()=>{setModal(true)}}>
                    <Text>Cadastrar novo cliente</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text>Clientes cadastrados</Text>
                <View>
                    <Text>Data</Text>
                    <Text>Nome</Text>
                </View>
                <View>
                    <Text>vendas</Text>
                </View>

            </View>

            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View>
                    <View>
                         <TouchableOpacity onPress={()=>{setModal(false)}}><Text>X</Text></TouchableOpacity>
                    </View>
                    <View>
                        <TextInput />
                        <TextInput />
                        <TextInput />
                        <TextInput />
                        <TouchableOpacity>
                            <Text>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
