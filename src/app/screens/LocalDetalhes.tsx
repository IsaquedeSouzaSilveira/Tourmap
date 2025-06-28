import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView  } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { ButtonBack } from '@/components/button2';

export default function LocalDetalhes() {


  const params = useLocalSearchParams();

  const getStringParam = (param: string | string[] | undefined): string => {
      if (Array.isArray(param)) return param[0];
      return param || ''; 
  };

  const nome = getStringParam(params.nome);
  const bandeira = getStringParam(params.bandeira);
  const regiao = getStringParam(params.regiao);    
  const capital = getStringParam(params.capital);
  const continente = getStringParam(params.continente);
  const populacao = getStringParam(params.populacao);
  const area = getStringParam(params.area);
  const linguas = getStringParam(params.linguas);
  const moeda = getStringParam(params.moeda);

  const linguasObj = linguas ? JSON.parse(linguas) : {};
  interface MoedaInfo {
    name: string;
    symbol: string;
  }

  const moedaObj: Record<string, MoedaInfo> = moeda ? JSON.parse(moeda) : {};
  const moedaValores = Object.values(moedaObj)[0];

  const moedaNome = moedaValores?.name || 'Não informado';
  const moedaSimbolo = moedaValores?.symbol || '';

  const linguasFormatadas = Object.values(linguasObj).join(', ');
    

  return (
    <View style={styles.view1}>
      
      <View style={styles.header}>
        <ButtonBack onPress={()=> router.back()}/>
        <Text style={styles.text1}>{nome}</Text>
        <Text style={styles.text2}>{regiao}</Text>
      </View>

      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: bandeira }} style={styles.imagem} />
        <View style={styles.SobreView}>
          <Text style={styles.sobreTitulo}>Sobre</Text>
            <Text style={styles.sobreTexto}>
                Capital: {capital}{"\n"}
                Continente: {continente}{"\n"}
                População: {populacao} habitantes{"\n"}
                Área: {area} km²{"\n"}
                Línguas oficiais: {linguasFormatadas}{"\n"}
                Moeda oficial: {moedaNome} {moedaSimbolo}
            </Text>

        </View>
        <View style={styles.Subview}>
            <TouchableOpacity 
              style={styles.DenunciaButton} 
              activeOpacity={0.8}
              onPress={()=>router.push({
                pathname: '/screens/Cliente/denuncia',
                params:{
                  name: nome
                }
              })
              }
            >
              <Image source={require('../../../assets/images/DenunciaIcon.png')} style={styles.DenunciaImage}/>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
      flex: 1,
      backgroundColor: '#F2F0F0',
  },
  SobreView:{
    width: '100%',
    height: 240
  },
  AvaliacaoView:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width:160,
    gap: 10,
    left:20,
    marginTop:8
  },
  Subview:{
    borderTopWidth:2,
    borderColor: '#D8D8D8',
    width:'100%',
    height:100
  },
  ComentsView:{
    width: '100%',
    height: '100%',
    borderTopWidth:2,
    borderColor: '#D8D8D8',
    backgroundColor: '#F4F4F4'
  },
  header: {
      flexDirection: 'column',
      width: '100%',
      height: 70
  },
  backIcon: {
      width: 24,
      height: 24,
  },
  text1: {
      fontSize: 25,
      left: 50,
      top: 10
  },
  text2: {
      fontSize: 15,
      fontFamily: 'League Spartan',
      color: '#7C7C7C',
      left: 53,
      top: 10
  },
  AvaliacaoText:{
    fontSize: 19,
    left:25,
    marginTop: 10
  },
  ComentText:{
    fontSize: 14,
    left: 20,
    marginTop: 5
  },
  locateIcon: {
      width: 24,
      height: 24,
  },
  imagem: {
      width: '100%',
      height: 262,
      borderRadius: 10,
      marginBottom: 8,
  },
  DenunciaButton:{
    position: 'absolute',
    right:11,
    top: 8
  },
  DenunciaImage:{
    width: 33.5,
    height: 33.5
  },
  sobreTitulo: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
      alignSelf: "flex-start",
      left: 25
  },
  sobreTexto: {
      fontSize: 15,
      color: "#7A7A7A",
      alignSelf: "flex-start",
      left: 25
  },
  Heart:{
    position: 'absolute',
    right: 13
  },
  ComentInput:{
    width: '84%',
    height: 50,
    fontSize: 15,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    left: '8%',
    marginTop:10
  },

});