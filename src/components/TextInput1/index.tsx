import { TextInput, TextInputProps } from "react-native";
import {style} from "@/components/TextInput1/style"



export function Input({...rest}: TextInputProps){
    return <TextInput style={style.input} {...rest}/>
}