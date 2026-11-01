import { createContext, useContext } from 'react';

export const IntroContext = createContext({ showIntro: true });

export const useIntro = () => useContext(IntroContext);
