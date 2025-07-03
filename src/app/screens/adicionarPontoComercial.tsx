import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

import { getUserId } from "@/utils/storage";
import { ButtonBack } from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";
import { BASE_IP } from "@/config/api";

export default function adicionarPontoTuristico() {
    const [nome, SetNome] = useState('');
    const [descricao, SetDescricao] = useState('');
    const [estado, SetEstado] = useState('');
    const [cidade, SetCidade] = useState('');
    const [bairro, SetBairro] = useState('');
    const [rua, SetRua] = useState('');
    const [erro, SetErro] = useState('');

    const [imagensUris, setImagensUris] = useState<string[]>([]);

    const escolherImagem = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permissão para acessar a galeria foi negada!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const novaImagem = result.assets[0].uri;
            setImagensUris((prev) => [...prev, novaImagem]);
        }
    };

    const solicitar = async () => {
        
        const localizacao = `Estado: ${estado}, cidade: ${cidade}, bairro: ${bairro}, rua: ${rua}`;
        const data = new Date();
        const userId = await getUserId();

        try {
            const resultado = await fetch(`${BASE_IP}/register/commercialPoint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: userId,
                    name: nome,
                    description: descricao,
                    creationDate: data,
                    local: localizacao
                })
            });
            
            const responseJson = await resultado.json();

            if (!resultado.ok) {
                console.log( responseJson.message || 'Erro ao registrar')
                SetErro(responseJson.message || 'Erro ao registrar');
                return;
            }

            const idTouristPoint = responseJson.response?.id;
            if (!idTouristPoint) {
                SetErro('ID do ponto comercial não retornado.');
                return;
            }

            for (const imagem of imagensUris) {
                await fetch(`${BASE_IP}/create/image/commercialPoint`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idUser: userId,
                        idCommercialPoint: idTouristPoint,
                        ImageUrl: imagem
                    })
                });
            }

            SetErro('');
            console.log('Ponto turístico e imagens enviados com sucesso');
            router.back();

        } catch (error) {
            console.log('Erro ao solicitar o registro do ponto turistico: ', error);
            SetErro('Erro interno ao enviar os dados');
        }
    };


    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.back()} />
                <Text style={styles.text1}>Adicionar Ponto Turístico</Text>
            </View>

            <ScrollView contentContainerStyle={styles.view3}>
                <View style={styles.subView}>
                    

                    {imagensUris.length === 0 ?(
                        <TouchableOpacity onPress={escolherImagem}>
                            <Image
                                source={require('../../../assets/images/PerfilIcon2.png')}
                                style={styles.imagem}
                            />
                        </TouchableOpacity>
                    ):(
                        <ScrollView horizontal contentContainerStyle={{ gap: 10 }} style={{width: 315}}>
                                {imagensUris.map((uri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setImagensUris(prev => prev.filter((_, i) => i !== index));
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Image source={{ uri }} style={styles.imagem} />
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity onPress={escolherImagem} style={{justifyContent: 'center', marginLeft: 10}}>
                                    <Image source={require('../../../assets/images/Plus.png')}/>
                                </TouchableOpacity>
                        </ScrollView>
                    )}

                </View>

                <TextInput placeholder="Nome" style={styles.input} onChangeText={SetNome} />
                <TextInput placeholder="Estado" style={styles.input} onChangeText={SetEstado} />
                <TextInput placeholder="Cidade" style={styles.input} onChangeText={SetCidade} />
                <TextInput placeholder="Bairro" style={styles.input} onChangeText={SetBairro} />
                <TextInput placeholder="Rua" style={styles.input} onChangeText={SetRua} />
                <TextInput placeholder="Descrição" style={styles.input} onChangeText={SetDescricao} />
                <ButtonPradao title="ENVIAR" onPress={solicitar} />
            </ScrollView>
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
        gap: 10,
        paddingTop: 90,
        paddingBottom: 50,
    },
    subView: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 15,
        gap: 10,
        marginBottom: 10,
        top: -50
    },
    imagem: {
        width: 80,
        height: 80,
        borderRadius: 10,
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
