export default function RenderSchema({ seoData }) {
  if (!seoData) return null;

  return (
    <>
      {seoData?.Organization_Schema && (
        <script
          id="Organization_Schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.Organization_Schema }}
        />
      )}
      {seoData?.FAQ_Schema && (
        <script
          id="FAQ_Schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.FAQ_Schema }}
        />
      )}
      {seoData?.BreadcrumbList_Schema && (
        <script
          id="BreadcrumbList_Schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.BreadcrumbList_Schema }}
        />
      )}
    </>
  );
}
