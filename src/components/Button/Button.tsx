import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonProps = {
    children: ReactNode; // Le contenu à l'intérieur du bouton
    onClick?: () => void; // Fonction appelée lors du clic (facultative)
    className?: string; // Classes CSS supplémentaires (facultatif)
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]; // Type du bouton (par défaut "button")
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // Étendre les props HTML du bouton

const Button: FC<ButtonProps> = ({
    children,
    onClick,
    className = "",
    type = "button",
    ...props
}) => {
    return (
        <button
            className={`button ${className}`}
            onClick={onClick}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
