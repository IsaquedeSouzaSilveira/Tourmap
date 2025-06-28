import axios from 'axios';

export interface paises {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  region: string;
  capital?: string[]; 
  continents?: string[];
  population?: number;
  area?: number;
  languages?: { [key: string]: string };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
}


export const fetchPaises = async (): Promise<paises[]> => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,region,capital,continents,population,area,languages,currencies');
    const data = response.data;

    return data.filter(
      (item: any) => item.name?.common && item.flags?.png && item.region
    );
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    return [];
  }
};