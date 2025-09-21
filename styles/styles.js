import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:"center",
    },
    faturamento:{
        marginTop:50,
        height:120,
    },
    modal:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:30,
        backgroundColor:'#fff',
    },
    input:{
        paddingVertical:10,
        paddingHorizontal:10,
        width:'100%',
        backgroundColor:'#a19f9fff'
    },
    viewInput:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        gap:10,
    },
    viewDespesas:{
        flex:0.9,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingVertical:10,
        gap:40,
        backgroundColor:'#928e8eff',
        paddingHorizontal:22,
        borderRadius:8,
    },
    viewBetweenData:{
        flex:1,
        gap:30,
    },
    topoDatela:{
        flex:1,
        marginTop:50,
        gap:20
    },
    viewCadastro:{
        marginTop:50
    }




})
