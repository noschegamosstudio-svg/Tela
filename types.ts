
export interface Channel {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  viewers: string;
  isLive: boolean;
}

export type MenuSection = 'home' | 'channels' | 'ai-live' | 'settings';

export interface NavigationState {
  section: 'sidebar' | 'content';
  sidebarIndex: number;
  contentIndex: {
    row: number;
    col: number;
  };
}
