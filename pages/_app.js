import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "@/context/AuthContext";

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400..700&display=swap');

  body {
    background-color: #FAFAFA;
    padding:0;
    margin:0;
    font-family: "Lora", serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
       <GlobalStyles />
      <CartContextProvider>
       <Component {...pageProps} />  
      </CartContextProvider> 
      </AuthProvider>
      
    </>
  );
}
