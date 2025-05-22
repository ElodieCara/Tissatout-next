"use client";

interface AgeFilterProps {
    selectedAge: string | null;
    ages: string[];
    onChange: (age: string | null) => void;
}

export default function AgeFilter({ selectedAge, ages, onChange }: AgeFilterProps) {
    return (
        <div className="age-filter">
            <h4 className="age-filter__title">Filtrer par âge</h4>
            <div className="age-filter__buttons">
                <button
                    className={`age-filter__button ${selectedAge === null ? "age-filter__button--active" : ""}`}
                    onClick={() => onChange(null)}
                >
                    Tous âges
                </button>
                {ages.map((age) => (
                    <button
                        key={age}
                        className={`age-filter__button ${selectedAge === age ? "age-filter__button--active" : ""}`}
                        onClick={() => onChange(age)}
                    >
                        {age}
                    </button>
                ))}
            </div>
        </div>
    );
}
