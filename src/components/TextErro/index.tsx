import { Text } from "react-native";

import {style} from '@/components/TextErro/style'

export function TextErro(erro: string){
    return(
        <Text style={style.textErro}>{erro}</Text>
    )
}