import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    faturamento: {
        marginTop: 10,
        height: 120,
        width: 300,
        borderRadius: 100,
        backgroundColor: '#638bf8b4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#fff',
    },
    input: {
        paddingHorizontal:20,
        paddingVertical:20,
        backgroundColor: '#a19f9fff'
    },
    viewInput: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    viewDespesas: {
        flex: 0.9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        gap: 40,
        backgroundColor: '#638bf8b4',
        paddingHorizontal: 22,
        borderRadius: 20,
    },
    viewBetweenData: {
        flex: 1,
        gap: 15,
        paddingTop:18,
    },
    topoDatela: {
        flex: 1,
        marginTop: 50,
        gap: 20
    },
    viewCadastro2: {
        marginTop: 50,
        width:300,
        height:50,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        backgroundColor:'#3b6cf1ff',
    },
    viewVendas: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 5,
        justifyContent: 'space-between',
        backgroundColor: '#638bf8b4',
        paddingHorizontal: 20,
        height: 100,
        marginTop: 20,
        borderRadius: 8,
    },
    opcoes: {
        alignItems: 'center',
        justifyContent:'center',
        gap:20,
    },
    vendasCard: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    containerClientes: {
        flex: 1,
        alignItems: "center",
        gap: 30,
    },
    containerVendas: {
        flex: 1,
        alignItems: "center",
        gap: 30,
    },
    viewClientes: {
        width:270,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,
        backgroundColor: '#638bf8b4',
        paddingHorizontal: 20,
        marginTop: 20,
        borderRadius: 8,
    },
    clienteData: {
        justifyContent:'space-between',
        gap:25,
    },
    clienteVendas: {
        alignItems: 'center',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '90%',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 10, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignItems: 'center',
        gap: 15,
    },
    opcoesCadasto: {
        marginTop: 10,
        height: 80,
        width: 140,
        borderRadius: 10,
        backgroundColor: '#3b6cf1ff',
        alignItems: 'center',
        justifyContent: 'center', 
        padding:20,
        textAlign:'center'
    },
    textCadastro:{
        color:'#fff',
        fontWeight:700,
    },

    viewCadastro: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 30,

    },
    clientesCard:{
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        paddingVertical:50,
        width:270,
        height:95,
    },
    vendasCard:{
        flexDirection:'row',
        width:300,
        height:120,
    },
    despesasCard:{
        flexDirection:'row',
        width:270,
        height:95,
      
    },
    vendasData:{
        alignItems:'center',
        marginTop:15,
    },
    valorText:{
        alignItems:'center',
        justifyContent:'center'
    },
    modalInput:{
        flex:1,
        alignItems:'center',
        marginTop:15,
    }








})
