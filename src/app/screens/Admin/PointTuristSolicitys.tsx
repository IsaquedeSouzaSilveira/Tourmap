import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import axios from "axios";

import { ButtonBack } from "@/components/button2/index";
import { BASE_IP } from "@/config/api"; // Certifique-se que esta constante exista

export default function PointTuristSolicitys() {
  interface PontoTuristico {
    id: string;
    name: string;
    description: string;
    creationDate: string; // ou Date, dependendo do formato retornado
  }

  interface SolicitationItem {
    id: string;
    title: string;
    description: string;
    time: string;
  }

  const [solicitations, setSolicitations] = useState<SolicitationItem[]>([]);
  const params = useLocalSearchParams();

  // Remove item da lista quando voltar da tela de detalhes
  useFocusEffect(
    React.useCallback(() => {
      if (params?.removeId) {
        setSolicitations((prev) =>
          prev.filter((s) => s.id !== params.removeId)
        );
      }
    }, [params?.removeId])
  );

  // Requisição para pegar pontos turísticos não publicados
  useEffect(() => {
    async function fetchUnpublishedPoints() {
      try {
        const response = await axios.get(
          `http://${BASE_IP}:3333/get/notPublished/touristPoint`
        );
        const data: PontoTuristico[] = response.data.response;

        const formatted: SolicitationItem[] = data.map((item) => ({
          id: item.id,
          title: item.name,
          description: item.description,
          time: new Date(item.creationDate).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setSolicitations(formatted);
      } catch (error) {
        console.error("Erro ao buscar pontos turísticos não publicados:", error);
      }
    }

    fetchUnpublishedPoints();
  }, []);

  const renderItem = ({ item }: { item: SolicitationItem }) => (
    <TouchableOpacity
      style={styles.SolicityButton}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/screens/Admin/PointSolicityDetails",
          params: {
            id: item.id,
            title: item.title,
            description: item.description,
            time: item.time,
            origin: "PointTuristSolicitys",
          },
        })
      }
    >
      <Image
        source={require("../../../../assets/images/NotificationLocaleIcon.png")}
        style={{ left: 5 }}
      />
      <View style={styles.subView}>
        <Text style={styles.SolicityTitle}>{item.title}</Text>
        <Text style={styles.SolicityDescription}>{item.description}</Text>
      </View>
      <Text style={styles.SolicityTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.view1}>
      <View style={styles.view2}></View>

      <View style={styles.view3}>
        <View style={styles.titleView}>
          <ButtonBack onPress={() => router.back()} />
          <Text style={styles.text1}>Solicitações</Text>
        </View>

        <FlatList
          data={solicitations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            alignItems: "center",
            gap: 10,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <View style={styles.NoneSolicityView}>
              <Text style={styles.TextNoneSolicity}>
                Nenhuma solicitação por aqui ainda
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    view1:{
        flex:1, 
        backgroundColor: '#F2F0F0', 
        flexDirection:"column"
    },
    view2:{
        width:"100%",
        height:173,
        backgroundColor: "#39B51B", 
        justifyContent: "center",
        alignItems:"center", 
        flexDirection:"column"
    },
    view3:{
        alignItems:"center", 
        justifyContent: "center",
        flexDirection:"column",
        gap: 10,
        position: 'absolute',
        backgroundColor: '#F6F6F6',
        width: 310,
        height:"85%",
        top: 60,
        left: 40,
        borderRadius: 15,
        borderWidth:1,
        borderColor: '#AAAAAA'
    },
    titleView:{
        width: '100%',
        height: 80,
        alignItems: 'center'
    },
    subView:{
        justifyContent: 'center',
        width:130,
        gap: 5
    },
    NoneSolicityView:{
        flex: 1,
        width: 266,
        marginBottom: 40,
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap:20
    },
    SolicityButton:{
        width: 266,
        height: 92,
        alignItems:"center",
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        gap: 7,
    },
    imagem1:{
        width:80, 
        height:80
    },
    text1:{
        fontSize: 24,
        fontFamily:"Konkhmer Sleokchher", 
        fontWeight: "bold",
        position: 'absolute',
        top:15 
    },
    SolicityTitle:{
        fontSize: 15,
        fontFamily:"Poppins",
    },
    SolicityDescription:{
        fontSize: 10,
        fontFamily:"Poppins",
        alignSelf: "baseline"
    },
    SolicityTime:{
        fontSize: 13,
        fontFamily:"Poppins",
        color: '#6E6E6E',
        fontWeight: 'bold',
        left: 20
    },
    TextNoneSolicity:{
        fontSize: 13,
        fontWeight: 'bold',
    }
});