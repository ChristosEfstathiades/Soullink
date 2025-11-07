import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useLocalStorage } from 'usehooks-ts';

export default function PCBoxBackgroundOptions() {
    const { auth } = usePage<SharedData>().props;
    const [pcBoxBackground, setPcBoxBackground] = useLocalStorage<number>(`pc-box-background-${auth.user.id}`, 0);
    return (
        <div>
            {Array.from({ length: 9 }).map((_, index) => (
                <div
                    key={index}
                    className={`inline-block cursor-pointer rounded-xl ${pcBoxBackground === index ? 'shadow-[0_0_25px_7px_rgba(255,28,28,1)]' : 'border-transparent'} m-2`}
                    onClick={() => setPcBoxBackground(index)}
                >
                    <img src={`/storage/pc-box-backgrounds/${index}.png`} alt={`PC Box Background ${index}`} className="w-25 sm:w-40" />
                </div>
            ))}
        </div>
    );
}
