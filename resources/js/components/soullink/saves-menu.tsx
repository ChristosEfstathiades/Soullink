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
// import { saves } from '@/routes';
import { Form, Link } from '@inertiajs/react';


export default function SavesMenu({ saves }: { saves: any[] }) {
  return (
    <section className="text-center">
        <Dialog>
        <DialogTrigger className="bg-white/75 p-4 rounded-full cursor-pointer">New Game</DialogTrigger>
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
                  <Label htmlFor="p1">Player1 Name (optional): </Label>
                  <Input className="mb-2" type="text" id="p1" name="p1"></Input>
                  <InputError message={errors.p1} className="mt-2" />
                  <Label htmlFor="p2">Player2 Name (optional): </Label>
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
            <Link key={save.id} href={`/saves/${save.id}`}>{save.name}</Link>
          ))}
        </div>
    </section>
    
  );
}
