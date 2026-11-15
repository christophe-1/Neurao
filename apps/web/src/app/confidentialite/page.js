export const metadata = {
  title: 'Politique de confidentialité',
}

/** Privacy policy page (GDPR). */
export default function PrivacyPage() {
  return (
    <main className="legal">
      <h1>Politique de confidentialité</h1>

      <h2>Responsable du traitement</h2>
      <p>
        Nutri-Logics est responsable des données collectées sur Neurao. L’adresse de contact pour
        toute question sur vos données sera indiquée ici avant la mise en ligne.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>À la création du compte : prénom, nom, adresse email et mot de passe.</li>
        <li>
          Le mot de passe n’est jamais enregistré en clair : seule son empreinte est conservée.
        </li>
        <li>Aucune donnée de paiement n’est collectée.</li>
      </ul>

      <h2>Finalité et base légale</h2>
      <p>
        Ces données servent uniquement à créer et à gérer votre compte, et à vous connecter. Leur
        traitement est nécessaire à l’exécution du service que vous demandez (article 6.1.b du
        RGPD).
      </p>

      <h2>Cookie</h2>
      <p>
        Le site dépose un seul cookie, <code>sid</code>, quand vous vous connectez. Il contient un
        identifiant de session tiré au hasard, et rien d’autre. Il est strictement nécessaire à la
        connexion et ne sert ni à la publicité ni à la mesure d’audience : il ne demande donc pas
        votre consentement. Il expire au bout de 2 heures, ou dès que vous vous déconnectez.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données du compte sont conservées tant que le compte existe. La session de connexion est
        supprimée à la déconnexion, ou automatiquement au bout de 2 heures.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données ne sont accessibles qu’à Nutri-Logics. Elles ne sont ni vendues ni cédées à des
        tiers.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, leur
        portabilité, ou vous opposer à leur traitement, en écrivant à l’adresse de contact
        ci-dessus. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).
      </p>
    </main>
  )
}
