// Legal content — English version. Mirrors the structure of fr.js exactly.
//
// Paragraph format: either a string, or an array of segments, a segment being a string or
// a link `{ href, text }`. This split avoids having to reach for {@html}.

export const legal = {
  updated: 'August 6, 2026',

  mentions: {
    title: 'Legal notice',
    sections: [
      {
        h: 'Site publisher',
        p: [
          'Jacques Duchamplecheval, an individual acting in a private capacity.',
          'This site is a personal portfolio: it presents a career path, a set of skills and a number of projects. No commercial activity is carried out here, and nothing is sold through it.',
          [
            'Contact: ',
            {
              href: 'mailto:jacques.duchamplecheval@gmail.com',
              text: 'jacques.duchamplecheval@gmail.com',
            },
          ],
          'Publisher residence: Quebec, Canada.',
          'As the publisher is not acting in a professional capacity, no postal address is published. It is retained by the publisher and disclosed without delay to any competent authority that requests it.',
        ],
      },
      {
        h: 'Publication director',
        p: ['Jacques Duchamplecheval.'],
      },
      {
        h: 'Hosting',
        p: [
          'The site is self-hosted on a personal server administered by the publisher and located in Quebec, Canada. The publisher is therefore also the host under applicable regulations, and can be reached at the email address above.',
          [
            'All traffic passes through the network of Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States (',
            { href: 'https://www.cloudflare.com', text: 'cloudflare.com' },
            '), which handles TLS termination, attack mitigation and content delivery.',
          ],
        ],
      },
      {
        h: 'Intellectual property',
        p: [
          'The text, images, résumés and project descriptions on this site belong to the publisher unless stated otherwise. Reproducing or reusing them without prior permission is not allowed.',
          [
            'The site’s source code, on the other hand, is published under the MIT licence and freely available on ',
            { href: 'https://github.com/Alithiel31/Portofolio', text: 'GitHub' },
            '.',
          ],
          'Logos and trademarks of the technologies or employers mentioned remain the property of their respective owners and appear for illustrative purposes only.',
        ],
      },
      {
        h: 'Reporting an issue',
        p: [
          'Any content on this site that strikes you as unlawful, inaccurate or harmful to your rights can be reported to the contact address above. A detailed report will receive a prompt reply.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Privacy policy',
    sections: [
      {
        h: 'Data controller',
        p: [
          [
            'Jacques Duchamplecheval, publisher of this site, reachable at ',
            {
              href: 'mailto:jacques.duchamplecheval@gmail.com',
              text: 'jacques.duchamplecheval@gmail.com',
            },
            '.',
          ],
          'This document describes exactly what the site does with visitor data. It is written from the code actually deployed, the source of which is public.',
        ],
      },
      {
        h: 'Applicable legal framework',
        p: [
          'The site is hosted in Quebec, Canada, but it is written in French, addresses a European audience and singles out European Union visitors in its statistics. The General Data Protection Regulation (GDPR) therefore applies to it under Article 3(2).',
          'No representative has been designated in the European Union: the processing described below is occasional, involves no special category of data on a large scale and presents a low risk to the people concerned, which falls under the derogation set out in Article 27(2) of the GDPR.',
          'As a personal site with no commercial activity, it is not operated by an "enterprise" within the meaning of Quebec law and therefore falls outside the scope of Law 25 and of the federal PIPEDA. The equivalent rights granted by those laws are nonetheless open to visitors residing in Canada, on the same terms as the GDPR rights described below.',
        ],
      },
      {
        h: 'What is collected, and why',
        p: ['The table below covers every processing activity. No others take place.'],
        table: {
          head: ['Processing', 'Data', 'Legal basis', 'Retention'],
          rows: [
            [
              'Contact form',
              'Name, email address, message',
              'Legitimate interest in replying to an enquiry',
              '3 years after the last exchange',
            ],
            [
              'Audience measurement',
              'Country, geographic zone, visit origin, timestamp. No IP address.',
              'Legitimate interest in measuring traffic',
              '25 months, then deleted automatically',
            ],
            [
              'Location display',
              'IP address resolved to a country, in memory only',
              'Legitimate interest',
              'None — never recorded',
            ],
            [
              'Rate limiting',
              'Salted SHA-256 fingerprint of the IP address',
              'Legitimate interest in preventing abuse',
              '1 to 15 minutes, in memory',
            ],
            [
              'Language preference',
              'The value "fr" or "en" in the browser’s local storage',
              'Site functionality',
              'Until cleared by the visitor',
            ],
          ],
        },
      },
      {
        h: 'Contact form',
        p: [
          'What you type into the form is used solely to reply to you. It is not saved to a database: it is sent by email to the publisher’s inbox through the delivery provider Resend, then kept in that inbox for as long as the exchange requires.',
          'It is never used for marketing, nor shared or sold to a third party.',
          'Submissions are capped at five per quarter of an hour per visitor, to prevent abuse.',
        ],
      },
      {
        h: 'Audience measurement',
        p: [
          'A visit is recorded once per browsing session. What is kept: the page viewed, the country derived from the IP address, an aggregated zone (Canada, Europe, Other), the visit origin reduced to the referring site’s domain name only, and a timestamp.',
          'What is not kept: the IP address, the city, the region, or any identifier that would let a visitor be recognised from one session to the next or followed across other sites. The data is neither cross-referenced with other sources nor passed on to anyone. No third-party analytics service is used: measurement is performed entirely by the site itself.',
          'This setup meets the conditions for consent exemption applicable to audience measurement, which is why there is no banner. You can nonetheless object at any time:',
        ],
        optOut: true,
      },
      {
        h: 'IP address',
        p: [
          'Your IP address is necessarily sent to the server for the page to reach you. It is used for the duration of the request, in memory, to derive a country and to compute a salted fingerprint used for rate limiting.',
          'It is written neither to the database nor to any retained application log. The fingerprint itself is not reversible and disappears after a few minutes.',
        ],
      },
      {
        h: 'Cookies and local storage',
        p: [
          'This site sets no cookies. Only two values are written to your browser:',
          '— your language preference, kept until you clear the site’s data;',
          '— a flag indicating that the current visit has already been counted, cleared when you close the tab.',
          'Cloudflare, acting as a technical intermediary, may set its own cookies strictly necessary for security and traffic routing.',
        ],
      },
      {
        h: 'Recipients',
        p: [
          'No data is sold, rented or disclosed to third parties for advertising purposes. Only the following act as technical processors:',
          [
            '— Cloudflare, Inc. (United States), for traffic security and delivery: ',
            { href: 'https://www.cloudflare.com/privacypolicy/', text: 'privacy policy' },
            ';',
          ],
          [
            '— Resend, for delivering contact form messages: ',
            { href: 'https://resend.com/legal/privacy-policy', text: 'privacy policy' },
            '.',
          ],
          'Separately, your browser loads the profile picture from GitHub and some icons from jsDelivr and Simple Icons. Those requests expose your IP address to these services. Fonts, by contrast, are served by this site: no request is made to Google.',
        ],
      },
      {
        h: 'Hosting and transfers outside the European Union',
        p: [
          'The server and the database sit in Quebec, Canada. The data described above is therefore processed there, outside the European Union. Traffic also passes through Cloudflare’s infrastructure, whose parent company is established in the United States.',
          'Given the nature of the data involved — a contact message you choose to send, and traffic statistics carrying no identifier — this transfer presents a limited risk. It is disclosed here in full transparency, so that you can take it into account before using the form.',
        ],
      },
      {
        h: 'Security',
        p: [
          'Traffic is encrypted end to end with TLS. Message content is escaped before being inserted into the notification email, a content security policy restricts what the page is allowed to load, and access to the aggregated statistics is protected by a secret compared in constant time.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'You have the right to access, rectify, erase and restrict the processing of your data, as well as the right to object and the right to data portability. Visitors residing in Canada additionally have the equivalent rights provided by Quebec law, including the right to de-indexation.',
          [
            'To exercise them, simply write to ',
            {
              href: 'mailto:jacques.duchamplecheval@gmail.com',
              text: 'jacques.duchamplecheval@gmail.com',
            },
            '. You will receive a reply within one month.',
          ],
          'In practice, the only data that could identify you by name is that of a message you have sent: since the traffic statistics carry no identifier, it is technically impossible to trace a particular visit within them.',
          [
            'If the reply does not satisfy you, you may refer the matter to a supervisory authority: the ',
            { href: 'https://www.cnil.fr', text: 'CNIL' },
            ' in France, the data protection authority of your country of residence in the European Union, or the ',
            { href: 'https://www.cai.gouv.qc.ca', text: "Commission d'accès à l'information" },
            ' in Quebec.',
          ],
        ],
      },
      {
        h: 'Changes',
        p: [
          'This policy may change as the site does. The date it was last updated appears at the top of the page, and the full history of changes can be read in the project’s public repository.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of use',
    sections: [
      {
        h: 'Purpose',
        p: [
          'These terms govern the use of this site. Accessing it constitutes acceptance. They have no other purpose: the site offers no user account, no purchase and no visitor-submitted content.',
        ],
      },
      {
        h: 'Access',
        p: [
          'Access is free, apart from your own connection costs. As the site is self-hosted, its availability is guaranteed neither continuously nor at any given level of performance. It may be interrupted at any time, notably for maintenance, without notice or compensation.',
        ],
      },
      {
        h: 'Intellectual property',
        p: [
          'The text, images, résumés and project descriptions belong to the publisher. You may read and quote them with attribution, but any reproduction, adaptation or exploitation — commercial in particular — requires prior written agreement.',
          'The site’s source code is the exception: published under the MIT licence, it may be reused on that licence’s terms. The licence covers neither the editorial content nor the personal data contained in the résumés.',
        ],
      },
      {
        h: 'Contact form',
        p: [
          'The form is meant for genuine enquiries: professional opportunities, questions about the projects shown, reports of an issue. Automated submissions, unsolicited marketing and any unlawful, abusive or misleading content are excluded.',
          'The publisher reserves the right to ignore a message and to restrict access to the form in the event of abuse.',
        ],
      },
      {
        h: 'External links',
        p: [
          'The site links out to external resources — code repositories, demos, professional networks. Those sites are independent: their content and their data practices are not the publisher’s responsibility.',
        ],
      },
      {
        h: 'Liability',
        p: [
          'The information published here is indicative and may become outdated. The publisher cannot be held liable for any damage arising from use of the site or from being unable to access it.',
        ],
      },
      {
        h: 'Personal data',
        p: [
          [
            'How visitor data is handled is set out in the ',
            { href: '/confidentialite', text: 'privacy policy', internal: true },
            ', which forms an integral part of these terms.',
          ],
        ],
      },
      {
        h: 'Governing law',
        p: [
          'These terms are governed by the law in force in Quebec, Canada. Mandatory provisions protecting consumers and data subjects in their country of residence remain applicable.',
        ],
      },
    ],
  },
};
