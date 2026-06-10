import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createSave, deleteSave, exportData, importData } from '@/lib/storage';
import { type SaveType } from '@/types';
import { Download, FilePlus, Save, Settings, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SavesMenu({ saves }: { saves: SaveType[] }) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importMessage, setImportMessage] = useState<string | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    function handleCreateSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const save = createSave({
            name: (formData.get('name') as string).trim(),
            player_one_name: (formData.get('p1') as string) || null,
            player_two_name: (formData.get('p2') as string) || null,
            swap_normal_flying_order: formData.get('swap_normal_flying_order') !== null,
            revert_fairy_typing: formData.get('revert_fairy_typing') !== null,
        });
        navigate(`/saves/${save.id}`);
    }

    function handleDeleteSave(event: React.MouseEvent, save: SaveType) {
        event.preventDefault();
        event.stopPropagation();
        deleteSave(save.id);
    }

    function handleExport() {
        const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `soullink-export-${new Date().toISOString().slice(0, 10)}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        setImportMessage(null);
        setImportError(null);

        file.text()
            .then((json) => {
                const count = importData(json);
                setImportMessage(`Imported ${count} ${count === 1 ? 'save' : 'saves'}.`);
            })
            .catch((error: Error) => {
                setImportError(error.message);
            });
    }

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
                    <form onSubmit={handleCreateSave} className="flex flex-col gap-2">
                        <Label htmlFor="name">Save Name: </Label>
                        <Input className="mb-2" type="text" id="name" name="name" maxLength={255} required></Input>
                        <Label htmlFor="p1">Player 1 Name (optional): </Label>
                        <Input className="mb-2" type="text" id="p1" name="p1" maxLength={30}></Input>
                        <Label htmlFor="p2">Player 2 Name (optional): </Label>
                        <Input className="mb-2" type="text" id="p2" name="p2" maxLength={30}></Input>
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
                    </form>
                </DialogContent>
            </Dialog>
            <div className="mt-4 flex flex-col gap-2 text-center">
                <p className="text-center">Load Save</p>
                {saves.map((save) => (
                    <Link
                        className="group flex min-w-3xs justify-between rounded-sm px-3 py-2 transition-colors hover:bg-accent md:min-w-sm"
                        to={`/saves/${save.id}`}
                        key={save.id}
                    >
                        <div className="flex items-center group-hover:text-[#3B4CCA]">
                            <Save className="mr-1"></Save> {save.name}
                        </div>
                        <button
                            className="cursor-pointer transition-colors hover:text-[#CC0000]"
                            onClick={(event) => handleDeleteSave(event, save)}
                            aria-label={`Delete ${save.name}`}
                        >
                            <Trash2 size={24} />
                        </button>
                    </Link>
                ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="flex gap-2">
                    <Button className="cursor-pointer" variant="outline" onClick={handleExport}>
                        <Download className="mr-1" /> Export Data
                    </Button>
                    <Button className="cursor-pointer" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-1" /> Import Data
                    </Button>
                    <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
                </div>
                <p className="max-w-xs text-xs text-muted-foreground">
                    Your saves live in this browser's storage. Export them as JSON to back them up or move them to another device.
                </p>
                {importMessage && <p className="text-sm text-green-600">{importMessage}</p>}
                <InputError message={importError ?? undefined} />
            </div>
        </section>
    );
}
