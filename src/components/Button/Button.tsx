"use client";

import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, FC, ReactNode } from "react";
import Link from "next/link";

type ButtonBaseProps = {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "tertiary" | "red-button" | "yellow-button"; // ✅ Gère les couleurs du bouton
};

// ✅ Type pour un vrai bouton
type ButtonProps = ButtonBaseProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never; // ❌ Un bouton ne peut pas avoir un href
    };

// ✅ Type pour un lien (`<a>`)
type LinkProps = ButtonBaseProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string; // ✅ Un lien doit avoir un href
    };

// ✅ Union des deux types
type Props = ButtonProps | LinkProps;

const Button: FC<Props> = ({ children, className = "", variant = "primary", href, ...props }) => {
    // ✅ Convertir `large` et `small` en `yellow-button` et `blue-button`
    const sizeToVariant = className.includes("large")
        ? "yellow-button"
        : className.includes("small")
            ? "blue-button"
            : variant;

    const buttonClass = `button ${sizeToVariant} ${className.replace(/large|small/, "").trim()}`;

    if (href) {
        return (
            <Link href={href} className={buttonClass} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {children}
            </Link>
        );
    }

    return (
        <button className={buttonClass} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
    );
};


export default Button;
