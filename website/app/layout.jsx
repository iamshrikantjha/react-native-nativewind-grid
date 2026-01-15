import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '@fontsource/host-grotesk/400.css';
import '@fontsource/host-grotesk/700.css';
import '@fontsource/host-grotesk/800.css';

export const metadata = {
    title: 'NativeWind Grid',
}

const navbar = (
    <Navbar
        logo={<b>NativeWind Grid</b>}
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © NativeWind Grid.</Footer>

export default async function RootLayout({ children }) {
    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
        >
            <Head />
            <body style={{ fontFamily: "'Host Grotesk', sans-serif" }}>
                <Layout
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/iamshrikantjha/react-native-nativewind-grid/tree/main/website"
                    footer={footer}
                >
                    {children}
                </Layout>
            </body>
        </html>
    )
}
