import Layout from '@/components/Components/Layout';
import { useSession } from 'next-auth/react';
import SearchBar from '@/components/Components/SearchBar';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const { data: session } = useSession();
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [dealsClosed, setDealsClosed] = useState(0);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const ordersRes = await axios.get('/api/orders'); // Fetch orders
      const orders = ordersRes.data || [];

      // Calculate Total Revenue & Orders
      setTotalOrders(orders.length);

      // Mock data for new leads & deals closed (Replace with real API if available)
      setNewLeads(orders.length * 0.7); // Example: 70% of orders are new leads
      setDealsClosed(orders.length * 0.4); // Example: 40% of orders are closed deals
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  return (
    <Layout>
      <Container>
        {/* Top Section: User Profile + Search */}
        <TopSection>
          <WelcomeText>Welcome, {session?.user?.name || 'Admin'} 👋</WelcomeText>
          <SearchBar />
        </TopSection>

        {/* Key Metrics Section with Real Data */}
        <MetricsGrid>
          <MetricCard title="Total Orders" value={totalOrders} percentage="2.3%" />
          <MetricCard title="New Leads" value={newLeads} percentage="8.1%" />
          <MetricCard title="Deals Closed" value={dealsClosed} percentage="-3.0%" />
          <MetricCard title="Revenue" value={`£${totalRevenue.toFixed(2)}`} percentage="-10.6%" />
        </MetricsGrid>

        {/* Performance & Analytics Section */}
        <AnalyticsGrid>
          <PerformanceCard>
            <CardTitle>Performance Overview</CardTitle>
            <ChartImage src="/chart-placeholder.png" alt="Performance Chart" />
          </PerformanceCard>

          <AnalyticsCard>
            <CardTitle>Conversions</CardTitle>
            <ChartImage src="/donut-chart-placeholder.png" alt="Conversions" />
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Location & Pages Analytics */}
        <AnalyticsGrid>
          <WideCard>
            <CardTitle>Sessions by Country</CardTitle>
            <ChartImage src="/world-map-placeholder.png" alt="Map" />
          </WideCard>

          <AnalyticsCard>
            <CardTitle>Top Pages</CardTitle>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Page Path</TableHeader>
                  <TableHeader>Views</TableHeader>
                  <TableHeader>Exit Rate</TableHeader>
                </tr>
              </thead>
              <tbody>
                <PageRow path="/ecommerce" views="405" rate="4.2%" />
                <PageRow path="/dashboard" views="426" rate="2.8%" />
                <PageRow path="/chat" views="3369" rate="12.2%" />
              </tbody>
            </Table>
          </AnalyticsCard>
        </AnalyticsGrid>
      </Container>
    </Layout>
  );
}

// Metric Card Component
const MetricCard = ({ title, value, percentage }) => (
  <MetricCardWrapper>
    <MetricTitle>{title}</MetricTitle>
    <MetricValue>{value}</MetricValue>
    <MetricChange isNegative={percentage.startsWith('-')}>{percentage} Last Week</MetricChange>
  </MetricCardWrapper>
);

// Page Analytics Row
const PageRow = ({ path, views, rate }) => (
  <TableRow>
    <TableData>{path}</TableData>
    <TableData>{views}</TableData>
    <TableRate isNegative={rate.startsWith('-')}>{rate}</TableRate>
  </TableRow>
);

/* Styled Components */
const Container = styled.div`
  padding: 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;
  border-radius: 12px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const WelcomeText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCardWrapper = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const MetricTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const MetricValue = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 4px;
`;

const MetricChange = styled.p`
  font-size: 0.875rem;
  margin-top: 4px;
  color: ${(props) => (props.isNegative ? '#dc2626' : '#16a34a')};
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PerformanceCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  grid-column: span 2;
`;

const AnalyticsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const WideCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  grid-column: span 2;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ChartImage = styled.img`
  width: 100%;
  height: 10rem;
  border-radius: 8px;
  object-fit: cover;
`;

const Table = styled.table`
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 0.5rem;
  text-align: left;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
`;

const TableData = styled.td`
  padding: 0.5rem;
`;

const TableRate = styled.td`
  padding: 0.5rem;
  font-weight: 500;
  color: ${(props) => (props.isNegative ? '#dc2626' : '#16a34a')};
`;

