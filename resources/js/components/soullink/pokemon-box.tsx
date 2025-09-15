import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Plus} from 'lucide-react';

interface PokemonBoxProps {
  boxPokemon: any[];
}

export default function PokemonBox({ boxPokemon }: PokemonBoxProps) {
  return (
    <section className="w-md px-4 bg-contain bg-[url('https://archives.bulbagarden.net/media/upload/a/a7/Box_Forest_FRLG.png')] bg-no-repeat border-x-1 border-x-black border-x-solid">
        <Dialog>
        <DialogTrigger className="bg-white/75 p-4 rounded-full cursor-pointer"><Plus /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </section>
    
  );
}
