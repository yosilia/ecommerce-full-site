// pages/_app.js
import { SessionProvider } from "next-auth/react";
import { CartContextProvider } from "@/componentsuser/CartContext";
import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "@/context/AuthContext";

const GlobalStyles = createGlobalStyle`
  /* Reset & box-sizing */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #__next {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #FAFAFA;
    font-family: "Lora", serif;
    overscroll-behavior: none;
  }
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <GlobalStyles />
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
