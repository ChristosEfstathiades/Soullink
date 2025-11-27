export default function TutorialContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="mb-4 max-w-md lg:mr-4 lg:mb-0 lg:w-md lg:max-w-none">{children}</div>
        </>
    );
}
