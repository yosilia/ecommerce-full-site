import styled from "styled-components";
import ProductBox from "../ComponentsUser/ProductBox";

const StyledProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;


export default function ProductsGrid({products}) {
    return (
        <StyledProductsGrid>
         {products?.length > 0 && products.map(product => (
                <ProductBox key={product._id} {...product}/>
            ))}
        </StyledProductsGrid>
    );
}