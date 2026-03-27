import AboutUs from '@/routes/aboutUs'
import { GET_SEO } from '@/utils/seo';
import React from 'react'

export async function generateMetadata() {
  const seoData = await GET_SEO("about-us");
  return {
    title: seoData.title,
    description: seoData.description,
    // keywords: seoData.keywords,
    authors: [{ name: "Glamolic AI" }],
    publisher: "Glamolic AI Team",
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      locale: "en_US",
      siteName: "Glamolic AI",
      type: "website",
      images: [
        {
          url: seoData.ogImage,
          alt: seoData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@GlamolicAI",
      site: "@GlamolicAI",
      title: seoData.title,
      description: seoData.description,
      images: [seoData.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: seoData.url,
    },
  };
}

export default function page() {
    return (
        <div>
            <AboutUs />
        </div>
    )
}
