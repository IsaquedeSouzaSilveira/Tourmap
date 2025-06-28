import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList } from "react-native";
import { router, useLocalSearchParams  } from "expo-router";

import { usePaises } from "@/hooks/usePaises";
import { ButtonBack } from "@/components/button2/index";
import { ButtonPradao } from "@/components/button1";

export default function Roteiros() {
    const { pais, carregando } = usePaises();
    const [searchText, setSearchText] = useState('');
    const [roteiroSelecionado, setRoteiroSelecionado] = useState<string[]>([]);

    const { id } = useLocalSearchParams();

    const filteredPaises = useMemo(() => {
        return pais.filter((item) => {
            const nomePais = item.name.common.toLowerCase();
            return nomePais.includes(searchText.toLowerCase());
        });
    }, [searchText, pais]);

    const adicionarAoRoteiro = (nomePais: string) => {
        if (!roteiroSelecionado.includes(nomePais)) {
            setRoteiroSelecionado([...roteiroSelecionado, nomePais]);
        }
    };

    const concluirRoteiro = () => {
        router.push({
            pathname: "/screens/Cliente/criarRoteiro3",
            params: { 
                paises: JSON.stringify(roteiroSelecionado),
                id: id
             }
        });
    };

    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.back()} />
                <Text style={styles.text1}>CRIAR ROTEIRO</Text>
            </View>

            <View style={styles.view3}>
                <View style={styles.subView}>
                    <TouchableOpacity style={styles.PesquisaIcon} activeOpacity={1}>
                        <Image source={require('../../../../assets/images/PesquisaIcon.png')} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Aonde Vamos?"
                        style={styles.InputPesquisa}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <FlatList
                    data={filteredPaises}
                    keyExtractor={(item) => item.name.common}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.Roteiro}
                            onPress={() => router.push({
                                pathname: '/screens/LocalDetalhes',
                                params: {
                                    nome: item.name.common,
                                    bandeira: item.flags.png,
                                    regiao: item.region,
                                    capital: item.capital ? item.capital[0] : 'Não informado',
                                    continente: item.continents ? item.continents[0] : 'Não informado',
                                    populacao: item.population?.toString() || 'Não informado',
                                    area: item.area?.toString() || 'Não informado',
                                    linguas: item.languages ? JSON.stringify(item.languages) : 'Não informado',
                                    moeda: item.currencies ? JSON.stringify(item.currencies) : 'Não informado'
                                },
                            })}
                        >
                            <Image source={{ uri: item.flags.png }} style={styles.imagem} />
                            <Text style={styles.textRoteiro1}>{item.name.common}</Text>
                            <Text style={styles.textRoteiro2}>{item.region}</Text>
                            <TouchableOpacity
                                style={styles.plus}
                                onPress={() => adicionarAoRoteiro(item.name.common)}
                            >
                                <Image source={require('../../../../assets/images/Plus.png')} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ padding: 10 }}
                />

                <ButtonPradao title="Concluir" onPress={concluirRoteiro} />
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
    plus: {
        position: 'absolute',
        left: 260
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
        paddingLeft: 100
    },
});
