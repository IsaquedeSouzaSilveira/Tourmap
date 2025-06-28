import { View,
         Text, 
         Image, 
         StyleSheet, 
         TextInput,  
        } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import {ButtonBack} from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";
import { getUserId } from "@/utils/storage";
import { TextErro } from "@/components/TextErro";


export default function Roteiros(){

    //Declarando váriaveis de estado
    const [name, SetName]= useState('');
    const [descricao, SetDescricao]= useState('');
    const [erro, SetErro]= useState('');

    //Registrando nome e descrição do roteiro
    const registrar = async () => {
        const idCriador = await getUserId(); 

        try {
            const resultado = await fetch('http://192.168.72.107:3333/register/roadMap', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: name,
                    description: descricao,
                    idCreator: idCriador
                })
            });

            const data = await resultado.json();

            if (resultado.ok && data.response?.id) {
                const roadMapId = data.response.id;

                router.push({
                    pathname: '/screens/Cliente/criarRoteiro2',
                    params: { id: roadMapId }
                });

                console.log('Registrado com sucesso');
            } else {
                SetErro(data.message || "Erro ao registrar roteiro.");
            }
        } catch (error) {
            console.log('Erro na requisição:', error);
            SetErro('Erro na conexão com o servidor.');
        }
    };

    return(
        <View style={styles.view1}>
                <View style= {styles.view2}>
                    <ButtonBack onPress={()=> router.back()}/>
                    <Text style={styles.text1}>CRIAR ROTEIRO</Text>
                </View>
                
                <View style= {styles.view3}>
                    <Image source={require('../../../../assets/images/image3.png')} style={styles.imagem}/>
                    <View style={styles.subView}>
                        <TextInput 
                        placeholder="Nome do Roteiro:" 
                        style={styles.input1}
                        onChangeText={SetName}
                        />
                        <TextInput 
                        placeholder="Descrição:" 
                        style={styles.input2}
                        onChangeText={SetDescricao}
                        />
                    </View>
                    <ButtonPradao title="Selecionar locais" onPress={registrar}/>
                    {erro !='' &&(
                        TextErro(erro)
                    )}
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
        height:150,
        backgroundColor: "#39B51B", 
        alignItems:"center", 
        flexDirection:"column",
        paddingTop: 20
    },
    view3:{
        alignItems:"center",
        justifyContent: 'center', 
        flexDirection:"column",
        flex:1,
        gap: 30
    },
    subView:{
        width: '100%',
        height: 290,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 17
    },
    text1:{
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'  
    },
    imagem:{
        width: 138,
        height: 138,
        top: 10,
        position: 'absolute'
    },
    input1:{
        width: 307,
        height: 50,
        borderRadius: 12,
        borderWidth: 2,
        paddingLeft: 10,
        backgroundColor: 'white',
        borderColor: '#B2F3A2',
        fontSize: 15
    },
    input2:{
        width: 307,
        height: 73,
        fontSize: 15,
        borderRadius: 12,
        borderWidth: 2,
        paddingLeft: 10,
        backgroundColor: 'white',
        borderColor: '#B2F3A2'
    }
});