import React from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";

import {ButtonPradao} from "@/components/button1/index";
import { getUserId, getUserType  } from "@/utils/storage";



export default function Index(){

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verificarLogin = async () => {
            const userId = await getUserId();
            if (userId) {
                const userType = await getUserType();
                if (userType === 'Cliente'){
                    router.replace('/screens/Cliente/home1');
                    
                } 
                else if (userType === 'Empresa'){
                    router.replace('/screens/Business/home1');
                }
                else if (userType === 'Admin'){
                    router.replace('/screens/Admin/home1');
                } 
                else{
                    router.replace('/screens/Cliente/cadastro');
                } 
            }
                setLoading(false);
            };
        verificarLogin();
    }, []);

    return(
        <View style={styles.view1}>
                <Image
                    source={require('../../assets/images/image2.png')}
                    style={styles.imagem1}
                />
                <Text style={styles.text1}>TOURMAP</Text>
                <Text style={styles.text2}>INFORMANDO E DIRECIONANDO</Text>
                <Image
                    source={require('../../assets/images/image3.png')}
                    style={styles.imagem2}
                />
                <ButtonPradao  style={styles.button} title="COMEÇAR" onPress={()=> router.navigate("/screens/Cliente/cadastro")}/>
        </View>

    )
}

const styles = StyleSheet.create({
    view1:{
        flex:1, 
        backgroundColor: '#39B51B', 
        justifyContent: "center",
        alignItems:"center", 
        flexDirection:"column",
        gap: 1,
    },

    button:{
        backgroundColor: '#63D946', 
        width:221, 
        height:57,
        borderRadius:10,
        alignItems: "center",
        justifyContent: "center"
    },
    imagem1:{
        width:80, 
        height:80
    },
    imagem2:{
        width:256,
        height:256
    },
    text1:{
        fontSize: 32,
        fontFamily:"Konkhmer Sleokchher", 
        color:'#B2F3A2', 
        fontWeight: "bold" 
    },
    text2:{
        fontSize: 16,
        fontFamily:"Konkhmer Sleokchher", 
        color:'#000000', 
        fontWeight: "bold"
    },
});