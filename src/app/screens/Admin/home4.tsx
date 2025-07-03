import { FlatList, View, TouchableOpacity, StyleSheet, Image, Text, TextInput, ActivityIndicator, Animated, Dimensions, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import { usePaises } from '../../../hooks/usePaises';
import { LogOutUser  } from "@/utils/storage";
import * as Location from 'expo-location';


export default function Home1() {
    const { pais, carregando } = usePaises();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width))[0];
    const [searchText, setSearchText] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [mostrarFiltrosAvaliacao, setMostrarFiltrosAvaliacao] = useState(false);
    const [mostrarFiltrosIdioma, setMostrarFiltrosIdioma] = useState(false);
    const [mostrarFiltrosCategoria, setMostrarFiltrosCategoria] = useState(false);
    const [mostrarFiltrosLocais, setMostrarFiltrosLocais] = useState(false);
    const [filtrosSelecionados, setfiltrosSelecionados] = useState<string[]>([]);

    const [localizacaoTexto, setLocalizacaoTexto] = useState('Carregando...');


    const idiomasUnicos = Array.from(
        new Set(
            pais.flatMap(item => item.languages ? Object.values(item.languages) : [])
        )
    );

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

    const LogOut = async () =>{
        console.log('Apagando Id do usuário')
        await LogOutUser();
        router.replace('/');
    };

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

    const AdicionarFiltro = (filtro: string) => {
        setfiltrosSelecionados((prev) =>{
            if(prev.includes(filtro)){
                return prev.filter(item => item !== filtro);
            }
            else{
                return [...prev, filtro];
            }
        })
    };

    
    const filteredPaises = pais.filter((item) => {
        const nomePais = item.name.common.toLowerCase();
        const linguas = item.languages ? Object.values(item.languages).map(l => l.toLowerCase()) : [];

        
        const nomeBateComBusca = nomePais.includes(searchText.toLowerCase());

        
        if (filtrosSelecionados.length === 0) return nomeBateComBusca;

        return nomeBateComBusca && filtrosSelecionados.some(filtro => {
            const filtroLower = filtro.toLowerCase();
            return (
                nomePais.includes(filtroLower) ||
                linguas.includes(filtroLower)         
            );
        });
    });

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
                <TouchableOpacity style={styles.NotifyIcon} activeOpacity={0.8} onPress={()=> router.navigate('/screens/notification')}>
                    <Image source={require('../../../../assets/images/NotifyIcon.png')}/>
                </TouchableOpacity>
                {filtrosSelecionados.length > 0 && (
                    <ScrollView horizontal={true} style={styles.FiltrosAplicadosView} showsHorizontalScrollIndicator={false}>
                        {filtrosSelecionados.map((filtro, index) => (
                            <TouchableOpacity style={styles.FiltroButtonAplicado} onPress={()=>AdicionarFiltro(filtro)} activeOpacity={0.8} key={index}>
                                <Text style={styles.textFiltroAplicado}>{filtro}</Text>
                                <Image source={require('../../../../assets/images/delete.png')} style={styles.filterImage}/>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.view3}>
                {mostrarFiltros ? (
                    <View style={styles.view3}>
                        
                        <View style={styles.FiltrosView}>
                            {mostrarFiltrosAvaliacao ? (
                                <View>
                                    <TouchableOpacity style={styles.FiltroButtonActivity} onPress={()=>setMostrarFiltrosAvaliacao(!mostrarFiltrosAvaliacao)}>
                                    <Text>⭐ ⭐ ⭐ ⭐ ⭐ ▼</Text>
                                    </TouchableOpacity>
                                    <ScrollView style={styles.OptionsFiltroView}>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('⭐ ⭐ ⭐ ⭐ ⭐')}>
                                            <Text>⭐ ⭐ ⭐ ⭐ ⭐</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('⭐ ⭐ ⭐ ⭐')}>
                                            <Text>⭐ ⭐ ⭐ ⭐</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('⭐ ⭐ ⭐')}>
                                            <Text>⭐ ⭐ ⭐</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('⭐ ⭐')}>
                                            <Text>⭐ ⭐</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('⭐')}>
                                            <Text>⭐</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                                    
                            ):(
                                <TouchableOpacity style={styles.FiltroButton} onPress={()=>setMostrarFiltrosAvaliacao(!mostrarFiltrosAvaliacao)}>
                                <Text>⭐ ⭐ ⭐ ⭐ ⭐ ▼</Text>
                                </TouchableOpacity>
                            )}
                            
                            {mostrarFiltrosCategoria ? (
                                <View>
                                    <TouchableOpacity style={styles.FiltroButtonActivity} onPress={()=>setMostrarFiltrosCategoria(!mostrarFiltrosCategoria)}>
                                        <Text>Categorias ▼</Text>
                                    </TouchableOpacity>
                                    <ScrollView style={styles.OptionsFiltroView}>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('País')}>
                                            <Text>País</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('Cidade')}>
                                            <Text>Cidade</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('Estado')}>
                                            <Text>Estado</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('Ponto Turístico')}>
                                            <Text>Ponto Turístico</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.FiltroButton2} onPress={()=>AdicionarFiltro('Ponto Comercial')}>
                                            <Text>Ponto Comercial</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                                    
                            ):(
                                <TouchableOpacity style={styles.FiltroButton} onPress={()=>setMostrarFiltrosCategoria(!mostrarFiltrosCategoria)}>
                                    <Text>Categorias ▼</Text>
                                </TouchableOpacity>
                            )}
                            
                            
                        </View>
                        
                        <View style={styles.FiltrosView}>
                            {mostrarFiltrosLocais ? (
                                <View style={{width:120}}>
                                    <TouchableOpacity style={styles.FiltroButtonActivity} onPress={()=>setMostrarFiltrosLocais(!mostrarFiltrosLocais)}>
                                        <Text>Locais ▼</Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={pais}
                                        keyExtractor={(item) => item.name.common}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => AdicionarFiltro(item.name.common)}
                                                style={styles.FiltroButton2}
                                            >
                                            <Text>{item.name.common}</Text>
                                            </TouchableOpacity>
                                        )}
                                        style={styles.OptionsFiltroView}
                                    />
                                </View>
                                    
                            ):(
                                <TouchableOpacity style={styles.FiltroButton} onPress={()=>setMostrarFiltrosLocais(!mostrarFiltrosLocais)}>
                                    <Text>Locais ▼</Text>
                                </TouchableOpacity>
                            )}
                            
                            {mostrarFiltrosIdioma ? (
                                <View style={{width:120}}>
                                    <TouchableOpacity style={styles.FiltroButtonActivity} onPress={()=>setMostrarFiltrosIdioma(!mostrarFiltrosIdioma)}>
                                        <Text>Idiomas ▼</Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={idiomasUnicos}
                                        keyExtractor={(item, index) => item + index}
                                        renderItem={({ item }) => (
                                                <TouchableOpacity
                                                onPress={() => AdicionarFiltro(item)}
                                                style={styles.FiltroButton2}
                                                >
                                                    <Text>{item}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                        style={styles.OptionsFiltroView}
                                    />
                                </View>
                                    
                            ):(
                                <TouchableOpacity style={styles.FiltroButton} onPress={()=>setMostrarFiltrosIdioma(!mostrarFiltrosIdioma)}>
                                    <Text>Idiomas ▼</Text>
                                </TouchableOpacity>
                            )}
                            
                        </View>
                    </View>
                ) : (
                    <View style={styles.view3}>
                        <Text style={styles.text2}>Destaques</Text>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Admin/home2')}>
                        <Image source={require('../../../../assets/images/Avaliacao.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Admin/home3')}>
                        <Image source={require('../../../../assets/images/Heart.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Admin/home1')}>
                        <Image source={require('../../../../assets/images/Home.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.DestaquesButtons} onPress={() => router.navigate('/screens/Admin/home5')}>
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
                        <View style={styles.ServicosView}>
                            <TouchableOpacity onPress={()=> router.navigate('/screens/Admin/perfil')} >
                                <Text style={styles.menuText}>PERFIL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> router.navigate('/screens/Admin/PointTuristSolicitys')}>
                                <Text style={styles.menuText}>SOLICITAÇÕES DE PONTOS TURÍSTICO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> router.navigate('/screens/Admin/PointComercialSolicitys')}>
                                <Text style={styles.menuText}>SOLICITAÇÕES DE PONTOS COMERCIAIS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> router.navigate('/screens/Admin/RevisionPoints')}>
                                <Text style={styles.menuText}>PONTOS A SEREM REVISADOS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={LogOut}>
                                <Text style={styles.menuText}>SAIR DA CONTA</Text>
                           </TouchableOpacity>
                        </View>
                        
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
    ServicosView:{
        width: '100%',
        paddingBottom: 10,
        height:200,
        justifyContent: 'center'
    },
    FiltrosView:{
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
    },
    OptionsFiltroView:{
        backgroundColor: 'white',
        gap: 3,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        maxHeight:35
    },
    FiltrosAplicadosView:{
        position: 'absolute',
        bottom: -5,
        left: 40,
        width: 320,
        height: 40,
    },  
    FiltroButton:{
        width: 120,
        height:35,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    FiltroButtonAplicado:{
        width: 90,
        height:25,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 6
    },
    FiltroButtonActivity:{
        width: 120,
        height:35,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    FiltroButton2:{
        width: '100%',
        height:35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    MenuIcon:{
        width: 33,
        height: 26,
        position:'absolute',
        top: 20,
        left: 10,
        
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
    textFiltroAplicado:{
        fontSize: 10,
        fontWeight: 'bold',
        right: 5
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
        fontWeight: 'bold',
        paddingBottom: 10
    },
    filterImage:{
        position: 'absolute',
        right: 5,
        width: 7,
        height: 7
    }
});