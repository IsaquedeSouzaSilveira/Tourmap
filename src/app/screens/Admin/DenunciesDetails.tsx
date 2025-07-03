import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from "react-native";
import { router } from "expo-router";

// Componentes reutilizáveis
import { ButtonBack } from "@/components/button2/index";

// Interface para representar uma denúncia
interface DenunciationItem {
  id: string;
  idUserDenunciador: string;
  NameDenunciador: string;
  description: string;
}

export default function DenunciesDetails() {
  // Estado com dados estáticos de exemplo
  const [denunciations, setDenunciations] = useState<DenunciationItem[]>([
    {
      id: '1',
      idUserDenunciador: '1',
      NameDenunciador: 'Arthur',
      description: 'Informações incorretas.',
    },
    {
      id: '2',
      idUserDenunciador: '2',
      NameDenunciador: 'Carlos',
      description: 'Informações incorretas.',
    }
  ]);

  return (
    <View style={styles.container}>

      {/* Cabeçalho vermelho */}
      <View style={styles.headerBackground} />

      {/* Conteúdo principal */}
      <View style={styles.contentBox}>
        
        {/* Título com botão de voltar */}
        <View style={styles.header}>
          <ButtonBack onPress={() => router.back()} />
          <Text style={styles.titleText}>Revisões</Text>
        </View>

        {/* Lista de denúncias */}
        <FlatList
          data={denunciations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.denunciationCard}>
              <Text style={styles.denunciationName}>{item.NameDenunciador}</Text>
              <Text style={styles.denunciationDescription}>{item.description}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
}

// Estilos organizados por área
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0F0',
    flexDirection: "column"
  },

  headerBackground: {
    width: "100%",
    height: 173,
    backgroundColor: "#D91313",
    justifyContent: "center",
    alignItems: "center"
  },

  contentBox: {
    position: 'absolute',
    top: 60,
    left: 40,
    width: 310,
    height: "85%",
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },

  header: {
    width: '100%',
    height: 80,
    alignItems: 'center',
  },

  titleText: {
    fontSize: 24,
    fontFamily: "Konkhmer Sleokchher",
    fontWeight: "bold",
    position: 'absolute',
    top: 15
  },

  listContainer: {
    alignItems: 'center',
    gap: 10,
    flexGrow: 1
  },

  denunciationCard: {
    width: 266,
    minHeight: 92,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: "center",
    gap: 7,
    padding: 10
  },

  denunciationName: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: '600'
  },

  denunciationDescription: {
    fontSize: 10,
    fontFamily: "Poppins",
    alignSelf: "baseline"
  }
});
