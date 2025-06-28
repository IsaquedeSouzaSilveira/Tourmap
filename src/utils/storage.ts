import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export async function saveUserId(id: string) {
  try {
    await SecureStore.setItemAsync('userId', id);
  } catch (e) {
    console.error("Erro ao salvar o id:", e);
  }
}

export async function LogOutUser(){
  try{
    await SecureStore.deleteItemAsync('userId');
    console.log('Id removido com sucesso');
  }
  catch(error){
    console.log('Erro ao remover o id do usuário: ', error)
  }
}

export async function getUserId() {
  try {
    return await SecureStore.getItemAsync('userId');
  } catch (e) {
    console.error("Erro ao pegar o id do usuário:", e);
    return null;
  }
}

export const getUserType = async (): Promise<"Cliente" | "Empresa" | "Admin" | null> => {

  try{
    const id = await SecureStore.getItemAsync('userId');
    if(!id){
      console.log('Id do usuário não armazenado.');
      return null;
    }

    const urls = [
      { url: `http://192.168.72.107:3333/get/client/${id}`, tipo: "Cliente" as const},
      { url: `http://192.168.72.107:3333/get/business/${id}`, tipo: "Empresa" as const},
      { url: `http://192.168.72.107:3333/get/admin/${id}`, tipo: "Admin" as const},
    ];

    for(const {url,tipo} of urls){
      try{
        const resultado = await axios.get(url);
        if (resultado.status === 200 && resultado.data) {
          return tipo;
        } 
        else {
          console.log('Erro ao buscar tipo:', resultado.data?.message);
        }
      }
      catch(error){
      }
    }
  }
  catch(error){
    console.log('Erro no getUserType: ',error);
  }
  return null;
};