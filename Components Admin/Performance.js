import styled from "styled-components";

// Styled Components
const PageContainer = styled.div`
  background-color: #f3f4f6;
  height: 100vh;
  flex: 1;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const SearchInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
  outline: none;
`;

const Section = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const PerformanceBox = styled.div`
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
  }

  p {
    font-size: 1.875rem;
    font-weight: bold;
  }
`;

export default function Performance() {
  return (
    <PageContainer>
      <Header>
        <Title>Performance</Title>
        <div>
          <SearchInput type="text" placeholder="Search" />
        </div>
      </Header>

      <Section>
        <SectionTitle>Performance Overview</SectionTitle>
        <GridContainer>
          <PerformanceBox>
            <h3>Research</h3>
            <p>8 hrs</p>
          </PerformanceBox>
          <PerformanceBox>
            <h3>Design</h3>
            <p>6 hrs</p>
          </PerformanceBox>
        </GridContainer>
      </Section>
    </PageContainer>
  );
}
