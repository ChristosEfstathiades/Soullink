export default function Tutorial({ image, number, children }: { image: string; number: number; children: React.ReactNode }) {
    return (
        <>
            <div className="mb-8 flex flex-col items-center justify-center lg:flex-row">
                <div className="mr-8 hidden size-13 shrink-0 items-center justify-center rounded-full bg-white lg:flex">
                    <span className="text-3xl font-semibold text-[#E34234]">{number}</span>
                </div>
                {children}
                <img className="w-full max-w-md rounded-lg shadow-xl" src={`/storage/tutorial/${image}`} alt={`Image showcasing step ${number}`} />
            </div>
        </>
    );
}
