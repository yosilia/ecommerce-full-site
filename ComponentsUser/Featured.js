import Center from "@/componentsuser/Center"; 
import styled from "styled-components";
import Button from "./Button";
import { primary } from "@/lib/colors";
import { useContext } from "react";
import { CartContext } from "@/componentsuser/CartContext"; 

const Bg = styled.div`
    background-color: #FAFAFA;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    justify-center;
`;

const Description = styled.p`
    color: #aaa;
    font-size: 1rem;
`;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    img{
    max-width: 100%
    }
`;

const Column = styled.div`
    display: flex; 
    align-items: center; 
`;

//const ButtonWrapper = styled.div`
    //display: flex;
    //gap: 5px;
//`;


export default function Featured({product}) {
    const {addProduct} = useContext(CartContext);
    function addProductToCart() {
      addProduct(product._id);
    }

    return (
        <Bg>
            <Center>
                    <Column>
                        <div>
                        <Title>Shop Our Featured Collection</Title>
                        <Description>
                        Discover the perfect blend of African heritage and contemporary English fashion. 
                        Our handmade clothing is crafted with care and passion, bringing together 
                        traditional African native wear and stylish English designs. 
                        Whether you’re looking for vibrant patterns, bold styles, or timeless pieces, 
                        you’ll find something unique and special at DM Touch. 
                        Explore our latest featured products and elevate your wardrobe today!</Description>
                        <Button>Explore Collection</Button>
                        </div>
                     </Column>
                <Column>
                   
                </Column>
            
            </Center>
        </Bg>
    );
}
