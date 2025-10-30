import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError  from '@/components/input-error';
import { store } from '@/actions/App/Http/Controllers/SaveController';
import { Form, Link } from '@inertiajs/react';
import {Trash2, Save} from 'lucide-react';

export default function SavesMenu({ saves }: { saves: any[] }) {
  return (
    <section className="text-center text-lg">
        <Dialog>
        <DialogTrigger className="py-2 px-3 hover:bg-accent rounded-sm transition-colors cursor-pointer hover:text-[#3B4CCA]">New Game</DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create a New Soullink Save</DialogTitle>
            </DialogHeader>
            <Form action={store()} disableWhileProcessing >
              {({ errors }) => (
                <>
                  <Label htmlFor="name">Save Name: </Label>
                  <Input className="mb-2" type="text" id="name" name="name"  required></Input>
                  <InputError message={errors.name} className="mt-2" />
                  <Label htmlFor="p1">Player 1 Name (optional): </Label>
                  <Input className="mb-2" type="text" id="p1" name="p1"></Input>
                  <InputError message={errors.p1} className="mt-2" />
                  <Label htmlFor="p2">Player 2 Name (optional): </Label>
                  <Input className="mb-2" type="text" id="p2" name="p2"></Input>
                  <InputError message={errors.p2} className="mt-2" />
                  <Button className="cursor-pointer" type="submit">Create Save</Button>
                </>
              )}
            </Form>
        </DialogContent>
        </Dialog>
        <div className="flex flex-col gap-2 mt-4 text-center">
          <p className="text-center">Load Save</p>
          {saves.map((save) => (
            <div className="flex align-center justify-between min-w-md mb-2" key={save.id}>
              <Link prefetch className="hover:text-[#3B4CCA] flex transition-colors" href={`/saves/${save.id}`}><Save className="mr-1" ></Save> {save.name}</Link>
              <Link className="hover:text-[#CC0000] cursor-pointer transition-colors" method="delete" href={`/saves/${save.id}`}><Trash2 size={24} /></Link>
            </div>
          ))}
        </div>
    </section>
    
  );
}
