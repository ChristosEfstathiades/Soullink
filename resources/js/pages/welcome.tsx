import AppLogo from '@/components/app-logo';
import Tutorial from '@/components/soullink/tutorial';
import TutorialContent from '@/components/soullink/tutorial-content';
import TutorialDescription from '@/components/soullink/tutorial-description';
import TutorialTitle from '@/components/soullink/tutorial-title';
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
            <div className="flex flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-between gap-4">
                        <Link href={home()} prefetch className="flex items-center space-x-2 dark:text-[#EDEDEC]">
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
                        <h3 className="dark:text-[#EDEDEC]">Make Teambuilding Quick and Easy with</h3>
                        <div className="flex items-center">
                            <img src="/storage/pokeball.svg" alt="App Logo" className="w-8 sm:w-10" />
                            <img src="/storage/fontbolt.png" alt="App Name" className="h-14 sm:h-24" />
                            <img src="/storage/pokeball.svg" alt="App Logo" className="w-8 sm:w-10" />
                        </div>
                        <p className="mb-2 max-w-90 text-xs dark:text-[#EDEDEC]">
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
                        {auth.user && (
                            <Link
                                href={index()}
                                className="flex items-center rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#333] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                <SaveAll className="mr-1" size={16} /> Saves
                            </Link>
                        )}
                    </div>
                </section>
            </div>
            <section className="w-full bg-[#E34234] py-6">
                <h2 className="mb-8 text-center text-3xl font-bold text-white">How to use Soullink</h2>
                <div className="mx-auto w-[85%]">
                    <Tutorial image="tutorial_1.png" number={1}>
                        <TutorialContent>
                            <TutorialTitle number={1}>Create/Load a Soullink Save</TutorialTitle>
                            <TutorialDescription>First create a new save and give both you and your soullink teammate nicknames</TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_2.png" number={2}>
                        <TutorialContent>
                            <TutorialTitle number={2}>Begin to track your encounters and build your team</TutorialTitle>
                            <TutorialDescription>
                                Under Party displays your current team and a generate team button. The centre of the page displays your living PC box
                                and your death box, you can toggle between the two. The right side is reserved for editing and viewing data about your
                                pokemon
                            </TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_3.png" number={3}>
                        <TutorialContent>
                            <TutorialTitle number={3}>Add your first pair to your PC box</TutorialTitle>
                            <TutorialDescription>
                                You can now start to add your encounters to your PC box, Just select two pokemon from the dropdowns and give them
                                nicknames
                            </TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_4.png" number={4}>
                        <TutorialContent>
                            <TutorialTitle number={4}>View/edit your pair by clicking on them</TutorialTitle>
                            <TutorialDescription>Click on your pair to view their base stats or edit their nicknames or species</TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_5.png" number={5}>
                        <TutorialContent>
                            <TutorialTitle number={5}>Add pairs to your party and choose to highlight available pairs</TutorialTitle>
                            <TutorialDescription>
                                Once you start to add pokemon to your party it may be helpful to check the highlight available pairs option, this
                                fades out pokemon in your box which cannot be added to your party due to duplicate typings
                            </TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_6.png" number={6}>
                        <TutorialContent>
                            <TutorialTitle number={6}>Lock certain pairs in your party</TutorialTitle>
                            <TutorialDescription>
                                Before clicking generate teams you can click the lock button next to certain pairs in your party, this will guarantee
                                that all teams generated will contain the locked pairs
                            </TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_7.png" number={7}>
                        <TutorialContent>
                            <TutorialTitle number={7}>View generated teams and import them into your party</TutorialTitle>
                            <TutorialDescription>
                                The team generation feature suggests possible teams you can build based on your available pairs and your locked party
                                pairs
                            </TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_8.png" number={8}>
                        <TutorialContent>
                            <TutorialTitle number={8}>Click death box to view your dead pairs</TutorialTitle>
                            <TutorialDescription>To add/remove pairs to/from your deathbox check/uncheck the alive checkbox</TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                    <Tutorial image="tutorial_9.png" number={9}>
                        <TutorialContent>
                            <TutorialTitle number={9}>Customise the PC box wallpaper</TutorialTitle>
                            <TutorialDescription>
                                Click Initials {'->'} Settings {'->'} Appearance {'->'} PC box wallpaper to change your PC box background
                            </TutorialDescription>
                        </TutorialContent>
                    </Tutorial>
                </div>
            </section>
            <footer className="grid h-25 place-items-center bg-[#333]">
                <p className="flex items-center gap-1 text-xs text-white/70">
                    All content & design © Christos Efstathiades, 2025-2026. Privacy Policy. Credits.
                    <br /> Pokémon images & names © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc. TM
                </p>
            </footer>
        </>
    );
}
