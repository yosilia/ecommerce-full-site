import Center from "@/components/Center"; 
import styled from "styled-components";
import PrimaryButton from "./PrimaryButton";
import { primary } from "@/lib/colors";

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


export default function Featured() {
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
                        <PrimaryButton>Explore Collection</PrimaryButton>
                        </div>
                     </Column>
                <Column>
                    {/*<img src="/images/image 5.jpg"></img>*/}
                </Column>
            
            </Center>
        </Bg>
    );
}
