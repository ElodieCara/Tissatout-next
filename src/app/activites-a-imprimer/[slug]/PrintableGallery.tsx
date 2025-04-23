"use client";

export default function PrintableGallery({
    images,
    alt,
}: {
    images: string[];
    alt: string;
}) {
    const main = images[0];
    const leftTall = images[1] ?? images[0];
    const rightTop = images[2] ?? images[1] ?? images[0];
    const rightBottom = images[3] ?? images[2] ?? images[0];

    return (
        <div className="product__visuals">
            <img src={main} alt={alt} className="product__visuals-main" />
            <div className="product__visuals-bottom">
                <img src={leftTall} alt={`${alt} vue enfant`} className="product__visuals-left" />
                <div className="product__visuals-right">
                    <img src={rightTop} alt={`${alt} aperçu 1`} />
                    <img src={rightBottom} alt={`${alt} aperçu 2`} />
                </div>
            </div>
        </div>
    );
}
