import React from 'react';
import { createContext, useContext, useEffect } from 'react';

const MainContext = createContext();
export const useMainIndex = () => useContext(MainContext);

const MainProvider = ({children}) => {

    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Italiana&family=Ibarra+Real+Nova&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        // 컴포넌트가 언마운트될 때 link 태그 제거
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <MainContext.Provider value=''>
            {children}
        </MainContext.Provider>
    );
};

export default MainProvider;