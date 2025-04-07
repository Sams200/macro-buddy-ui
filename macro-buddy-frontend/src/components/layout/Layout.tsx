import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
    withoutFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, withoutFooter = false }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
            <Header />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
            {!withoutFooter && <Footer />}
        </div>
    );
};

export default Layout;