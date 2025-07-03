import React from "react";
import { View, Text ,TouchableOpacity, Image, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import {ButtonBack} from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";
import { TextErro } from "@/components/TextErro";
import { saveUserId } from "@/utils/storage";
import { BASE_IP } from "@/config/api";

export default function CadastroEmpresa(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erro, setErro] = useState('');

    const ConfirmarRegistro = async () => {
        
        if (!cnpj || !email || !senha || !telefone|| !nome) {
            setErro('Preencha todos os campos.')
            return;
        }
        try {
            const response = await fetch(`${BASE_IP}/register/business`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nome,
                    email: email,
                    password: senha,
                    CNPJ: cnpj,
                    telefone: telefone
                })
            });
                
            if (response.ok) {
                const data = await response.json();
                await saveUserId(data.id || data);
                setErro('');
                router.replace('/screens/Business/home1');
            } else {
                const data = await response.json();
                setErro(data.message || 'Erro ao registrar');
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErro('Erro de conexão com o servidor.');
        }
        
    }
    return(

        <KeyboardAvoidingView style= {{flex:1}} behavior="height">
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.view1}>
                    <View style= {styles.view2}>

                        <ButtonBack onPress={()=> router.back()}/>
                        <Image source={require('../../../../assets/images/image2.png')}style={styles.imagem1}/>
                        <Text style={styles.text1}>TOURMAP</Text>

                    </View>

                    <View style= {styles.view3}>

                        <View style={styles.subView1}>

                            <Image
                                source={require('../../../../assets/images/BusinessIcon.png')}
                                style={styles.imagem2}
                            />
                            <Text style={styles.text2}>REGISTRAR</Text>

                        </View>
                            
                        <View style={styles.subView4}>
                            <TextInput placeholder="NOME" style={styles.input} onChangeText={setNome}></TextInput>
                            <TextInput placeholder="EMAIL" style={styles.input}onChangeText={setEmail}></TextInput>
                            <TextInput placeholder="SENHA" style={styles.input}onChangeText={setSenha} secureTextEntry={true}></TextInput>
                            <TextInput placeholder="CNPJ" style={styles.input} onChangeText={setCnpj}></TextInput>
                            
                            <TextInput placeholder="TELEFONE" style={styles.input} onChangeText={setTelefone} keyboardType="phone-pad"></TextInput>
                        </View>
                        
                        <View style={styles.subView2}>
                            <ButtonPradao title="REGISTRAR" onPress={ConfirmarRegistro}/>
                            {erro !='' &&(
                                TextErro(erro)
                            )}
                        </View>
                        <View style={styles.subView3}>

                            <Text>Possui uma conta?</Text>
                            <TouchableOpacity style={styles.botao} onPress={()=> router.navigate("/screens/login")}><Text style={styles.text3}>LOGIN</Text></TouchableOpacity>
                            
                        </View>
                    </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    view1:{
        flex:1, 
        backgroundColor: '#F2F0F0', 
        flexDirection:"column"
    },
    view2:{
        width:"100%",
        height:173,
        backgroundColor: "#39B51B", 
        justifyContent: "center",
        alignItems:"center", 
        flexDirection:"column"
    },
    view3:{
        flex:1,
        alignItems:"center", 
        justifyContent: "center",
        flexDirection:"column",
    },
    subView1:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'row',
        top:-60
    },
    subView2:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'column'
    },
    subView3:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'row',
        position: 'absolute',
        bottom: 35
    },
    subView4:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'column',
        gap: 15,
        top: -30
    },
    imagem1:{
        width:80, 
        height:80
    },
    imagem2:{
        width:23, 
        height:23,
        marginRight:14
    },
    text1:{
        fontSize: 32,
        fontFamily:"Konkhmer Sleokchher", 
        color:'#B2F3A2', 
        fontWeight: "bold" 
    },
    text2:{
        fontSize: 32,
        fontFamily:"Konkhmer Sleokchher", 
        color:'#000000', 
        fontWeight: "bold"
    },
    text3:{
        textDecorationLine: 'underline',
        color: '#1500FF'
    },
    botao:{
        backgroundColor: "transparent"
    },
    input:{
        width:315,
        height: 55,
        borderRadius: 10,
        borderColor: '#3DD019',
        borderWidth:2,
        backgroundColor: 'white',
        paddingLeft: 20,
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center'
    }
});