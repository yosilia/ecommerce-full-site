import styled from "styled-components";
import Center from "../ComponentsUser/Center";
import ProductsGrid from "../ComponentsUser/ProductsGrid";


const H2Title = styled.h2`
    font size: 2rem;
    font-weight: Normal;
    margin: 30px 0 20px;
`;

export default function NewProducts({products}) {
    return (
        <Center>
            <H2Title>New Arrivals</H2Title>
            <ProductsGrid products={products}/>
        </Center>
        
    );
}