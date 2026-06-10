import * as React from 'react';

export function AppContent({ children, ...props }: React.ComponentProps<'main'>) {
    return (
        <main className="mx-auto flex h-full flex-1 flex-row justify-center rounded-xl" {...props}>
            {children}
        </main>
    );
}
