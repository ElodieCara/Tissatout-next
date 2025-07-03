"use client";

import Link from "next/link";
import { useGlobalLoading } from "./GlobalLoadingContext";

export default function LinkWithLoading({
    href,
    children,
    ...props
}: React.ComponentProps<typeof Link>) {
    const { setLoading } = useGlobalLoading();

    const handleClick = () => {
        setLoading(true);
    };

    return (
        <Link href={href} {...props} onClick={handleClick}>
            {children}
        </Link>
    );
}
