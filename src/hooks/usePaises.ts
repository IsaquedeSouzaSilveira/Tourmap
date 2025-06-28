import { useEffect, useState } from 'react';
import { fetchPaises, paises } from '../APIs/paises/paises';

export const usePaises = () => {
  const [pais, setPais] = useState<paises[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPaises();
      setPais(data);
      setCarregando(false);
    };
    loadData();
  }, []);

  return { pais, carregando };
};