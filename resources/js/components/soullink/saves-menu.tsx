import { store } from '@/actions/App/Http/Controllers/SaveController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, Link } from '@inertiajs/react';
import { FilePlus, Save, Settings, Trash2 } from 'lucide-react';

export default function SavesMenu({ saves }: { saves: any[] }) {
    return (
        <section className="mt-[calc(50vh-16rem)] text-center text-lg">
            <Dialog>
                <DialogTrigger className="cursor-pointer rounded-sm px-3 py-2 transition-colors hover:bg-accent hover:text-[#3B4CCA]">
                    <div className="align-center flex">
                        <FilePlus className="mr-1 inline-block" />
                        <p>Create Save</p>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Soullink Save</DialogTitle>
                    </DialogHeader>
                    <Form action={store()} disableWhileProcessing className="flex flex-col gap-2">
                        {({ errors }) => (
                            <>
                                <Label htmlFor="name">Save Name: </Label>
                                <Input className="mb-2" type="text" id="name" name="name" required></Input>
                                <InputError message={errors.name} className="mt-2" />
                                <Label htmlFor="p1">Player 1 Name (optional): </Label>
                                <Input className="mb-2" type="text" id="p1" name="p1"></Input>
                                <InputError message={errors.p1} className="mt-2" />
                                <Label htmlFor="p2">Player 2 Name (optional): </Label>
                                <Input className="mb-2" type="text" id="p2" name="p2"></Input>
                                <InputError message={errors.p2} className="mt-2" />
                                <p className="flex items-center">
                                    <Settings className="ml-0" />
                                    Settings:
                                </p>
                                <div className="mb-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button" className="flex items-center">
                                                <Input
                                                    className="mr-1 size-5 cursor-pointer"
                                                    type="checkbox"
                                                    id="revert_fairy_typing"
                                                    name="revert_fairy_typing"
                                                ></Input>
                                                <Label htmlFor="revert_fairy_typing">Reverse Fairy Typing </Label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Reverts pokemon like clefable from fairy to normal (recommended if playing generations 1-5)</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="mb-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button" className="flex items-center">
                                                <Input
                                                    className="mr-1 size-5 cursor-pointer"
                                                    type="checkbox"
                                                    id="swap_normal_flying_order"
                                                    name="swap_normal_flying_order"
                                                ></Input>
                                                <Label htmlFor="swap_normal_flying_order">Normal/Flying {'->'} Flying/Normal </Label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Reduces overcrowding in the Normal pool and makes teambuilding more fair.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Button className="cursor-pointer self-center" type="submit">
                                    Create Save
                                </Button>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
            <div className="mt-4 flex flex-col gap-2 text-center">
                <p className="text-center">Load Save</p>
                {/* TODO: make whole link clickable not just save name */}
                {saves.map((save) => (
                    <div
                        className="align-center flex min-w-3xs justify-between rounded-sm px-3 py-2 transition-colors hover:bg-accent md:min-w-sm"
                        key={save.id}
                    >
                        <Link prefetch className="flex transition-colors hover:text-[#3B4CCA]" href={`/saves/${save.id}`}>
                            <Save className="mr-1"></Save> {save.name}
                        </Link>
                        <Link className="cursor-pointer transition-colors hover:text-[#CC0000]" method="delete" href={`/saves/${save.id}`}>
                            <Trash2 size={24} />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
