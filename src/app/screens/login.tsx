import React from "react";
import {View,
        Text,
        TouchableOpacity, 
        Image, 
        StyleSheet 
        } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import {ButtonBack} from "@/components/button2/index"
import { ButtonPradao } from "@/components/button1";
import {Input} from "@/components/TextInput1/index";
import { TextErro } from "@/components/TextErro";
import { saveUserId, getUserType } from "@/utils/storage";
import { BASE_IP } from "@/config/api";

export default function Login(){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const validacao = async ()=>{
        
        const endpoints =[
            {url: `${BASE_IP}/login/client`},
            {url: `${BASE_IP}/login/admin`},
            {url: `${BASE_IP}/login/business`},
        ]

        for (const {url} of endpoints){
            console.log("Email:", email, "Senha:", senha);
            try{
                const resultado =await fetch(url,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password:senha
                    })
                });
                
                
                if (resultado.ok){
                    const data = await resultado.json();
                    await saveUserId(data.id || '');
                    setErro('');
                    const tipo= await getUserType();
                    if(tipo=== "Cliente"){
                        console.log('Deu certo')
                        router.replace('/screens/Cliente/home1');
                        
                    }
                    if(tipo=== "Empresa"){
                        router.replace('/screens/Business/home1')
                    }
                    if(tipo=== "Admin"){
                        router.replace('/screens/Admin/home1')
                    }
                    return;
                }
                else{
                    const data = await resultado.json();
                    console.log(data.message)
                }
            }catch (error){
                console.error("Erro na requisição:",{url}, error);
                setErro('Erro na conexão com o servidor.')
            };
        };
    };

    return(
        <View style={styles.view1}>

                <View style= {styles.view2}>
                    <ButtonBack onPress={()=> router.back()}/>
                    <Image source={require('../../../assets/images/image2.png')}style={styles.imagem1}/>
                    <Text style={styles.text1}>TOURMAP</Text>
                </View>

                <View style= {styles.view3}>
                    <View style={styles.subView}>
                        <Image
                            source={require('../../../assets/images/iconPerson.png')}
                            style={styles.imagem2}
                        />
                        <Text style={styles.text2}>LOGIN</Text>
                    </View>
                        
                    <Input placeholder="E-MAIL" keyboardType='email-address'onChangeText={setEmail}/>
                    <View style={styles.subView2}>
                        <Input placeholder="SENHA" secureTextEntry={true} onChangeText={setSenha}/>
                        <TouchableOpacity style={styles.botao} onPress={()=> router.navigate('/screens/esqueceuSenha1')}><Text style={styles.text4}>Esqueci minha senha</Text></TouchableOpacity>
                    </View>
                    <View style={styles.subView4}>
                        <ButtonPradao title="ENTRAR" onPress={validacao}/>
                        {erro !='' &&(
                            TextErro(erro)
                        )}
                    </View>
                    
                    <View style={styles.subView3}>
                        <Text>Não tem uma conta? </Text>
                        <TouchableOpacity style={styles.botao} onPress={()=> router.navigate('/screens/Cliente/cadastro')}><Text style={styles.text3}>REGISTRAR-SE</Text></TouchableOpacity>
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
        gap: 30
    },
    subView:{
        position: 'absolute',
        top: 70,
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'row',
        
    },
    subView2:{
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'column',
        gap:7,
        marginBottom:15
    },
    subView3:{
        position: 'absolute',
        bottom: 120,
        width: '100%',
        justifyContent: "center",
        alignItems:"center",
        flexDirection: 'row',
        
    },
    subView4:{
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
    textErro:{
        position: 'absolute',
        color:'red',
        fontSize:15,
        bottom: 85
    },
    botao:{
        backgroundColor: "transparent"
        
    },
    text3:{
        textDecorationLine: 'underline',
        color: '#1500FF'
    },
    text4:{
        position: 'absolute',
        left:-145,
        textDecorationLine: 'underline',
        color: '#1500FF',
        fontSize: 11
    }


});