import Footer from '@/components/footer'
import Header from '@/components/header'
import VerificationTrigger from '@/components/whatsappVerificationModal/VerificationTrigger'

export default function layout({ children }) {
    return (
        <>
            <Header />
            <div className='height-changer'>
                {children}
            </div>
            <Footer />
            <VerificationTrigger />
        </>
    )
}
