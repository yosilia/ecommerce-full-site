import styled from "styled-components";
import Center from "./Center";
import Link from "next/link";

const Bg = styled.div`
  background-color: #fafafa;
  padding: 50px 0;
`;

const Heading = styled.h2`
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

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
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
    width: 100px;
    height: 130px;
    object-fit: cover;
    border-radius: 10px;
  }

  p {
    margin-top: 10px;
    font-size: 14px;
    color: #000;
    text-decoration: none;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export default function CategoriesBar({ categories }) {
  return (
    <Bg>
      <Center>
        <Heading>Browse by Category</Heading>
        <Wrapper>
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/collections/${category.slug || category._id}`}
              passHref
            >
              <StyledLink>
                <CategoryCard>
                  <img src={category.image} alt={category.name} />
                  <p>{category.name}</p>
                </CategoryCard>
              </StyledLink>
            </Link>
          ))}
        </Wrapper>
      </Center>
    </Bg>
  );
}
