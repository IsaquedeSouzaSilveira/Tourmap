import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ButtonBack } from "@/components/button2/index";
import { BASE_IP } from "@/config/api";
import { getUserId } from "@/utils/storage";

export default function SolicitationDetails() {
  const [location, setLocation] = useState("");
  const [buttonsVisible, setButtonsVisible] = useState(true);

  const params = useLocalSearchParams();
  const title = params.title;
  const description = params.description;
  const time = params.time;
  

  const aceitar = async () => {
    setButtonsVisible(false);

    try {
      const id = params.id as string;
      const Userid = await getUserId();

      if (params.origin === "PointTuristSolicitys") {
        await fetch(`${BASE_IP}/publishOn/touristPoint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idTouristPoint: id, idUser: Userid }),
        });
        router.replace({
          pathname: "/screens/Admin/PointTuristSolicitys",
          params: { removeId: id },
        });
      } else if (params.origin === "PointComercialSolicitys") {
        await fetch(`${BASE_IP}/publishOn/commercialPoint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idCommercialPoint: id, idUser: Userid}), // substitua "ADMIN_ID" se necessário
        });
        router.replace({
          pathname: "/screens/Admin/PointComercialSolicitys",
          params: { removeId: id },
        });
      }
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
    }
  };

  const negar = async () => {
    setButtonsVisible(false);

    try {
      const id = params.id as string;

      if (params.origin === "PointTuristSolicitys") {
        await fetch(`${BASE_IP}/delete/touristPoint`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idTouristPoint: id }),
        });
        router.replace({
          pathname: "/screens/Admin/PointTuristSolicitys",
          params: { removeId: id },
        });
      } else if (params.origin === "PointComercialSolicitys") {
        await fetch(`${BASE_IP}/delete/commercialPoint`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idPoint: id, idBusiness: Userid }), 
        });
        router.replace({
          pathname: "/screens/Admin/PointComercialSolicitys",
          params: { removeId: id },
        });
      }
    } catch (error) {
      console.error("Erro ao negar solicitação:", error);
    }
  };


  return (
    <View style={styles.view1}>
      <View style={styles.view2}></View>
      <View style={styles.view3}>
        <View style={styles.titleView}>
          <ButtonBack onPress={() => router.back()} />
          <Text style={styles.NotifyTitle}>{title}</Text>
        </View>

        <ScrollView style={styles.DescriptionView}>
          <Text style={styles.NotifyDescription}>{description}</Text>
          <Text style={styles.NotifyDescription}>{location}</Text>
        </ScrollView>

        {buttonsVisible && (
          <View style={styles.ButtonsView}>
            <TouchableOpacity activeOpacity={0.8} onPress={aceitar}>
              <Image source={require("../../../../assets/images/Aceito.png")} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={negar}>
              <Image source={require("../../../../assets/images/Negado.png")} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.NotifyTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    backgroundColor: "#F2F0F0",
    flexDirection: "column",
  },
  view2: {
    width: "100%",
    height: 173,
    backgroundColor: "#39B51B",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  view3: {
    alignItems: "center",
    flexDirection: "column",
    gap: 30,
    position: "absolute",
    backgroundColor: "#F6F6F6",
    width: 310,
    height: "85%",
    top: 60,
    left: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#AAAAAA",
  },
  ButtonsView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 130,
  },
  titleView: {
    width: "100%",
    height: 50,
    alignItems: "center",
  },
  DescriptionView: {
    width: "94%",
    maxHeight: "68%",
  },
  NotifyTitle: {
    fontSize: 24,
    fontFamily: "Konkhmer Sleokchher",
    fontWeight: "bold",
    position: "absolute",
    top: 15,
  },
  NotifyDescription: {
    fontSize: 14,
    fontFamily: "Poppins",
    alignSelf: "stretch",
  },
  NotifyTime: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#6E6E6E",
    fontWeight: "bold",
    position: "absolute",
    right: 25,
    bottom: 20,
  },
});
