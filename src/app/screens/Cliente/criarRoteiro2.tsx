import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { usePaises } from "@/hooks/usePaises";
import { usePontosTuristicos } from "@/hooks/useTouristPoints";
import { usePontosComerciais } from "@/hooks/useComercialPoints";

import { ButtonBack } from "@/components/button2";
import { ButtonPradao } from "@/components/button1";

// Tipagem unificada
type ItemUnificado =
  | {
      tipo: "pais";
      id: string;
      nome: string;
      imagem: string;
      regiao: string;
      capital: string;
      continente: string;
      populacao: string;
      area: string;
      linguas: string;
      moeda: string;
    }
  | {
      tipo: "turistico" | "comercial";
      id: string;
      nome: string;
      imagem: string;
      regiao: string;
    };

export default function Roteiros() {
  const { pais, carregando: carregandoPaises } = usePaises();
  const { pontosTuristicos, carregando: carregandoTuristicos } = usePontosTuristicos();
  const { pontos: pontosComerciais, carregando: carregandoComerciais } = usePontosComerciais();

  const [searchText, setSearchText] = useState('');
  const [roteiroSelecionado, setRoteiroSelecionado] = useState<string[]>([]);

  const { id } = useLocalSearchParams();

  const listaUnificada = useMemo((): ItemUnificado[] => {
    const paisesMapeados = pais.map((p) => ({
      tipo: "pais" as const,
      id: p.name.common,
      nome: p.name.common,
      imagem: p.flags?.png ?? "https://via.placeholder.com/150",
      regiao: p.region,
      capital: p.capital?.[0] ?? "Não informado",
      continente: p.continents?.[0] ?? "Não informado",
      populacao: p.population?.toString() ?? "Não informado",
      area: p.area?.toString() ?? "Não informado",
      linguas: p.languages ? JSON.stringify(p.languages) : "Não informado",
      moeda: p.currencies ? JSON.stringify(p.currencies) : "Não informado",
    }));

    const pontosTuristicosMapeados = pontosTuristicos.map((p) => ({
      tipo: "turistico" as const,
      id: p.id,
      nome: p.name,
      imagem: p.userImageUrl ?? "https://via.placeholder.com/150",
      regiao: p.local ?? "Desconhecida",
    }));

    const pontosComerciaisMapeados = pontosComerciais.map((p) => ({
      tipo: "comercial" as const,
      id: p.id,
      nome: p.name,
      imagem: p.userImageUrl ?? "https://via.placeholder.com/150",
      regiao: p.local ?? "Desconhecida",
    }));

    return [...paisesMapeados, ...pontosTuristicosMapeados, ...pontosComerciaisMapeados];
  }, [pais, pontosTuristicos, pontosComerciais]);

  const filteredList = useMemo(() => {
    return listaUnificada.filter((item) =>
      item.nome.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, listaUnificada]);

  const adicionarAoRoteiro = (nome: string) => {
    if (!roteiroSelecionado.includes(nome)) {
      setRoteiroSelecionado([...roteiroSelecionado, nome]);
    }
  };

  const concluirRoteiro = () => {
    router.push({
      pathname: "/screens/Cliente/criarRoteiro3",
      params: {
        paises: JSON.stringify(roteiroSelecionado ?? []),
        id: id ?? '',
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
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.Roteiro}
              onPress={() => {
                if (item.tipo === "pais") {
                  router.push({
                    pathname: "/screens/LocalDetalhes",
                    params: {
                      nome: item.nome,
                      bandeira: item.imagem,
                      regiao: item.regiao,
                      capital: item.capital,
                      continente: item.continente,
                      populacao: item.populacao,
                      area: item.area,
                      linguas: item.linguas,
                      moeda: item.moeda,
                    },
                  });
                } else {
                  router.push({
                    pathname: "/screens/PointsDetalhes",
                    params: {
                      nome: item.nome,
                      bandeira: item.imagem,
                      regiao: item.regiao,
                    },
                  });
                }
              }}
            >
              <Image source={{ uri: item.imagem }} style={styles.imagem} />
              <Text style={styles.textRoteiro1}>{item.nome}</Text>
              <Text style={styles.textRoteiro2}>{item.regiao}</Text>
              <TouchableOpacity
                style={styles.plus}
                onPress={() => adicionarAoRoteiro(item.nome)}
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
