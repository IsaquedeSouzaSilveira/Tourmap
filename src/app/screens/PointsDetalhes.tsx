import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ButtonBack } from '@/components/button2';

export default function PointsDetalhes() {

  const [favorita, setFavorita] = useState(false);
  const [Avaliacao, setAvaliacao] = useState(0);

  const params = useLocalSearchParams();

  const getStringParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) return param[0];
    return param || '';
  };

  const nome = getStringParam(params.nome);
  const descricao = getStringParam(params.descricao);
  const imagem = getStringParam(params.imagem);
  const local = getStringParam(params.local);
  const id = getStringParam(params.id);

  const favoritar =()=>{
    setFavorita(!favorita);
  }

  const avaliacao = (index: number) => {
    setAvaliacao(index);
  }

  return (
    <View style={styles.view1}>
      
      <View style={styles.header}>
        <ButtonBack onPress={()=> router.back()}/>
        <Text style={styles.text1}>{nome}</Text>
        <Text style={styles.text2}>{local}</Text>
      </View>

      
      <ScrollView showsVerticalScrollIndicator={false}>

        <Image style={styles.imagem} source={{ uri: imagem }}/>

        <View style={styles.SobreView}>
          <Text style={styles.sobreTitulo}>Sobre</Text>
          <Text style={styles.sobreTexto}>{descricao}</Text>

          <TouchableOpacity onPress={favoritar} style={styles.Heart}>

            <FontAwesome
              name="heart"
              size={25}
              color={favorita ? 'red' : 'gray'}
            />

          </TouchableOpacity>
          
        </View>

        <View style={styles.Subview}>

          <Text style={styles.AvaliacaoText}>Avaliação:</Text>

          <View style={styles.AvaliacaoView}>
            {[1, 2, 3, 4, 5].map((index) => (
              <TouchableOpacity key={index} onPress={()=>avaliacao(index)} activeOpacity={1}>
                <FontAwesome
                  name="star"
                  size={24}
                  color={Avaliacao >= index ? 'gold' : 'gray'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.DenunciaButton} 
            activeOpacity={0.8}
            onPress={()=>router.push({
              pathname: '/screens/Cliente/denuncia',
              params:{
        
              }
              })
            }
          >
            <Image source={require('../../../assets/images/DenunciaIcon.png')} style={styles.DenunciaImage}/>
          </TouchableOpacity>

        </View>
        
        <View style={styles.ComentsView}>

          <Text style={styles.ComentText}>Deixe seu comentário:</Text>
          <TextInput placeholder='Comente:' style={styles.ComentInput}/>

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