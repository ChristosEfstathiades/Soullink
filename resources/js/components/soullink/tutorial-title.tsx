export default function TutorialTitle({ children, number }: { children: React.ReactNode; number: number }) {
    return (
        <>
            <h3 className="flex items-center text-xl font-semibold text-white">
                <div className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-white lg:hidden">
                    <span className="text-xl font-semibold text-[#E34234]">{number}</span>
                </div>
                {children}
            </h3>
        </>
    );
}
