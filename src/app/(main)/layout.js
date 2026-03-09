import Footer from '@/components/footer'
import Header from '@/components/header'

export default function layout({ children }) {
    return (
        <>
            <Header />
            <div className='height-changer'>
                {children}
            </div>
            <Footer />
        </>
    )
}
