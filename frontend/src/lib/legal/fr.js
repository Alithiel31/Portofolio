// Contenu juridique — version française.
//
// Volontairement séparé de src/lib/i18n/fr.js, qui ne contient que des libellés courts et
// serait noyé par cette prose. La structure est identique en anglais (en.js).
//
// Format d'un paragraphe : soit une chaîne, soit un tableau de segments, un segment étant
// une chaîne ou un lien `{ href, text }`. Ce découpage évite d'avoir à passer par {@html}.

export const legal = {
  updated: '6 août 2026',

  mentions: {
    title: 'Mentions légales',
    sections: [
      {
        h: 'Éditeur du site',
        p: [
          'Jacques Duchamplecheval, personne physique agissant à titre privé.',
          "Ce site est un portfolio personnel : il présente un parcours, des compétences et des projets. Aucune activité commerciale n'y est exercée, aucun produit ni service n'y est vendu.",
          [
            'Contact : ',
            {
              href: 'mailto:jacques.duchamplecheval@gmail.com',
              text: 'jacques.duchamplecheval@gmail.com',
            },
          ],
          "Résidence de l'éditeur : Québec, Canada.",
          "L'éditeur n'agissant pas à titre professionnel, son adresse postale n'est pas publiée. Elle est conservée par l'éditeur et communiquée sans délai à toute autorité compétente qui en ferait la demande.",
        ],
      },
      {
        h: 'Directeur de la publication',
        p: ['Jacques Duchamplecheval.'],
      },
      {
        h: 'Hébergement',
        p: [
          "Le site est auto-hébergé sur un serveur personnel administré par l'éditeur et situé au Québec, Canada. L'éditeur est donc également l'hébergeur au sens de la réglementation applicable, et peut être joint à l'adresse électronique indiquée ci-dessus.",
          [
            "L'ensemble du trafic transite par le réseau de Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis (",
            { href: 'https://www.cloudflare.com', text: 'cloudflare.com' },
            '), qui assure la terminaison TLS, la protection contre les attaques et la distribution du contenu.',
          ],
        ],
      },
      {
        h: 'Propriété intellectuelle',
        p: [
          "Les textes, visuels, curriculum vitæ et descriptions de projets présentés sur ce site sont la propriété de l'éditeur, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation préalable est interdite.",
          [
            'Le code source du site est en revanche publié sous licence MIT et consultable librement sur ',
            { href: 'https://github.com/Alithiel31/Portofolio', text: 'GitHub' },
            '.',
          ],
          "Les logos et marques des technologies ou des employeurs cités restent la propriété de leurs détenteurs respectifs et ne sont utilisés qu'à titre illustratif.",
        ],
      },
      {
        h: 'Signalement',
        p: [
          "Tout contenu de ce site qui vous paraîtrait illicite, inexact ou portant atteinte à vos droits peut être signalé à l'adresse de contact ci-dessus. Un signalement circonstancié recevra une réponse dans les meilleurs délais.",
        ],
      },
    ],
  },

  privacy: {
    title: 'Politique de confidentialité',
    sections: [
      {
        h: 'Responsable du traitement',
        p: [
          [
            'Jacques Duchamplecheval, éditeur du site, joignable à ',
            {
              href: 'mailto:jacques.duchamplecheval@gmail.com',
              text: 'jacques.duchamplecheval@gmail.com',
            },
            '.',
          ],
          'Ce document décrit exactement ce que le site fait des données des visiteurs. Il est rédigé à partir du code réellement déployé, dont le source est public.',
        ],
      },
      {
        h: 'Cadre juridique applicable',
        p: [
          "Le site est hébergé au Québec (Canada), mais il est rédigé en français, s'adresse à un public européen et distingue les visiteurs de l'Union européenne dans ses statistiques. Le Règlement général sur la protection des données (RGPD) lui est donc applicable au titre de son article 3, paragraphe 2.",
          "Aucun représentant dans l'Union européenne n'a été désigné : les traitements décrits ci-dessous sont occasionnels, ne portent sur aucune catégorie particulière de données à grande échelle et présentent un risque faible pour les personnes concernées, ce qui relève de la dérogation prévue à l'article 27, paragraphe 2, du RGPD.",
          "S'agissant d'un site personnel sans activité commerciale, il n'est pas exploité par une « entreprise » au sens du droit québécois et n'entre donc pas dans le champ de la Loi 25 ni de la LPRPDE fédérale. Les droits équivalents reconnus par ces textes sont néanmoins ouverts aux visiteurs résidant au Canada, dans les mêmes conditions que les droits RGPD décrits plus bas.",
        ],
      },
      {
        h: 'Ce qui est collecté, et pourquoi',
        p: [
          "Le tableau ci-dessous récapitule l'intégralité des traitements. Aucun autre n'est réalisé.",
        ],
        table: {
          head: ['Traitement', 'Données', 'Base légale', 'Conservation'],
          rows: [
            [
              'Formulaire de contact',
              'Nom, adresse électronique, message',
              'Intérêt légitime à répondre à une sollicitation',
              '3 ans après le dernier échange',
            ],
            [
              "Mesure d'audience",
              'Pays, zone géographique, origine de la visite, date. Aucune adresse IP.',
              'Intérêt légitime à mesurer la fréquentation',
              '25 mois, puis suppression automatique',
            ],
            [
              'Affichage de la localisation',
              'Adresse IP convertie en pays, en mémoire uniquement',
              'Intérêt légitime',
              'Aucune — jamais enregistrée',
            ],
            [
              'Limitation du nombre de requêtes',
              'Empreinte SHA-256 salée de l’adresse IP',
              'Intérêt légitime à prévenir les abus',
              '1 à 15 minutes, en mémoire vive',
            ],
            [
              'Préférence de langue',
              'La valeur « fr » ou « en » dans le stockage local du navigateur',
              'Fonctionnement du site',
              "Jusqu'à effacement par le visiteur",
            ],
          ],
        },
      },
      {
        h: 'Formulaire de contact',
        p: [
          "Les informations saisies dans le formulaire servent uniquement à vous répondre. Elles ne sont pas enregistrées en base de données : elles sont transmises par courrier électronique à la boîte de l'éditeur, via le prestataire d'envoi Resend, puis conservées dans cette boîte le temps nécessaire à l'échange.",
          'Elles ne sont jamais utilisées à des fins de prospection, ni cédées ou revendues à un tiers.',
          "Le nombre d'envois est limité à cinq par quart d'heure et par visiteur, afin d'éviter les abus.",
        ],
      },
      {
        h: "Mesure d'audience",
        p: [
          "Une visite est enregistrée une seule fois par session de navigation. Sont conservés : la page consultée, le pays déduit de l'adresse IP, une zone agrégée (Canada, Europe, Autre), l'origine de la visite réduite au seul nom de domaine du site référent, et l'horodatage.",
          "Ne sont conservés ni l'adresse IP, ni la ville, ni la région, ni aucun identifiant permettant de reconnaître un visiteur d'une session à l'autre ou de le suivre sur d'autres sites. Les données ne sont ni recoupées avec d'autres sources, ni transmises à qui que ce soit. Aucun service d'analyse tiers n'est utilisé : la mesure est intégralement réalisée par le site lui-même.",
          "Ce dispositif répond aux conditions d'exemption de consentement applicables à la mesure d'audience, ce qui explique l'absence de bandeau. Vous pouvez malgré tout vous y opposer à tout moment :",
        ],
        optOut: true,
      },
      {
        h: 'Adresse IP',
        p: [
          'Votre adresse IP est nécessairement transmise au serveur pour que la page vous parvienne. Elle est utilisée le temps de la requête, en mémoire vive, pour déduire un pays et pour calculer une empreinte salée servant à limiter le nombre de requêtes.',
          "Elle n'est écrite ni en base de données, ni dans un journal applicatif conservé. L'empreinte, elle, n'est pas réversible et disparaît au bout de quelques minutes.",
        ],
      },
      {
        h: 'Cookies et stockage local',
        p: [
          'Ce site ne dépose aucun cookie. Deux valeurs seulement sont écrites dans votre navigateur :',
          "— votre préférence de langue, conservée jusqu'à ce que vous effaciez les données du site ;",
          "— un indicateur signalant que la visite en cours a déjà été comptée, effacé à la fermeture de l'onglet.",
          "Cloudflare, en tant qu'intermédiaire technique, est susceptible de déposer ses propres cookies strictement nécessaires à la sécurité et au bon acheminement du trafic.",
        ],
      },
      {
        h: 'Destinataires',
        p: [
          "Aucune donnée n'est vendue, louée ni communiquée à des tiers à des fins publicitaires. Interviennent uniquement, en qualité de sous-traitants techniques :",
          [
            '— Cloudflare, Inc. (États-Unis), pour la sécurisation et la distribution du trafic : ',
            {
              href: 'https://www.cloudflare.com/privacypolicy/',
              text: 'politique de confidentialité',
            },
            ' ;',
          ],
          [
            "— Resend, pour l'acheminement des messages du formulaire de contact : ",
            {
              href: 'https://resend.com/legal/privacy-policy',
              text: 'politique de confidentialité',
            },
            '.',
          ],
          "Par ailleurs, votre navigateur charge la photo de profil depuis GitHub et certaines icônes depuis jsDelivr et Simple Icons. Ces requêtes exposent votre adresse IP à ces services. Les polices de caractères, en revanche, sont servies par ce site : aucune requête n'est adressée à Google.",
        ],
      },
      {
        h: "Hébergement et transferts hors de l'Union européenne",
        p: [
          "Le serveur et la base de données sont situés au Québec, Canada. Les données décrites plus haut y sont donc traitées, hors de l'Union européenne. Le trafic transite en outre par l'infrastructure de Cloudflare, dont la société mère est établie aux États-Unis.",
          "Compte tenu de la nature des données en cause — un message de contact que vous choisissez d'envoyer, et des statistiques de fréquentation dépourvues d'identifiant — ce transfert présente un risque limité. Il vous est signalé ici en toute transparence, afin que vous puissiez en tenir compte avant d'utiliser le formulaire.",
        ],
      },
      {
        h: 'Sécurité',
        p: [
          "Les échanges sont chiffrés de bout en bout par TLS. Le contenu des messages est neutralisé avant d'être inséré dans le courriel de notification, une politique de sécurité du contenu restreint les ressources que la page peut charger, et l'accès aux statistiques agrégées est protégé par un secret comparé en temps constant.",
        ],
      },
      {
        h: 'Vos droits',
        p: [
          "Vous disposez d'un droit d'accès, de rectification, d'effacement et de limitation, ainsi que d'un droit d'opposition et d'un droit à la portabilité de vos données. Les visiteurs résidant au Canada bénéficient en outre des droits équivalents prévus par le droit québécois, notamment le droit à la désindexation.",
          [
            "Pour les exercer, il suffit d'écrire à ",
            {
              href: 'mailto:jacques.duchamplecheval@gmail.com',
              text: 'jacques.duchamplecheval@gmail.com',
            },
            ". Une réponse vous parviendra dans un délai d'un mois.",
          ],
          "En pratique, les seules données susceptibles de vous concerner nominativement sont celles d'un message que vous auriez envoyé : les statistiques de fréquentation ne comportant aucun identifiant, il n'est techniquement pas possible d'y retrouver une visite en particulier.",
          [
            'Si la réponse apportée ne vous satisfait pas, vous pouvez saisir une autorité de contrôle : la ',
            { href: 'https://www.cnil.fr', text: 'CNIL' },
            " en France, l'autorité de protection des données de votre pays de résidence dans l'Union européenne, ou la ",
            { href: 'https://www.cai.gouv.qc.ca', text: "Commission d'accès à l'information" },
            ' au Québec.',
          ],
        ],
      },
      {
        h: 'Modifications',
        p: [
          "Cette politique peut évoluer si le site change. La date de dernière mise à jour figure en tête de page, et l'historique complet des modifications est consultable dans le dépôt public du projet.",
        ],
      },
    ],
  },

  terms: {
    title: "Conditions générales d'utilisation",
    sections: [
      {
        h: 'Objet',
        p: [
          "Les présentes conditions encadrent l'utilisation du site. Le simple fait d'y accéder vaut acceptation. Elles n'ont pas d'autre objet : le site ne propose ni compte utilisateur, ni achat, ni contenu déposé par les visiteurs.",
        ],
      },
      {
        h: 'Accès au site',
        p: [
          "L'accès est libre et gratuit, hors coût de connexion. Le site étant auto-hébergé, son accessibilité n'est garantie ni en continu ni à un niveau de performance déterminé. Il peut être interrompu à tout moment, notamment pour maintenance, sans préavis ni indemnité.",
        ],
      },
      {
        h: 'Propriété intellectuelle',
        p: [
          "Les textes, visuels, curriculum vitæ et descriptions de projets appartiennent à l'éditeur. Vous pouvez les consulter et les citer avec mention de la source, mais toute reproduction, adaptation ou exploitation, notamment commerciale, requiert un accord écrit préalable.",
          'Le code source du site fait exception : publié sous licence MIT, il est réutilisable dans les conditions de cette licence. Celle-ci ne couvre ni les contenus éditoriaux, ni les données personnelles figurant dans les curriculum vitæ.',
        ],
      },
      {
        h: 'Formulaire de contact',
        p: [
          'Le formulaire est destiné aux sollicitations sérieuses : opportunités professionnelles, questions sur les projets présentés, signalements. En sont exclus les envois automatisés, la prospection non sollicitée et tout contenu illicite, injurieux ou trompeur.',
          "L'éditeur se réserve la possibilité d'ignorer un message et de restreindre l'accès au formulaire en cas d'usage abusif.",
        ],
      },
      {
        h: 'Liens externes',
        p: [
          "Le site renvoie vers des ressources extérieures — dépôts de code, démonstrations, réseaux professionnels. Ces sites sont indépendants : leur contenu et leurs pratiques en matière de données ne relèvent pas de la responsabilité de l'éditeur.",
        ],
      },
      {
        h: 'Responsabilité',
        p: [
          "Les informations publiées le sont à titre indicatif et peuvent devenir obsolètes. L'éditeur ne saurait être tenu responsable d'un dommage résultant de l'utilisation du site ou de l'impossibilité d'y accéder.",
        ],
      },
      {
        h: 'Données personnelles',
        p: [
          [
            'Le traitement des données des visiteurs est détaillé dans la ',
            { href: '/confidentialite', text: 'politique de confidentialité', internal: true },
            ', qui fait partie intégrante des présentes conditions.',
          ],
        ],
      },
      {
        h: 'Droit applicable',
        p: [
          'Les présentes conditions sont régies par le droit en vigueur au Québec (Canada). Les dispositions impératives protégeant les consommateurs et les personnes concernées dans leur pays de résidence demeurent applicables.',
        ],
      },
    ],
  },
};
