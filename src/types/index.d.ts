import { LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SaveType {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
    swap_normal_flying_order: boolean;
    revert_fairy_typing: boolean;
    created_at: string;
}

export interface PokemonPairType {
    id: number;
    save_id: number;
    player_one_pokemon_name: string;
    player_one_pokemon_nickname: string | null;
    player_one_pokemon_primary_type: string;
    player_one_pokemon_secondary_type: string | null;
    player_two_pokemon_name: string;
    player_two_pokemon_nickname: string | null;
    player_two_pokemon_primary_type: string;
    player_two_pokemon_secondary_type: string | null;
    location: string | null;
    is_alive: boolean;
}

export interface SoullinkExport {
    app: 'soullink';
    version: 1;
    exported_at: string;
    saves: (SaveType & { pairs: PokemonPairType[] })[];
}
