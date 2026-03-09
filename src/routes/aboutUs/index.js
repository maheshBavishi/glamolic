import React from 'react'
import AboutUsHerobanner from './aboutUsHerobanner'
import WhoWeAre from './whoWeAre'
import BrandSection from './brandSection'
import PhotoshootsSection from './photoshootsSection'
import WhyGlamolic from './whyGlamolic'
import TraditionalSection from './traditionalSection'
import ReadytoTransform from '../home/readytoTransform'

export default function AboutUs() {
    return (
        <div>
            <AboutUsHerobanner />
            <WhoWeAre />
            <BrandSection />
            <PhotoshootsSection />
            <WhyGlamolic />
            <TraditionalSection />
            <ReadytoTransform />
        </div>
    )
}
