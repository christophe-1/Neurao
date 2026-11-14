import Link from 'next/link'

export const metadata = {
  title: 'Mentions légales',
}

/** Legal notice page. */
export default function LegalNoticePage() {
  return (
    <main className="legal">
      <h1>Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>
        Le site Neurao est édité par la société Nutri-Logics. Sa forme juridique, son capital, son
        adresse, son numéro SIRET et le nom du directeur de la publication seront indiqués ici avant
        la mise en ligne.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site n’est pas encore hébergé. Le nom, l’adresse et le téléphone de l’hébergeur seront
        indiqués ici avant la mise en ligne.
      </p>

      <h2>Réalisation</h2>
      <p>
        Conception et développement : Arthur Vaesken, dans le cadre du titre professionnel
        Développeur Web et Web Mobile.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, logos et visuels du site appartiennent à Nutri-Logics. Toute reproduction sans
        autorisation écrite est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans la{' '}
        <Link href="/confidentialite" className="text-link">
          politique de confidentialité
        </Link>
        .
      </p>
    </main>
  )
}
