

export default function Loading() {
    return (
        <div className="loading">
            <img
                src="/loader/tissatoupi-fly.png" // remplace par ton visuel
                alt="Tissatoupi charge la page"
                width={90}
                height={90}
                className="bird"
            />
            <p>Chargement en cours...</p>
        </div>
    );
}
