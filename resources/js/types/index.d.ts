import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
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

// export interface SaveType {
//     created_at: string;
//     id: number;
//     user_id: number;
//     name: string;
//     player_one_name: string | null;
//     player_two_name: string | null;
//     revert_fairy_typing
// }
