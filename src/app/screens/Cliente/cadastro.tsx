import React from "react";
import { View,ScrollView, Text ,TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView  } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import {ButtonBack} from "@/components/button2/index"
import { ButtonPradao } from "@/components/button1";
import {Input} from "@/components/TextInput1/index";
import { TextErro } from "@/components/TextErro";

export default function Cadastro(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const ConfirmarRegistro = async () => {

        if (!nome || !email || !senha) {
            setErro('Preencha todos os campos.')
            return;
        }

        const valida = /\S+@\S+\.\S+/;
        if (!valida.test(email)) {
            setErro('Email inválido.')
            return;
        }
        if (senha.length<8){
            setErro('A senha deve ter no mínimo 8 caracteres.')
            return;
        }

        
        try {
            const resultado = await fetch("http://192.168.0.103:3333/register/client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nome,
                    email: email,
                    password: senha
                })
            });

            if (resultado.ok) {
                setErro('');
                router.replace('/screens/Cliente/home1');
            } else {
                const data = await resultado.json();
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
                                source={require('../../../../assets/images/iconPerson.png')}
                                style={styles.imagem2}
                            />
                            <Text style={styles.text2}>REGISTRAR</Text>

                        </View>
                            

                        <Input placeholder="NOME" onChangeText={setNome}/>
                        <Input placeholder="E-MAIL" keyboardType='email-address' onChangeText={setEmail}/>
                        <Input placeholder="SENHA" secureTextEntry={true} onChangeText={setSenha}/>
                        <View style={styles.subView2}>
                            <ButtonPradao title="REGISTRAR" onPress={ConfirmarRegistro}/>
                            {erro !='' &&(
                                TextErro(erro)
                            )}
                        </View>
                        
                        <TouchableOpacity style={styles.botao2} onPress={()=> router.navigate("/screens/Business/cadastroEmpresa")}><Text style={styles.text3}>Registrar-se como empresa</Text></TouchableOpacity>
                        <View style={styles.subView1}>

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
        flexDirection:"column",
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
        gap: 40
    },
    subView1:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'row'
    },
    subView2:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'column'
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
    botao2:{
        position: 'absolute',
        bottom: 80
    }
});