import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import { BASE_IP } from '@/config/api';


export async function saveUserId(id: string) {
  try {
    await SecureStore.setItemAsync('userId', id);
    console.log('Id salvo')
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
  try {
    const id = await SecureStore.getItemAsync('userId');
    if (!id) {
      console.log('Id do usuário não armazenado.');
      return null;
    }

    const urls = [
      { url: `${BASE_IP}/get/client/id`, tipo: "Cliente" as const, method: 'POST' },
      { url: `${BASE_IP}/get/business/id`, tipo: "Empresa" as const, method: 'POST' },
      { url: `${BASE_IP}/get/admin/${id}`, tipo: "Admin" as const, method: 'GET' },
    ];

    for (const { url, tipo, method } of urls) {
      try {
        const resultado = method === 'GET'
          ? await axios.get(url)
          : await axios.post(url, { id });

        if (resultado.status === 200 && resultado.data) {
          return tipo;
        } else {
          console.log('Erro ao buscar tipo:', resultado.data?.message);
        }
      } catch (error) {
        console.log('Erro na requisição do servidor: ', error);
      }
    }
  } catch (error) {
    console.log('Erro no getUserType: ', error);
  }
  return null;
};
