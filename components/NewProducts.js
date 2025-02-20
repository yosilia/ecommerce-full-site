import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
`;

const H2Title = styled.h2`
    font size: 2rem;
    font-weight: Normal;
    margin: 30px 0 20px;
`;

export default function NewProducts({products}) {
    return (
        <Center>
            <H2Title>New Arrivals</H2Title>
        <ProductsGrid>
            {products?.length > 0 && products.map(product => (
                <ProductBox {...product}/>
            ))}
        </ProductsGrid>    
        </Center>
        
    );
}