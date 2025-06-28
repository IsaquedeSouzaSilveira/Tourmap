import React from "react";
import {View,
        Text,
        ScrollView, 
        StyleSheet 
        } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import {ButtonBack} from "@/components/button2/index"
import { saveUserId} from "@/utils/storage";

export default function NotificationDetails(){

    const params = useLocalSearchParams();
    const title = params.title;
    const description= params.description;
    const time= params.time;

    return(
        <View style={styles.view1}>

                <View style= {styles.view2}>
                </View>
                <View style= {styles.view3}>
                    <View style={styles.titleView}>
                        <ButtonBack onPress={()=>router.back()} />
                        <Text style={styles.NotifyTitle}>{title}</Text>
                    </View>
                    <ScrollView style={styles.DescriptionView}>
                        <Text style={styles.NotifyDescription}>{description}</Text>
                    </ScrollView>
                    <Text style={styles.NotifyTime}>{time}</Text>
                </View>
        </View>
    )
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
        flexDirection:"column",
        gap: 30,
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
        height: 50,
        alignItems: 'center'
    },
    DescriptionView:{
        width: '94%',
        maxHeight: '80%'
    },
    NotifyTitle:{
        fontSize: 24,
        fontFamily:"Konkhmer Sleokchher", 
        fontWeight: "bold",
        position: 'absolute',
        top:15 
    },
    NotifyDescription:{
        fontSize: 14,
        fontFamily:"Poppins",
        alignSelf: "stretch"
    },
    NotifyTime:{
        fontSize: 16,
        fontFamily:"Poppins",
        color: '#6E6E6E',
        fontWeight: 'bold',
        position: 'absolute',
        right: 25,
        bottom: 20
    }
});