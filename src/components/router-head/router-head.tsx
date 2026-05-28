import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

const SITE_URL = "https://www.thetasrc.in";
const SITE_NAME = "THETA 2K26 - SASTRA";
const SITE_TITLE =
  "THETA 2K26 | Official SASTRA Techno-Management Fest Website";
const DEFAULT_DESCRIPTION =
  "THETA 2K26 is the official SASTRA techno-management fest website for events, workshops, robotics, hackathons, sponsors, schedule, contacts and registrations.";
const SEO_KEYWORDS = [
  "theta 2k26",
  "theta 2026",
  "theta official website",
  "theta website",
  "theta sastra website",
  "theta sastra",
  "theta src",
  "thetasrc",
  "thetasrc.in",
  "www.thetasrc.in",
  "sastra theta",
  "sastra theta 2026",
  "sastra theta 2k26",
  "sastra techno management fest",
  "sastra technical fest",
  "sastra management fest",
  "sastra university fest",
  "sastra deemed university fest",
  "sastra src fest",
  "src kumbakonam fest",
  "sastra kumbakonam events",
  "theta national level fest",
  "theta national level techno management fest",
  "theta events",
  "theta 2026 events",
  "theta 2k26 events",
  "theta event registration",
  "theta registrations",
  "theta schedule",
  "theta roadmap",
  "theta sponsors",
  "theta contact",
  "theta hackathon",
  "theta robotics",
  "theta workshops",
  "theta competitions",
  "theta symposium",
  "theta tech fest",
  "theta management events",
  "theta college fest",
  "theta innovation fest",
  "theta student fest",
  "kuruksastra",
  "kuruksastra website",
  "kuruksastra official website",
  "kuruksastra 2k26",
  "kuruksastra 2026",
  "kuruksastra sastra",
  "kuruksastra events",
  "kuruksastra tech fest",
  "theta 2k27",
  "theta 2027",
  "kuruksastra 2k27",
  "kuruksastra 2027",
  "theta 2k227",
  "kuruksastra 2k227",
  "techno management fest tamil nadu",
  "college tech fest tamil nadu",
  "national level symposium tamil nadu",
  "student events tamil nadu",
  "hackathon tamil nadu",
  "robotics competition tamil nadu",
  "SASTRA Deemed University",
  "Shanmugha Arts Science Technology Research and Academy",
].join(", ");

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  const canonicalUrl = new URL(loc.url.pathname, SITE_URL).href;
  const hasDescription = head.meta.some((m) => m.name === "description");
  const defaultDescription = useSignal(DEFAULT_DESCRIPTION);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: [
          "THETA 2K26",
          "Theta 2026",
          "Theta Official Website",
          "Theta SASTRA Website",
          "Theta SASTRA",
          "Theta SRC",
          "Theta Tech Fest",
          "SASTRA techno-management fest",
        ],
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/events?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ["THETA 2K26", "Theta 2026", "Theta SASTRA", "Theta SRC"],
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon-512.png`,
        image: `${SITE_URL}/og-image.png`,
        sameAs: ["https://www.instagram.com/theta_src/"],
      },
      {
        "@type": "Event",
        "@id": `${SITE_URL}/#event`,
        name: "THETA 2K26",
        alternateName: ["Theta 2026", "Theta SASTRA", "Theta SRC"],
        description: DEFAULT_DESCRIPTION,
        url: `${SITE_URL}/`,
        image: [`${SITE_URL}/og-image.png`, `${SITE_URL}/icon-512.png`],
        startDate: "2026-03-15T09:00:00+05:30",
        endDate: "2026-03-17T18:00:00+05:30",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "SASTRA Deemed University",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kumbakonam",
            addressRegion: "Tamil Nadu",
            addressCountry: "IN",
          },
        },
        organizer: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/data/content.json");
      const data = await res.json();
      if (data?.seo?.defaultDescription) {
        defaultDescription.value = data.seo.defaultDescription;
      }
    } catch {
      defaultDescription.value = DEFAULT_DESCRIPTION;
    }
  });

  return (
    <>
      <title>{head.title || SITE_TITLE}</title>

      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#050505" />
      <meta name="application-name" content="THETA 2K26" />
      <meta name="apple-mobile-web-app-title" content="THETA 2K26" />
      <meta name="keywords" content={SEO_KEYWORDS} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      {!hasDescription && (
        <meta name="description" content={defaultDescription.value} />
      )}
      <meta property="og:site_name" content={SITE_NAME} />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href="/favicon-48x48.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/icon-192.png"
      />
      <link rel="shortcut icon" href="/favicon-48x48.png" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={JSON.stringify(structuredData).replace(
          /</g,
          "\\u003c",
        )}
      />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
