import React from 'react'
import Herobanner from './herobanner'
import PartnerLogo from './partnerLogo'
import CreatePerfectPhotos from './createPerfectPhotos'
import HowItWorks from './howItWorks'
import WhyChoose from './whyChoose'
import SimpleAffordable from './simpleAffordable'
import TrustedByBrands from './trustedByBrands'
import FaqSection from './faqSection'
import FeaturedArticle from './featuredArticle'
import ReadytoTransform from './readytoTransform'

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <PartnerLogo />
            <CreatePerfectPhotos />
            <HowItWorks />
            <SimpleAffordable />
            <TrustedByBrands />
            <FaqSection />
            <FeaturedArticle />
            <ReadytoTransform />
        </div>
    )
}
