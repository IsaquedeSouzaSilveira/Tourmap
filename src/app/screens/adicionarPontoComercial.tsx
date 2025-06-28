import React, { useState } from "react";
import { View, Text ,TouchableOpacity, Image, StyleSheet, TextInput } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

import { getUserId } from "@/utils/storage";
import { ButtonBack } from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";

export default function AdicionarPontoComercial(){

    const [nome, SetNome] = useState('');
    const [descricao, SetDescricao]= useState('');
    const [estado, SetEstado]= useState('');
    const [cidade, SetCidade]= useState('');
    const [bairro, SetBairro]= useState('');
    const [rua, SetRua]= useState('');
    const [erro, SetErro]= useState('');

    const [imagemUri, setImagemUri] = useState<string | null>(null);

    const escolherImagem = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permissão para acessar a galeria foi negada!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImagemUri(result.assets[0].uri);
        }
    };

    const solicitar = async () => {
        const localizacao = `Estado: ${estado}, cidade: ${cidade}, bairro: ${bairro}, rua: ${rua}`;
        const data = new Date();
        const userId = await getUserId();

        try {
            const resultado = await fetch("http://192.168.72.107:3333/register/commercialPoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: userId,
                    name: nome,
                    local: localizacao,
                    description: descricao,
                    creationDate: data,
                })
            });

            if (resultado.ok) {
                console.log('Deu certo');
                SetErro('');
                console.log('Solicitação feita com sucesso.');
                router.back();
            } else {
                const data = await resultado.json();
                SetErro(data.message || 'Erro ao registrar');
                return;
            }
        } catch (error) {
            console.log('Erro ao solicitar o registro do ponto turístico: ', error);
            return;
        }
    }

    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.back()} />
                <Text style={styles.text1}>Adicionar Ponto Comercial</Text>
            </View>

            <View style={styles.view3}>
                <View style={styles.subView}>
                    <TouchableOpacity onPress={escolherImagem}>
                        <Image
                            source={
                                imagemUri
                                    ? { uri: imagemUri }
                                    : require('../../../assets/images/PerfilIcon2.png')
                            }
                            style={{ width: 80, height: 80, borderRadius: 10 }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text1}>Fotos do P.Comercial</Text>
                </View>

                <TextInput placeholder="Nome" style={styles.input} onChangeText={SetNome} />
                <TextInput placeholder="Estado" style={styles.input} onChangeText={SetEstado} />
                <TextInput placeholder="Cidade" style={styles.input} onChangeText={SetCidade} />
                <TextInput placeholder="Bairro" style={styles.input} onChangeText={SetBairro} />
                <TextInput placeholder="Rua" style={styles.input} onChangeText={SetRua} />
                <TextInput placeholder="Descrição" style={styles.input} onChangeText={SetDescricao} />
                <ButtonPradao title="ENVIAR" onPress={solicitar} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view1: {
        flex: 1,
        backgroundColor: '#F2F0F0',
        flexDirection: "column"
    },
    view2: {
        width: "100%",
        height: 150,
        backgroundColor: "#39B51B",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: 20
    },
    view3: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flex: 1,
        gap: 10,
        paddingTop: 90,
    },
    subView: {
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        gap: 25,
        top: 1,
        height: 120
    },
    text1: {
        fontSize: 20
    },
    input: {
        width: 315,
        height: 40,
        borderRadius: 10,
        borderColor: '#3DD019',
        borderWidth: 2,
        backgroundColor: 'white',
        paddingLeft: 20,
        fontSize: 15
    }
});