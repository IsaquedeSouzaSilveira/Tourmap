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
import { FontAwesome } from '@expo/vector-icons';

import { ButtonBack } from "@/components/button2/index";
import { getUserId } from "@/utils/storage";

export default function Roteiro() {
    const { id } = useLocalSearchParams();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [pontos, setPontos] = useState<any[]>([]);

    const [favorita, setFavorita] = useState(false);
    const [Avaliacao, setAvaliacao] = useState(0);
  
    const favoritar =()=>{
      setFavorita(!favorita);
    }

    useEffect(() => {
        const fetchRoadMap = async () => {
        try {
            const idCreator = await getUserId();
            const response = await fetch("http://192.168.72.107:3333/get/roadMap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, idCreator })
            });

            const json = await response.json();
            if (response.ok && json.response) {
            setTitulo(json.response.title);
            setDescricao(json.response.description);
            setPontos([
                ...(json.response.Touristing_Point || []),
                ...(json.response.Commercial_Point || [])
            ]);
            }
        } catch (err) {
            console.log("Erro ao buscar dados do roteiro:", err);
        }
        };

        fetchRoadMap();
    }, []);

    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <ButtonBack onPress={() => router.back()} />
                <Text style={styles.text1}>ROTEIRO</Text>
            </View>

            <View style={styles.view3}>
                <View style={styles.subView1}>
                    <Text style={styles.text2}>Título: {titulo}</Text>
                    <Text style={styles.text2}>Descrição: {descricao}</Text>
                    <Text style={styles.text3}>Locais:</Text>
                    <TouchableOpacity onPress={favoritar} style={styles.heart}>
                        <FontAwesome
                        name="heart"
                        size={25}
                        color={favorita ? 'red' : 'gray'}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={pontos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.Roteiro}>
                            <Text style={styles.textRoteiro1}>{item.nome || item.name}</Text>
                            <Text style={styles.textRoteiro2}>{item.descricao || item.description}</Text>
                        </View>
                    )}
                />
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
  Roteiro: {
    width: 315,
    height: 79,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#3DD019',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingLeft: 15,
    marginBottom: 10
  },
  heart: {
    position: 'absolute',
    width: 25,
    height: 25,
    right: 15,
    bottom: 10
  },

});
