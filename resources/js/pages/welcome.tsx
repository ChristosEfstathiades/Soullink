import AppLogo from '@/components/app-logo';
import { home, login, register } from '@/routes';
import { index } from '@/routes/saves';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { SaveAll } from 'lucide-react';
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-between gap-4">
                        <Link href={home()} prefetch className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>
                        <div>
                            {auth.user ? (
                                <Link
                                    href={index()}
                                    className="flex items-center rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    <SaveAll className="mr-1" size={16} /> Saves
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="mr-2 inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>
                <section className="flex flex-col">
                    <div className="flex flex-col items-center text-center">
                        <h3>Make Teambuilding Quick and Easy with</h3>
                        <div className="flex items-center">
                            <img src="/storage/pokeball.svg" alt="App Logo" className="h-16 w-16" />
                            <img src="/storage/fontbolt.png" alt="App Name" className="h-24" />
                        </div>
                        <p className="max-w-90 text-xs">
                            The perfect tool for any 2-player Pokemon Nuzlocke Challenge A.K.A a{' '}
                            <a
                                className="underline decoration-[#3B4CCA] decoration-solid underline-offset-2 hover:decoration-2"
                                target="_blank"
                                href="https://nuzlockeuniversity.ca/nuzlocke-variants/soul-link-nuzlocke-rules/"
                            >
                                Soullink
                            </a>
                            . Track your encounters and Build your best possible combined team.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
