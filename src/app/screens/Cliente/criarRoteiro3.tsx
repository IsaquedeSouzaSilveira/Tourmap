import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ButtonBack } from "@/components/button2/index";
import { usePaises } from "@/hooks/usePaises";
import { getUserId } from "@/utils/storage";
import { BASE_IP } from "@/config/api";

// Defina o tipo unificado (exemplo):
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

export default function Roteiro() {
  // Recebe os locais selecionados como JSON string
  const { locaisSelecionados, id } = useLocalSearchParams();
  let locais: ItemUnificado[] = [];

  try {
    if (typeof locaisSelecionados === "string") {
      locais = JSON.parse(locaisSelecionados) as ItemUnificado[];
    } else {
      console.warn("locaisSelecionados não é uma string:", locaisSelecionados);
    }
  } catch (e) {
    console.error("Erro ao parsear locaisSelecionados:", e);
  }

  const [roteiroSalvo, setRoteiroSalvo] = useState(false);
  const [roteiro, setRoteiro] = useState<{ title: string; description: string } | null>(null);

  // Estado local que controla os locais exibidos (pode ser atualizado)
  const [locaisExibidos, setLocaisExibidos] = useState<ItemUnificado[]>([]);

  useEffect(() => {
    // Inicializa com os locais selecionados recebidos
    setLocaisExibidos(locais);
  }, [locais]);

  useEffect(() => {
    const buscarRoteiro = async () => {
      const idCreator = await getUserId();
      try {
        const response = await fetch(`${BASE_IP}/get/roadMap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, idCreator })
        });

        const data = await response.json();

        if (response.ok && data.response) {
          setRoteiro({
            title: data.response.title,
            description: data.response.description
          });
        }
      } catch (error) {
        console.log("Erro ao buscar roteiro:", error);
      }
    };

    if (id) buscarRoteiro();
  }, [id]);

  // Função para remover um local pelo id
  const removerLocal = (id: string) => {
    setLocaisExibidos(prev => prev.filter(item => item.id !== id));
  };

  const salvar = async () => {
    const idCreator = await getUserId();

    // Pegando dados do roteiro
    const country = locaisExibidos.find(item => item.tipo === "pais")?.nome;
    const state = locaisExibidos.find(item => item.tipo === "pais")?.regiao;
    const city = locaisExibidos.find(item => item.tipo === "pais")?.capital;

    const idCommercialPoint = locaisExibidos.find(item => item.tipo === "comercial")?.id;
    const idTouristingPoint = locaisExibidos.find(item => item.tipo === "turistico")?.id;

    try {
      const response = await fetch(`${BASE_IP}/update/roadMap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idRoadMap: id,
          idCreator,
          country,
          state,
          city,
          idCommercialPoint,
          idTouristingPoint
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Roteiro salvo com sucesso:", data.message);
        setRoteiroSalvo(true);
      } else {
        console.log("Erro ao salvar roteiro:", data.message);
      }
    } catch (error) {
      console.log("Erro na requisição de salvar:", error);
    }
  };

  const publicar = async () => {
    const idCreator = await getUserId();

    try {
      const response = await fetch(`${BASE_IP}/published/roadMap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, idCreator })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Roteiro publicado com sucesso");
        router.replace('/screens/Cliente/roteiros');
      } else {
        console.log("Erro ao publicar roteiro:", data.message);
      }
    } catch (error) {
      console.log("Erro na requisição de publicação:", error);
    }
  };

  // Renderização condicional para cada tipo
  const renderItem = ({ item }: { item: ItemUnificado }) => {
    if (item.tipo === "pais") {
      return (
        <View style={styles.Roteiro}>
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
          <Text style={styles.textRoteiro1}>{item.nome}</Text>
          <Text style={styles.textRoteiro2}>Região: {item.regiao}</Text>
          <Text style={styles.textRoteiro2}>Capital: {item.capital}</Text>
          <Text style={styles.textRoteiro2}>População: {item.populacao}</Text>
          <Text style={styles.textRoteiro2}>Área: {item.area} km²</Text>
          <TouchableOpacity
            style={styles.remove}
            onPress={() => removerLocal(item.id)}
          >
            <Image source={require('../../../../assets/images/remove.png')} />
          </TouchableOpacity>
        </View>
      );
    } else if (item.tipo === "turistico" || item.tipo === "comercial") {
      return (
        <View style={styles.Roteiro}>
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
          <Text style={styles.textRoteiro1}>{item.nome}</Text>
          <Text style={styles.textRoteiro2}>Região: {item.regiao}</Text>
          <TouchableOpacity
            style={styles.remove}
            onPress={() => removerLocal(item.id)}
          >
            <Image source={require('../../../../assets/images/remove.png')} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.view1}>
      <View style={styles.view2}>
        {roteiroSalvo ? (
          <ButtonBack onPress={() => router.replace('/screens/Cliente/meusRoteiros')} />
        ) : (
          <ButtonBack onPress={() => router.back()} />
        )}
        <Text style={styles.text1}>ROTEIRO</Text>
      </View>

      <View style={styles.view3}>
        <View style={styles.subView1}>
          {roteiro && (
            <>
              <Text style={styles.text2}>Nome: {roteiro.title}</Text>
              <Text style={styles.text2}>Descrição: {roteiro.description}</Text>
            </>
          )}
          <Text style={styles.text3}>Locais:</Text>
        </View>

        <View style={styles.subView2}>
          <FlatList
            data={locaisExibidos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
          />

          {roteiroSalvo ? (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.textButton} onPress={publicar}>Publicar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.textButton} onPress={salvar}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>
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
    flexDirection: "column",
    flex: 1,
    alignItems: 'center'
  },
  subView1: {
    width: '100%',
    height: 260,
    gap: 20,
    paddingTop: 20,
    paddingLeft: 10
  },
  subView2: {
    width: '94%',
    height: 315,
    top: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text1: {
    fontSize: 20,
    color: 'white'
  },
  text2: {
    fontSize: 16
  },
  text3: {
    fontSize: 24
  },
  textRoteiro1: {
    fontSize: 15
  },
  textRoteiro2: {
    fontSize: 10
  },
  textButton: {
    fontSize: 20,
    color: 'white'
  },
  imagem: {
    width: 81,
    height: 61,
    position: 'absolute',
    left: 10
  },
  remove: {
    position: 'absolute',
    left: 260
  },
  button: {
    width: 103,
    height: 31,
    borderRadius: 10,
    bottom: 20,
    backgroundColor: '#39B51B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
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
    marginBottom: 10,
  },
});
