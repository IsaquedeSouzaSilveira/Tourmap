import {TouchableOpacity, TouchableOpacityProps, Text} from "react-native";

import {style} from "@/components/button1/style"

type Props =  TouchableOpacityProps & {
    title: string
}

export function ButtonPradao({title, ...rest}: Props){
    return(
        <TouchableOpacity activeOpacity={0.9} style={style.button} {...rest}>
            <Text style={style.title}>{title}</Text>
        </TouchableOpacity>
    )
}