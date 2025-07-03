import { useEffect, useState } from "react";
import axios from "axios";

import { BASE_IP } from '@/config/api';


interface PontoTuristico {
  id: string;
  name: string;
  description: string;
  creationDate: string;
  local: string;
  userImageUrl?: string;
  reportNumber: number;
  isPublished: boolean;
}

export function usePontosTuristicos() {
  const [pontosTuristicos, setPontosTuristicos] = useState<PontoTuristico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_IP}/get/list/touristPoint`);
        const data: PontoTuristico[] = response.data.response;
        setPontosTuristicos(data);
      } catch (error) {
        console.error("Erro ao buscar pontos turísticos:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchData();
  }, []);

  return { pontosTuristicos, carregando };
}
