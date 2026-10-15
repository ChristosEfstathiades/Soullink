import PokemonPairCard from '@/components/soullink/pokemon-pair-card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PokemonPairType } from '@/types';
import { Plus } from 'lucide-react';

interface GeneratedTeamsProps {
    teams: PokemonPairType[][];
    displayGeneratedTeams: () => void;
    importTeamToParty: (team: PokemonPairType[]) => void;
}

export default function GeneratedTeams({ teams, displayGeneratedTeams, importTeamToParty }: GeneratedTeamsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline" onClick={() => displayGeneratedTeams()}>
                    Generate Teams
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Possible Soullink Teams</DialogTitle>
                    <DialogDescription className="flex items-center justify-center text-center">
                        Click{' '}
                        <div className="mx-1 rounded-full bg-[#737373] p-0.5">
                            <Plus size={14} color="white" />
                        </div>{' '}
                        to Load a Team into your Party
                    </DialogDescription>
                </DialogHeader>
                <Carousel>
                    <CarouselContent>
                        {Array.from({ length: Math.ceil(teams.length / 3) }).map((_, pageIndex) => (
                            <CarouselItem className="flex justify-around" key={`page-${pageIndex}`}>
                                {teams.slice(pageIndex * 3, pageIndex * 3 + 3).map((team) => (
                                    <div
                                        className="relative flex flex-col items-center"
                                        style={{ contain: 'content' }}
                                        key={team.map((pair) => pair.player_one_pokemon_name).join('-')}
                                    >
                                        {team.map((pair) => (
                                            <div
                                                key={`${pair.player_one_pokemon_name}-${pair.player_two_pokemon_name}`}
                                                className="mb-1 flex"
                                            >
                                                <div className="flex items-center">
                                                    <PokemonPairCard pair={pair} lazySprites className="shadow-sm" />
                                                </div>
                                            </div>
                                        ))}
                                        <div
                                            className="absolute bottom-0 z-100 cursor-pointer rounded-full bg-blue-500 p-1"
                                            onClick={() => importTeamToParty(team)}
                                        >
                                            <Plus color="white" />
                                        </div>
                                    </div>
                                ))}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <div className="flex justify-around"></div>
            </DialogContent>
        </Dialog>
    );
}
