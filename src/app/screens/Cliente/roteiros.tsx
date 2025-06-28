import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    FlatList
} from "react-native";
import { router } from "expo-router";

import { ButtonBack } from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";




export default function Roteiros() {

    type Roteiro = {
        id: string;
        nome: string;
        descricao: string;
        avaliacao: string;
        imagem: any;
    };

    const roteirosData: Roteiro[] =[
        {
            id: '1',
            nome: 'Alabama',
            descricao: 'Roteiro de viagem para o Alabama...',
            avaliacao: '4,8(124 mil)',
            imagem: require('../../../../assets/images/imagemExemplo.png')
        },
        {
            id: '2',
            nome: 'Paris',
            descricao: 'Conheça os pontos mais famosos...',
            avaliacao: '4,9(200 mil)',
            imagem: require('../../../../assets/images/imagemExemplo.png')
        },
        {
            id: '3',
            nome: 'Tóquio',
            descricao: 'Explore a tecnologia e a tradição...',
            avaliacao: '4,7(98 mil)',
            imagem: require('../../../../assets/images/imagemExemplo.png')
        }
    ];
    
    const renderItem = ({ item }: { item: Roteiro }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.Roteiro}
            onPress={() => router.push({ pathname: "/screens/Cliente/roteiro", params: { id: item.id } })}
        >
            <Image source={item.imagem} style={styles.imagem} />
            <Text style={styles.textRoteiro1}>{item.nome}</Text>
            <Text style={styles.textRoteiro2}>{item.descricao}</Text>
            <Text style={styles.textRoteiro2}>{item.avaliacao}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.navigate('/screens/Cliente/home1')} />
                <Text style={styles.text1}>ROTEIROS</Text>
            </View>

            <View style={styles.view3}>
                <View style={styles.subView}>
                    <TouchableOpacity style={styles.PesquisaIcon} activeOpacity={1}>
                        <Image source={require('../../../../assets/images/PesquisaIcon.png')} />
                    </TouchableOpacity>
                    <TextInput placeholder="Aonde Vamos?" style={styles.InputPesquisa} />
                </View>

                <FlatList
                    data={roteirosData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />

                <ButtonPradao title="Concluir" onPress={() => router.navigate('/screens/Cliente/home1')} />
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
        flexDirection: "column",
        flex: 1,
        gap: 17,
        paddingTop: 160,
    },
    subView: {
        width: 300,
        height: 49,
        borderRadius: 25,
        backgroundColor: 'white',
        position: 'absolute',
        top: 40,
        left: 45
    },
    text1: {
        fontSize: 20,
        color: 'white'
    },
    textRoteiro1: {
        fontSize: 20
    },
    textRoteiro2: {
        fontSize: 10
    },
    imagem: {
        width: 81,
        height: 61,
        position: 'absolute',
        left: 10
    },
    InputPesquisa: {
        flex: 1,
        paddingLeft: 50,
        fontSize: 20
    },
    PesquisaIcon: {
        position: 'absolute',
        width: 24,
        height: 24,
        left: 15,
        top: 13,
    },
    Roteiro: {
        width: 315,
        height: 79,
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#3DD019',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 100,
        marginBottom: 10
    },
});
