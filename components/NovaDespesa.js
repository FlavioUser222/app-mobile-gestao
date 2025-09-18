import { useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput } from 'react-native';

export default function Cliente() {

    const [modal, setModal] = useState(false)


    return (
        <View>
            <View>
                <TouchableOpacity onPress={()=>{setModal(true)}}>
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
