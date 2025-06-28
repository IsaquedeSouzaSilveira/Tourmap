import { TouchableOpacity, TouchableOpacityProps, Image } from "react-native";

import {style} from "@/components/button2/style"

type Props =  TouchableOpacityProps;

export function ButtonBack({...rest}: Props){
    return(
        <TouchableOpacity activeOpacity={0.9} style={style.button} {...rest}>
            <Image
                source={require('../../../assets/images/BackIcon.png')}
                style={style.Image}
            />
        </TouchableOpacity>
    )
    
}