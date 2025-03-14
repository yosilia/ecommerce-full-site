import { SessionProvider } from "next-auth/react";
import { CartContextProvider } from "@/ComponentsUser/CartContext";
import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "@/context/AuthContext";

// Global Styles
const GlobalStyles = createGlobalStyle`
  body {
    background-color: #FAFAFA;
    padding: 0;
    margin: 0;
    font-family: "Lora", serif;
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
