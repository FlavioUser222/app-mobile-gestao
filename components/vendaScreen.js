import { useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput } from 'react-native';

export default function Cliente() {

    const [modal, setModal] = useState(false)


    return (
        <View>
            <View>
                <TouchableOpacity onPress={() => { setModal(true) }}>
                    <Text>Cadastrar nova venda</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text>Vendas realizadas</Text>
                <View>
                    <Text>Data</Text>
                    <Image />
                </View>
                <View>
                    <Text>vendas</Text>
                    <Text>cliente</Text>
                    <Text>valor</Text>
                </View>

            </View>
            <Modal visible={modal} animationType="slide"
                transparent={true}>
                <View>
                    <View>
                        <TouchableOpacity onPress={() => { setModal(false) }}><Text>X</Text></TouchableOpacity>    //icone
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
