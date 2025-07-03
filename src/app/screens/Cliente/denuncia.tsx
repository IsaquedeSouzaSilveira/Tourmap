import { View,
         Text, 
         Image, 
         StyleSheet, 
         TextInput,
         TouchableOpacity  
        } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

import {ButtonBack} from "@/components/button2/index";
import { getUserId } from "@/utils/storage";
import { TextErro } from "@/components/TextErro";
import { BASE_IP } from "@/config/api";


export default function Denuncia(){

    //Declarando váriaveis de estado
    const [name, SetName]= useState('');
    const [motivo, SetMotivo]= useState('');
    const [erro, SetErro]= useState('');
    const [sucess, SetSucess]= useState(false);

    const params = useLocalSearchParams();

    const nome = params.name;

    let PointType ='';

    //Registrando nome e descrição do roteiro
    const denunciar =async()=>{

        //Armazena id do usuário
        const idUser= getUserId();

        let url='';

        if(PointType==='Turistico'){
            url= `${BASE_IP}/report/touristPoint`;
        }
        else if(PointType==='Comercial'){
            url= `${BASE_IP}/report/comercialPoint`;
        }
        else{
            console.log('O tipo do ponto é inválido');
            return
        }
        try{
            const resultado =await fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idPoint: name,
                    description: motivo,
                })
            });
            if (resultado.ok){
                SetSucess(true);
                setTimeout(() => {
                    router.back();
                }, 2000);
            }
        }
        catch(error){
            console.log('Erro na requisição:',error);
            SetErro('Erro na conexão com o servidor.');
            return;
        }
    };

    return(
        <View style={styles.view1}>
                <View style= {styles.view2}>
                    <ButtonBack onPress={()=> router.back()}/>
                    <Text style={styles.text1}>DENÚNCIA</Text>
                </View>
            {sucess ?(
                <View style={styles.view3}>
                    <View style={styles.subView2}>
                        <Image source={require('../../../../assets/images/sucess.png')}/>
                    </View>
                    <Text style={{ fontSize: 20}}>Denuncia feita com sucesso!</Text>
                </View>
            ):(
                <View style= {styles.view3}>
                    <Image source={require('../../../../assets/images/DenunciaIcon2.png')} style={styles.imagem}/>
                    <View style={styles.subView1}>
                        <View style={styles.input1}>
                            <Text style={{color: '#868686', fontSize:15}}>Alvo da denuncia:  {nome}</Text>
                            
                        </View>
                        <TextInput 
                        placeholder="Motivo:" 
                        style={styles.input2}
                        onChangeText={SetMotivo}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={denunciar}>
                        <Text style={styles.title}>DENUNCIAR</Text>
                    </TouchableOpacity>
                    {erro !='' &&(
                        TextErro(erro)
                    )}
                </View>
            )}
                
        </View>
    );
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
        backgroundColor: "#D91313", 
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
    subView1:{
        width: '100%',
        height: 290,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 17
    },
    subView2:{ 
        width: 175,
        height: 175,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: '#8A1414',
        backgroundColor: '#D91313',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text1:{
        fontSize: 30,
        top: 10,
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
        borderColor: '#F3A2A2',
        justifyContent: 'center',
        fontSize: 20,
        
    },
    input2:{
        width: 307,
        height: 73,
        fontSize: 15,
        borderRadius: 12,
        borderWidth: 2,
        paddingLeft: 10,
        backgroundColor: 'white',
        borderColor: '#F3A2A2'
    },
    button:{
        backgroundColor: '#D91313', 
        width:221, 
        height:57,
        borderRadius:10,
        alignItems: "center",
        justifyContent: "center"
    },
    title:{
        fontSize:20,
        color: "white",
        fontFamily: "Koh Santepheap"
    }
});