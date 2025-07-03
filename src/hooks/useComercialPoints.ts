import { useEffect, useState } from 'react';
import axios from 'axios';

import { BASE_IP } from '@/config/api';

interface PontoComercial {
  id: string;
  name: string;
  description: string;
  local: string;
  creationDate: string; // ou Date, dependendo da sua API
  userImageUrl?: string;
  reportNumber: number;
  isPublished: boolean;
  businessId: string;
  ImageCommercialPointByCommercialPointId?: {
    url: string;
  }[];
}

export function usePontosComerciais() {
  const [pontos, setPontos] = useState<PontoComercial[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarPontos = async () => {
      try {
        const response = await axios.get(`${BASE_IP}/commercial/list`);
        setPontos(response.data);
      } catch (error) {
        console.error('Erro ao buscar pontos comerciais', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarPontos();
  }, []);

  return { pontos, carregando };
}