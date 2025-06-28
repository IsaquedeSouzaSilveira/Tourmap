import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

import { ButtonBack } from "@/components/button2/index";
import { TextErro } from "@/components/TextErro";
import { getUserId } from "@/utils/storage";

export default function Perfil() {
    
    const [nome, SetNome] = useState('');
    const [email, SetEmail] = useState('');
    const [senha, SetSenha] = useState('');
    const [erro, SetErro] = useState('');
    const [imagemUri, setImagemUri] = useState<string | null>(null);

    useEffect(() => {
        getDados();
    }, []);

    const getDados = async () => {
        try {
            const idUser = await getUserId();
            if (!idUser) {
                SetErro('ID do usuário não encontrado.');
                return;
            }

            const resultado = await fetch(`http://192.168.72.107:3333/get/admin/${idUser}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (resultado.ok) {
                const data = await resultado.json();
                SetNome(data.name || '');
                SetEmail(data.email || '');
                SetSenha(data.password || '');
                SetErro('');
            } else {
                const data = await resultado.json();
                SetErro(data.message || 'Erro ao obter informações do usuário');
            }
        } catch (error) {
            console.log('Erro na requisição: ', error);
            SetErro('Erro na conexão com o servidor.');
        }
    };

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

    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.back()} />
                <Text style={styles.text1}>PERFIL</Text>
            </View>

            <View style={styles.view3}>
                <View style={styles.subView}>
                    <TouchableOpacity onPress={escolherImagem}>
                        <Image
                            source={
                                imagemUri
                                    ? { uri: imagemUri }
                                    : require('../../../../assets/images/PerfilIcon2.png')
                            }
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.informe}>
                    <Image source={require('../../../../assets/images/iconPerson.png')} style={styles.imagem} />
                    <Text style={styles.text2}>{nome}</Text>
                </View>
                <View style={styles.informe}>
                    <Image source={require('../../../../assets/images/email.png')} style={styles.imagem} />
                    <Text style={styles.text2}>{email}</Text>
                </View>
                <View style={styles.informe}>
                    <Image source={require('../../../../assets/images/senha.png')} style={styles.imagem} />
                    <Text style={styles.text2}>{senha}</Text>
                </View>

                {erro ? TextErro(erro) : null}
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
        justifyContent: 'center',
        flexDirection: "column",
    },
    view3: {
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
        gap: 17,
        paddingTop: 160,
    },
    subView: {
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 1,
        height: 120
    },
    text1: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#B2F3A2'
    },
    text2: {
        fontSize: 20
    },
    imagem: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 10
    },
    informe: {
        width: 315,
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        paddingLeft: 40,
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: '#3DD019',
        justifyContent: 'center',
    }
});
