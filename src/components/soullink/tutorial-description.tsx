export default function TutorialDescription({ children }: { children: React.ReactNode }) {
    return (
        <>
            <p className="mt-2 text-sm text-white">{children}</p>
        </>
    );
}
