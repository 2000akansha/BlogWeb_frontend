import React from "react";

const Footer = () => (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#020213] to-[#091C38] text-white py-4 z-50">
        <div className="container mx-auto">
            <p className="text-center text-sm">
                © {new Date().getFullYear()}. All rights reserved.
            </p>
        </div>
    </footer>
);

export default Footer;