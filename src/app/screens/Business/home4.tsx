import { FlatList, View, TouchableOpacity, StyleSheet, Image, Text, TextInput, ActivityIndicator, Animated, Dimensions, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import { usePaises } from '../../../hooks/usePaises';
import { getUserId, getUserType  } from "@/utils/storage";
import * as Location from 'expo-location';

export default function Home4() {
    const { pais, carregando } = usePaises();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width))[0];
    const [searchText, setSearchText] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [showLocalOptions, setShowLocalOptions] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    
    const [localizacaoTexto, setLocalizacaoTexto] = useState('Carregando...');

    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [states, setStates] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [cities, setCities] = useState<string[]>([]);

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

    useEffect(() => {
        if (selectedCountry) {
            fetch("https://countriesnow.space/api/v0.1/countries/states", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: selectedCountry })
            })
            .then(res => res.json())
            .then(json => setStates(json.data.states.map((s: any) => s.name)))
            .catch(console.error);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedCountry && selectedState) {
            fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: selectedCountry, state: selectedState })
            })
            .then(res => res.json())
            .then(json => setCities(json.data))
            .catch(console.error);
        }
    }, [selectedState]);

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

    const handleSelectFilter = (type: string, value: string) => {
        const filtro = `${type}: ${value}`;
        if (!selectedFilters.includes(filtro)) {
            setSelectedFilters([...selectedFilters, filtro]);
        }
    };

    const renderData = () => {
        const items: any[] = [];

        if (selectedFilters.some(f => f.startsWith('País'))) {
            items.push(...pais.map(p => ({
                tipo: 'País',
                nome: p.name.common,
                detalhes: p
            })));
        }

        if (selectedFilters.some(f => f.startsWith('Estado'))) {
            items.push(...states.map(s => ({
                tipo: 'Estado',
                nome: s
            })));
        }

        if (selectedFilters.some(f => f.startsWith('Cidade'))) {
            items.push(...cities.map(c => ({
                tipo: 'Cidade',
                nome: c
            })));
        }

        if (selectedFilters.length === 0) {
            items.push(...pais.map(p => ({
                tipo: 'País',
                nome: p.name.common,
                detalhes: p
            })));
        }

        return items.filter(item => item.nome.toLowerCase().includes(searchText.toLowerCase()));
    };

    return (
        <ScrollView style={styles.view1}>
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
                    <TouchableOpacity style={styles.FilterIcon} activeOpacity={0.8} onPress={() => setMostrarFiltros(view => !view)}>
                        <Image source={require('../../../../assets/images/FilterIcon.png')} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.NotifyIcon} activeOpacity={0.8}>
                    <Image source={require('../../../../assets/images/NotifyIcon.png')}/>
                </TouchableOpacity>
            </View>

            {selectedFilters.length > 0 && (
                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                    {selectedFilters.map((filtro, idx) => (
                        <View key={idx} style={{ backgroundColor: '#fff', padding: 8, borderRadius: 6, marginVertical: 2 }}>
                            <Text>{filtro}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.view3}>
                {mostrarFiltros && (
                    <View style={{ width: '100%', padding: 10 }}>
                        <TouchableOpacity style={styles.FiltroButton} onPress={() => setShowLocalOptions(!showLocalOptions)}>
                            <Text>Locais ▼</Text>
                        </TouchableOpacity>
                        {showLocalOptions && (
                            <View style={{ backgroundColor: '#fff', marginTop: 8, borderRadius: 8, padding: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Países:</Text>
                                {pais.map((item) => (
                                    <TouchableOpacity key={item.name.common} onPress={() => {
                                        setSelectedCountry(item.name.common);
                                        handleSelectFilter('País', item.name.common);
                                    }}>
                                        <Text style={{ padding: 4 }}>{item.name.common}</Text>
                                    </TouchableOpacity>
                                ))}
                                {states.length > 0 && (
                                    <>
                                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Estados:</Text>
                                        {states.map(state => (
                                            <TouchableOpacity key={state} onPress={() => {
                                                setSelectedState(state);
                                                handleSelectFilter('Estado', state);
                                            }}>
                                                <Text style={{ padding: 4 }}>{state}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}
                                {cities.length > 0 && (
                                    <>
                                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Cidades:</Text>
                                        {cities.map(city => (
                                            <TouchableOpacity key={city} onPress={() => handleSelectFilter('Cidade', city)}>
                                                <Text style={{ padding: 4 }}>{city}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>

            {carregando && <ActivityIndicator size="large" color="#39B51B" style={{ marginTop: 20 }} />}

            <FlatList
                data={renderData()}
                keyExtractor={(item, index) => `${item.tipo}-${item.nome}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/screens/LocalDetalhes',
                            params: {
                                nome: item.nome,
                                tipo: item.tipo,
                                ...(item.tipo === 'País' ? {
                                    bandeira: item.detalhes.flags.png,
                                    regiao: item.detalhes.region,
                                    capital: item.detalhes.capital ? item.detalhes.capital[0] : 'Não informado',
                                    continente: item.detalhes.continents ? item.detalhes.continents[0] : 'Não informado',
                                    populacao: item.detalhes.population ? item.detalhes.population.toString() : 'Não informado',
                                    area: item.detalhes.area ? item.detalhes.area.toString() : 'Não informado',
                                    linguas: item.detalhes.languages ? JSON.stringify(item.detalhes.languages) : 'Não informado',
                                    moeda: item.detalhes.currencies ? JSON.stringify(item.detalhes.currencies) : 'Não informado'
                                } : {})
                            }
                        })}
                        style={styles.countryItem}
                    >
                        <Text style={styles.countryName}>{item.nome}</Text>
                        <Text style={styles.countrySub}>{item.tipo}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ padding: 10 }}
            />
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
        </ScrollView>
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