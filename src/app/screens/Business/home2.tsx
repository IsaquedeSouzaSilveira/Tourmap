import { FlatList, View, TouchableOpacity, StyleSheet, Image, Text, TextInput, ActivityIndicator, Animated, Dimensions } from "react-native";
import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import { usePaises } from '../../../hooks/usePaises';
import { getUserId, getUserType  } from "@/utils/storage";
import * as Location from 'expo-location';

export default function Home1() {
    const { pais, carregando } = usePaises();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width))[0];
    const [searchText, setSearchText] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    
    const [localizacaoTexto, setLocalizacaoTexto] = useState('Carregando...');

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});

                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });

                if (reverseGeocode.length > 0) {
                    const place = reverseGeocode[0];
                    const pais = place.country || 'País';
                    const estado = place.region || 'Estado';
                    const cidade = place.city || place.subregion || 'Cidade';
                    setLocalizacaoTexto(`${pais} | ${estado} | ${cidade}`);
                }
            } else {
                setLocalizacaoTexto('Permissão negada');
            }
        })();
    }, []);

    const toggleMenu = () => {
        if (!isMenuOpen) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
            setIsMenuOpen(true);
        } else {
            Animated.timing(slideAnim, {
                toValue: -Dimensions.get('window').width,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsMenuOpen(false));
        }
    };

    
    const filteredPaises = pais.filter(item => 
        item.name.common.toLowerCase().startsWith(searchText.toLowerCase())
    );

    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                <TouchableOpacity onPress={toggleMenu}>
                    <Image source={require('../../../../assets/images/MenuIcon.png')} style={styles.MenuIcon}/>
                </TouchableOpacity>
                <Image source={require("../../../../assets/images/IconLocate.png")} style={styles.LocateIcon}/>
                <Text style={styles.Text1}>{localizacaoTexto}</Text>

                <View style={styles.SubView}>
                    
                    <Image source={require('../../../../assets/images/PesquisaIcon.png')} style={styles.PesquisaIcon}/>

                    <TextInput 
                        placeholder="Aonde Vamos?" 
                        style={styles.InputPesquisa}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <TouchableOpacity style={styles.FilterIcon} activeOpacity={0.8} onPress={() =>setMostrarFiltros(view => !view)}>
                        <Image source={require('../../../../assets/images/FilterIcon.png')} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.NotifyIcon} activeOpacity={0.8}>
                    <Image source={require('../../../../assets/images/NotifyIcon.png')}/>
                </TouchableOpacity>
            </View>

            <View style={styles.view3}>
                {mostrarFiltros ? (
                    <View style={styles.view3}>
                        
                        <View style={styles.FiltrosView}>
                            <TouchableOpacity style={styles.FiltroButton}>
                                <Text>⭐ ⭐ ⭐ ⭐ ⭐ ▼</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.FiltroButton}>
                                <Text>Categorias ▼</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.FiltrosView}>
                            <TouchableOpacity style={styles.FiltroButton}>
                                <Text>Locais ▼</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.FiltroButton}>
                                <Text>Idiomas ▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.view3}>
                        <Text style={styles.text2}>Destaques</Text>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Business/home1')}>
                        <Image source={require('../../../../assets/images/Home.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Business/home3')}>
                        <Image source={require('../../../../assets/images/Heart.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Business/home4')}>
                        <Image source={require('../../../../assets/images/locale.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Business/home5')}>
                        <Image source={require('../../../../assets/images/Comercio.png')} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            
            {carregando ? (
                <ActivityIndicator size="large" color="#39B51B" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredPaises}
                    keyExtractor={(item) => item.name.common}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: '/screens/LocalDetalhes',
                                params: {
                                    nome: item.name.common,
                                    bandeira: item.flags.png,
                                    regiao: item.region,
                                    capital: item.capital ? item.capital[0] : 'Não informado',
                                    continente: item.continents ? item.continents[0] : 'Não informado',
                                    populacao: item.population ? item.population.toString() : 'Não informado',
                                    area: item.area ? item.area.toString() : 'Não informado',
                                    linguas: item.languages ? JSON.stringify(item.languages) : 'Não informado',
                                    moeda: item.currencies ? JSON.stringify(item.currencies) : 'Não informado'
                                },
                            })}
                            style={styles.countryItem}
                        >
                            <Image source={{ uri: item.flags.png }} style={styles.flag} />
                            <View style={styles.countryTextContainer}>
                                <Text style={styles.countryName}>{item.name.common}</Text>
                                <Text style={styles.countrySub}>{item.region}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ padding: 10 }}
                />
            )}
            {isMenuOpen && (
                <TouchableOpacity style={styles.menuOverlay} onPress={toggleMenu}>
                    <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Serviços</Text>
                            <TouchableOpacity onPress={toggleMenu}>
                                <Image source={require('../../../../assets/images/MenuIconReverse.png')} style={styles.menuCloseIcon} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={()=> router.navigate('/screens/Business/perfil')} >
                            <Text style={styles.menuText}>PERFIL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> router.navigate('/screens/adicionarPontoTuristico')}>
                            <Text style={styles.menuText}>ADICIONAR PONTO TURÍSTICO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> router.navigate('/screens/adicionarPontoComercial')}>
                            <Text style={styles.menuText}>ADICIONAR PONTO COMERCIAL</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
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
        borderBottomLeftRadius: 50,
        flexDirection:"row"
    },
    view3:{
        width:"100%",
        height:150,
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    SubView:{
        width: 286,
        height: 49,
        borderRadius: 25,
        backgroundColor: 'white',
        position:'absolute',
        top: 80,
        left: 20
    },
    FiltrosView:{
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    FiltroButton:{
        width: 120,
        height:35,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    MenuIcon:{
        width: 33,
        height: 26,
        position:'absolute',
        top: 20,
        left: 10
    },
    LocateIcon:{
        width: 20,
        height:24,
        position: 'absolute',
        top: 23,
        left:'24%'
    },
    PesquisaIcon:{
        position: 'absolute',
        width: 24, 
        height: 24,
        left: 15,
        top: 13,
    },
    FilterIcon:{
        width: 28,
        height:24,
        position: 'absolute',
        left: 240,
        top: 13
    },
    NotifyIcon:{
        width: 49,
        height: 49,
        backgroundColor: 'white',
        position: 'absolute',
        left: 330,
        top:80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
            
    },
    DestaquesButtons:{
        backgroundColor: '#2B8A14',
        borderRadius: 50,
        width: 72,
        height: 71,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Text1:{
        fontSize: 20,
        fontFamily: 'Lateef',
        position: 'absolute',
        top: 20,
        left: '30%'
    },
    text2:{
        position: 'absolute',
        left: 15,
        top:1,
        fontWeight: 'bold',
        fontSize: 15
    },
    InputPesquisa:{
        flex:1,
        paddingLeft: 50,
        fontSize: 20
    },
    countryItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
    },
    flag: {
        width: 90,
        height: 45,
        borderRadius: 5,
        marginRight: 12,
    },
    countryTextContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    countryName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    countrySub: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    ratingText: {
        fontSize: 14,
        color: '#333',
    },
    starIcon: {
        width: 16,
        height: 16,
        tintColor: '#FFD700',
    },

    sideMenu: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 270,
        backgroundColor: '#71A562',
        paddingTop: 60,
        paddingHorizontal: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 50,
        zIndex: 200,
    },
    menuOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 150,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    menuItemText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuArrow: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    feedbackBox: {
        marginTop: 40,
        backgroundColor: '#2C2C2C',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    feedbackTitle: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    feedbackSubtitle: {
        color: '#ccc',
        fontSize: 10,
        marginBottom: 8,
    },
    feedbackButton: {
        width: 30,
        height: 12,
        backgroundColor: '#D46A6A',
        borderRadius: 6,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuCloseIcon: {
        width: 33,
        height: 26,
        tintColor: '#fff',
    },
    menuText:{
        fontSize: 17,
        color: '#FFFFFF',
        paddingBottom: 10
    },
    
});