import styled from "styled-components";
import Center from "./Center";
import Link from "next/link";

const Bg = styled.div`
  background-color: #fafafa;
  padding: 50px 0;
`;

const P = styled.h2`
  margin: 0;
  font-weight: normal;
  text-align: center;
  margin-bottom: 20px;
`;
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  justify-content: center;
  text-align: center;
  padding-top: 20px; 
`;

const CategoryCard = styled.div`
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 100px; /* Set a fixed width */
    height: 130px; /* Ensure all images have the same height */
    object-fit: cover; /* Crop images to fit */
    border-radius: 10px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px; /* Ensure all category cards have the same height */
`;

export default function CategoriesBar({ categories }) {
  return (
    <Bg>
      <Center>
        <P>Browse by Category</P>
        <Wrapper>
          {categories.map((category, index) => (
            <Link
            key={index}
            href={`/collections/${category.slug || category._id}`} // ✅ Ensure slug or fallback to _id
            passHref
          >
            <CategoryWrapper>
              <CategoryCard>
                <img src={category.image} alt={category.name} />
                <p>{category.name}</p>
              </CategoryCard>
            </CategoryWrapper>
          </Link>
          
          
          ))}
        </Wrapper>
      </Center>
    </Bg>
  );
}
