import React from "react";
import { View, Text , Image, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import {ButtonBack} from "@/components/button2/index"
import { ButtonPradao } from "@/components/button1";
import {Input} from "@/components/TextInput2/index";
import { TextErro } from "@/components/TextErro";

export default function EsqueciMinhaSenha(){
    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    
    const validarEmail=()=>{
        if (!email){
            setErro('Preencha o campo.')
            return;
        }
        const valida = /\S+@\S+\.\S+/;
        if (!valida.test(email)){
            setErro('Email inválido.')
            return;
        }
        setErro('')
        router.navigate('/screens/esqueceuSenha2')
    };

    return(
        <View style={styles.view1}>

                <View style= {styles.view2}>
                    <ButtonBack onPress={()=> router.back()}/>
                    <Image source={require('../../../assets/images/image2.png')}style={styles.imagem1}/>
                    <Text style={styles.text1}>TOURMAP</Text>
                </View>

                <View style= {styles.view3}>
                    
                    <View style={styles.view4}>
                        <View style={styles.subView1}>
                            <Text style={styles.text2}>Esqueceu sua senha?</Text>
                            <Text style={styles.text3}>Enviaremos um e-mail com instruções de como redefinir sua senha.</Text>
                        </View>
                        <View style={styles.subView2}>
                            <Input placeholder="Email" onChangeText={setEmail}/>
                        </View>

                        <View style={styles.subView3}>
                            <ButtonPradao title="ENVIAR" onPress={validarEmail}/>
                            {erro != '' && (
                                TextErro(erro)
                            )}
                        </View>
                    </View>
                    
                </View>
        </View>
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
        gap: 40
    },
    view4:{
        width:'90%',
        height:'80%',
        borderRadius: 10,
        backgroundColor: 'white',

    },
    subView1:{
        width: '100%',
        position: 'absolute',
        top:5,
        flexDirection: 'column'
    },
    subView2:{
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
        left: 20,
        top:'40%'
    },
    subView3:{
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50,
    },
    imagem1:{
        width:80, 
        height:80
    },
    text1:{
        fontSize: 32,
        fontFamily:"Konkhmer Sleokchher", 
        color:'#B2F3A2', 
        fontWeight: "bold" 
    },
    text2:{
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10
    },
    text3:{
        fontSize: 20,
        color: '#7C7C7C',
        marginLeft: 10
    },

});