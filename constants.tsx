
import { Channel } from './types';

export const CHANNELS: Channel[] = [
  { id: '1', title: 'Notícias do Mundo', category: 'Informação', thumbnail: 'https://picsum.photos/seed/news/800/450', viewers: '12k', isLive: true },
  { id: '2', title: 'Campeonato de Surf', category: 'Esportes', thumbnail: 'https://picsum.photos/seed/surf/800/450', viewers: '45k', isLive: true },
  { id: '3', title: 'Culinária Moderna', category: 'Lifestyle', thumbnail: 'https://picsum.photos/seed/cooking/800/450', viewers: '8k', isLive: false },
  { id: '4', title: 'Gaming Pro: Finals', category: 'E-sports', thumbnail: 'https://picsum.photos/seed/gaming/800/450', viewers: '150k', isLive: true },
  { id: '5', title: 'Documentário Natureza', category: 'Ciência', thumbnail: 'https://vdo.ninja/?view=g5Se4bN', viewers: '5k', isLive: true },
  { id: '6', title: 'Cinema Retro', category: 'Filmes', thumbnail: 'https://picsum.photos/seed/movie/800/450', viewers: '3k', isLive: false },
];

export const CATEGORIES = ['Destaques', 'Esportes', 'Notícias', 'Gaming', 'Filmes'];
