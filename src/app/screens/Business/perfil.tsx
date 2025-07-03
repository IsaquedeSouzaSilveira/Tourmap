import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

import { ButtonBack } from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";
import { TextErro } from "@/components/TextErro";
import { getUserId } from "@/utils/storage";
import { BASE_IP } from "@/config/api";

export default function Perfil() {
    
    const [cnpj, SetCNPJ] = useState('');
    const [telefone, SetTelefone] = useState('');
    const [NewTelefone, SetNewTelefone] = useState('');
    const [nome, SetNome] = useState('');
    const [NewNome, SetNewNome] = useState('');
    const [email, SetEmail] = useState('');
    const [senha, SetSenha] = useState('');
    const [NewSenha, SetNewSenha] = useState('');
    const [erro, SetErro] = useState('');
    const [Editar, SetEditar] = useState(false);

    const [imagemUri, setImagemUri] = useState<string | null>(null);

    useEffect(() => {
        getDados();
    }, []);

    const editarDados= async ()=>{
        
        try{
            const idUser = await getUserId();

            const resultado = await fetch(`${BASE_IP}/update/business`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: idUser,
                    newName: NewNome,
                    oldPassword: senha,
                    newPassword: NewSenha,
                    newTelefone: NewTelefone
                })
            });
            if(resultado.ok){
                SetNome(NewNome)
                SetSenha(NewSenha)
                SetEditar(false)
                return;
            }
        } catch(error){
            console.error('Erro na requisição: ', error)
        }

    }

    const atualizarImagem = async (imagemBase64: string) => {
        try {
            const idUser = await getUserId();

            const resultado = await fetch(`${BASE_IP}/update/business`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: idUser,
                    oldName: nome,
                    oldEmail: email,
                    oldPassword: senha,
                    userImageUrl: imagemBase64
                })
            });

            const res = await resultado.json();

            if (!resultado.ok) {
                console.error("Erro ao atualizar imagem: ", res.message);
                SetErro(res.message || "Erro ao atualizar imagem");
            } else {
                console.log("Imagem atualizada com sucesso");
            }

        } catch (error) {
            console.error('Erro ao enviar imagem: ', error);
            SetErro("Erro ao conectar com o servidor.");
        }
    };


    const getDados = async () => {
        try {
            const idUser = await getUserId();
    
            if (!idUser) {
                SetErro('ID do usuário não encontrado.');
                return;
            }
            const resultado = await fetch(`${BASE_IP}/get/business/id`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: idUser
                })
            });

            if (resultado.ok) {
                const data = await resultado.json();
                SetNome(data.name || '');
                SetEmail(data.email || '');
                SetSenha(data.password || '');
                setImagemUri(data.userImageUrl || '')
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
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            const imageBase64 = result.assets[0].base64;
            const imageData = `data:image/jpeg;base64,${imageBase64}`;

            setImagemUri(imageUri);

            await atualizarImagem(imageData);
        }
    };



    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.back()} />
                <Text style={styles.text1}>PERFIL</Text>
            </View>

            

                {Editar ? (

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
                            <Image source={require('../../../../assets/images/CNPJIcon.png')} style={styles.imagem} />
                            <Text style={styles.text2}>{cnpj}</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Image source={require('../../../../assets/images/iconPerson.png')} style={styles.imagem} />
                            <TextInput
                                style={styles.input}
                                placeholder="Novo Nome:"
                                onChangeText={SetNewNome}
                            />
                        </View>

                        <View style={styles.informe}>
                            <Image source={require('../../../../assets/images/email.png')} style={styles.imagem1} />
                            <Text style={styles.text2}>{email}</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Image source={require('../../../../assets/images/senha.png')} style={styles.imagem} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nova senha:"
                                secureTextEntry
                                onChangeText={SetNewSenha}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Image source={require('../../../../assets/images/TelefoneIcon.png')} style={styles.imagem} />
                            <TextInput
                                style={styles.input}
                                placeholder="Novo telefone:"
                                onChangeText={SetNewTelefone}
                            />
                        </View>

                        <ButtonPradao title="CONCLUIR" onPress={editarDados}/>
                        {erro ? TextErro(erro) : null}
                    </View>
                    
                ):(

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
                            <Image source={require('../../../../assets/images/CNPJIcon.png')} style={styles.imagem} />
                            <Text style={styles.text2}>{cnpj}</Text>
                        </View>
                        <View style={styles.informe}>
                            <Image source={require('../../../../assets/images/BusinessIcon.png')} style={styles.imagem} />
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
                        <View style={styles.informe}>
                            <Image source={require('../../../../assets/images/TelefoneIcon.png')} style={styles.imagem} />
                            <Text style={styles.text2}>{telefone}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonEditar} onPress={()=>SetEditar(true)}>
                            <Text style={styles.text3}>
                                Editar
                            </Text>
                        </TouchableOpacity>
                        {erro ? TextErro(erro) : null}
                    </View>
                )}
                
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
    text3:{
        textDecorationLine: 'underline',
        color: '#1500FF',
        fontSize: 20
    },
    imagem: {
        width: 20,
        height: 20
    },
    imagem1: {
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
    },
    buttonEditar:{
        position: 'absolute',
        bottom: '55%',
        right: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#3DD019',
        borderWidth: 2,
        borderRadius: 10,
        width: 315,
        height: 50,
        paddingHorizontal: 10,
        
    },

    input: {
        flex: 1,
        fontSize: 15,
        paddingLeft: 10,
    },
});
