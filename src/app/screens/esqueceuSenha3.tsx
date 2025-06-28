import React from "react";
import { View, Text ,TextInput, Image, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import {ButtonBack} from "@/components/button2/index"
import { ButtonPradao } from "@/components/button1";
import { TextErro } from "@/components/TextErro";

export default function EsqueciMinhaSenha(){

    const [code, setCode] = useState(['','','','']);
    const [erro, setErro] = useState('');

    const receberCode = (number: string, index: number)=>{
        const update= [...code]
         update[index] = number.replace(/[^0-9]/g, '').slice(0, 1);
        setCode(update)
    };
    const fullcode= code.join('');

    const CompararCode =()=>{
        if(code.includes('')){
            setErro('Por favor preencha todos os campos!')
            return;
        }
        if (fullcode!=='1234'){
            setErro('Código inválido.')
            return;
        }
        setErro('')
        router.navigate('/screens/login')
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
                            <Text style={styles.text3}>Coloque o código, que enviamos no seu email, nos espaços abaixo.</Text>
                        </View>
                        <View style={styles.subView2}>
                            {code.map((number: string, index: number) =>(
                                <TextInput 
                                    key={index} 
                                    value={number}
                                    keyboardType="number-pad" 
                                    maxLength={1} 
                                    style={styles.input} 
                                    textAlign="center"
                                    onChangeText={(value)=> receberCode(value,index)}
                                />
                            ))}
                            
                        </View>

                        <View style={styles.subView3}>
                            <ButtonPradao title="ENVIAR" onPress={CompararCode}/>
                            {erro !=='' &&(
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
        top:'40%',
        gap:30,
    },
    subView3:{
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        bottom: 50
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
    input:{
        width: 55,
        height:55,
        borderRadius:15,
        backgroundColor: '#F2F0F0',
    },
    

});