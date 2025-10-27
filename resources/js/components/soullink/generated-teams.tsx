import { PokemonPairType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button";


interface GeneratedTeamsProps {
    teams: PokemonPairType[][];
    displayGeneratedTeams: () => void;
}

export default function GeneratedTeams({teams, displayGeneratedTeams}: GeneratedTeamsProps) {
    return (
        <Dialog>
        <DialogTrigger asChild ><Button className="cursor-pointer" variant='outline' onClick={() => displayGeneratedTeams()}>Generate Teams</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-center">Possible Soullink Teams</DialogTitle>
                <DialogDescription className="text-center">Click Import to Load a Team into your Party</DialogDescription>
            </DialogHeader>
            <Carousel>
                <CarouselContent>
                    {/* TODO: Order locked pairs at the top in team builder function */}
                    {Array.from({ length: Math.ceil(teams.length / 3) }).map((_, index) => (
                        <CarouselItem className="flex justify-around" key={index}>
                            {teams.slice(index * 3, index * 3 + 3).map((team, index) => (
                                <div className="flex flex-col items-center" key={index} >
                                    {team.map((pair,index) => (
                                        <div key={index} className="flex mb-1">
                                            <div className='flex items-center'>
                                                <div
                                                className="rounded-4xl flex shrink-0 relative shadow-lg group"
                                                >
                                                {/* Gradient background layer */}
                                                    <div
                                                        className="absolute inset-0 rounded-4xl opacity-100"
                                                        style={{
                                                        background: `linear-gradient(to right, ${typeColors[pair.player_one_pokemon_primary_type]}, ${typeColors[pair.player_two_pokemon_primary_type]})`,
                                                        }}
                                                    />
                                                    
            
                                                    {/* Pokémon images layer */}
                                                    <div className="relative flex w-full justify-between items-center z-10">
                                                        <img
                                                        draggable="false"
                                                        className="w-13.5 lg:w-18"
                                                        src={`/storage/${pair.player_one_pokemon_name}.png`}
                                                        alt={pair.player_one_pokemon_name}
                                                        />
                                                        <img
                                                        draggable="false"
                                                        className="w-13.5 lg:w-18"
                                                        src={`/storage/${pair.player_two_pokemon_name}.png`}
                                                        alt={pair.player_two_pokemon_name}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button>Import</button>
                                </div>
                            ))}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="flex justify-around">
            </div>


        </DialogContent>
        </Dialog>
    )
}

const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};