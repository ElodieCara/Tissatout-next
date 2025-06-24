"use client";

import Image from 'next/image';
import enveloppeIcon from '../../../public/icons/enveloppe.png';

export default function NewsletterBanner() {
    return (
        <section className="newsletter">
            <div className="newsletter-banner">
                <div className="newsletter-banner__image">
                    <Image
                        src={enveloppeIcon}
                        alt="Enveloppe avec cœur"
                        width={134}
                        height={134}
                        priority
                        className='rotate'
                    />
                </div>
                <div className="newsletter-banner__container">

                    <h2 className="newsletter-banner__text">
                        Recevez des idées douces et éducatives
                    </h2>
                    <p>Abonnez-vous à notre newsletter pour recevoir directement nos astuces par email.</p>
                    <button
                        className="newsletter-banner__cta"
                        onClick={() => (window.location.href = "/newsletter")}
                    >
                        Je m’inscris
                    </button>
                </div>
            </div>
        </section>
    );
}
