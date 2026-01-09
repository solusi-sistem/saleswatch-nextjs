// Portable Text components untuk styling
export const portableTextComponents = {
    marks: {
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
            return (
                <a
                    href={value.href}
                    rel={rel}
                    className="text-[#061551] underline font-medium hover:text-[#061551]/80 transition"
                >
                    {children}
                </a>
            );
        },
        strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
    },
    block: {
        normal: ({ children }: any) => <p className="inline">{children}</p>,
    },
};