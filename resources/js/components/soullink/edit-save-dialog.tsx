import { update } from '@/actions/App/Http/Controllers/SaveController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

interface EditSaveDialogProps {
    save: {
        id: number;
        name: string;
        player_one_name: string | null;
        player_two_name: string | null;
    };
}

export default function EditSaveDialog({ save }: EditSaveDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer py-2 pl-2 transition-colors hover:text-[#3B4CCA]">
                <Pencil size={24} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Save</DialogTitle>
                </DialogHeader>
                <Form {...update(save.id)} onSuccess={() => setOpen(false)} disableWhileProcessing className="flex flex-col gap-2">
                    {({ errors }) => (
                        <>
                            <Label htmlFor="name">Save Name: </Label>
                            <Input className="mb-2" type="text" id="name" name="name" defaultValue={save.name} required />
                            <InputError message={errors.name} className="mt-2" />
                            <Label htmlFor="p1">Player 1 Name (optional): </Label>
                            <Input className="mb-2" type="text" id="p1" name="p1" defaultValue={save.player_one_name ?? ''} />
                            <InputError message={errors.p1} className="mt-2" />
                            <Label htmlFor="p2">Player 2 Name (optional): </Label>
                            <Input className="mb-2" type="text" id="p2" name="p2" defaultValue={save.player_two_name ?? ''} />
                            <InputError message={errors.p2} className="mt-2" />
                            <Button className="cursor-pointer self-center" type="submit">
                                Save Changes
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
