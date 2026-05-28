import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

const SITE_URL = "https://www.thetasrc.in";
const SITE_NAME = "THETA 2K26";
const DEFAULT_DESCRIPTION =
  "THETA 2K26 (Theta 2026) is SASTRA's national-level techno-management fest with hackathons, robotics, workshops, events and registrations.";

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
          "Theta 2026",
          "THETA 2K26",
          "Theta SASTRA",
          "SASTRA techno-management fest",
        ],
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ["Theta 2026", "Theta SASTRA"],
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon-512.png`,
        sameAs: ["https://www.instagram.com/theta_src/"],
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
      <title>{head.title}</title>

      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#050505" />
      {!hasDescription && (
        <meta name="description" content={defaultDescription.value} />
      )}
      <meta property="og:site_name" content={SITE_NAME} />
      <link rel="icon" href="/favicon.ico" sizes="any" />
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
