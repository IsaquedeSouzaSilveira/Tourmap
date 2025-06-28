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

export default function Roteiro() {
  const { paises, id } = useLocalSearchParams();
  const paisesSelecionados = JSON.parse(paises as string);
  const [roteiroSalvo, SetSalvarRoteiro] = useState(false);
  const [roteiro, setRoteiro] = useState<{ title: string; description: string } | null>(null);

  const { pais: todosPaises } = usePaises();
  const [paisesExibidos, setPaisesExibidos] = useState<any[]>([]);

  useEffect(() => {
    const buscarRoteiro = async () => {
      const idCreator = await getUserId();
      try {
        const response = await fetch("http://192.168.72.107:3333/get/roadMap", {
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

  useEffect(() => {
    const filtrados = todosPaises.filter(p =>
      paisesSelecionados.includes(p.name.common)
    );
    setPaisesExibidos(filtrados);
  }, [todosPaises]);

  const removerPais = (nome: string) => {
    setPaisesExibidos(prev => prev.filter(p => p.name.common !== nome));
  };

  const salvar = async () => {
    SetSalvarRoteiro(true);
    return;
  };

  const publicar = async () => {
    const idCreator = await getUserId();

    try {
      const response = await fetch("http://192.168.72.107:3333/published/roadMap", {
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
            data={paisesExibidos}
            keyExtractor={(item) => item.name.common}
            renderItem={({ item }) => (
              <View style={styles.Roteiro}>
                <Image source={{ uri: item.flags.png }} style={styles.imagem} />
                <Text style={styles.textRoteiro1}>{item.name.common}</Text>
                <Text style={styles.textRoteiro2}>População: {item.population?.toLocaleString() || "N/A"}</Text>
                <Text style={styles.textRoteiro2}>Área: {item.area?.toLocaleString() || "N/A"} km²</Text>
                <TouchableOpacity
                  style={styles.remove}
                  onPress={() => removerPais(item.name.common)}
                >
                  <Image source={require('../../../../assets/images/remove.png')} />
                </TouchableOpacity>
              </View>
            )}
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
  button: {
    width: 103,
    height: 31,
    borderRadius: 10,
    bottom: 20,
    backgroundColor: '#39B51B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  }
});
