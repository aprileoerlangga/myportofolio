import { createContext, useContext } from 'react';

export const IntroContext = createContext({
  showIntro: true,
  startBrickWipe: () => {},
});

export const useIntro = () => useContext(IntroContext);
