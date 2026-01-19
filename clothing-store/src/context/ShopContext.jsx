// Shop Context - Stores shop details
import React, { createContext, useContext } from 'react';

const ShopContext = createContext();

export const useShop = () => {
    return useContext(ShopContext);
};

// Shop Details - Used throughout the application
const shopDetails = {
    name: "Samy Silks & Readymades",
    phone: "99949 89322",
    address: "N.H. Main Road, Viluppuram – 638056, Tamil Nadu",
    email: "samysilks@gmail.com",
    gst: "33AABCS1234A1ZB",
    tagline: "Traditional Elegance, Modern Style",
    products: "Silks, Sarees, Readymades (Men, Women, Kids)",
    workingHours: "9:00 AM - 9:00 PM",
    socialMedia: {
        facebook: "https://facebook.com/samysilks",
        instagram: "https://instagram.com/samysilks",
        twitter: "https://twitter.com/samysilks"
    }
};

export const ShopProvider = ({ children }) => {
    const value = {
        shopDetails
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export { shopDetails };
