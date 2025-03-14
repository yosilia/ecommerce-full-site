import Layout from "@/ComponentsAdmin/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  //const { data: session } = useSession();
  const [todayGrossVolume, setTodayGrossVolume] = useState(0);
  const [yesterdayGrossVolume, setYesterdayGrossVolume] = useState(0);
  const [gbpBalance, setGbpBalance] = useState(0);
  //const [chartData, setChartData] = useState([]);

  // All data
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [allTimeChartData, setAllTimeChartData] = useState([]);
  const [last7DaysChartData, setLast7DaysChartData] = useState([]);

  useEffect(() => {
    fetchStripeData();
  }, []);

  async function fetchStripeData() {
    try {
      // Fetch PaymentIntents data from our Next.js API
      const res = await axios.get("/api/stripe/payment-intents");
      const { totalRevenue, paymentIntents } = res.data;

      // Set total revenue (convert cents to GBP)
      setTotalRevenue(totalRevenue / 100);

      // Calculate today's and yesterday's gross volumes and group data for chart
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
      const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

      let todaySum = 0;
      let yesterdaySum = 0;

      // Prepareing data structure for grouping
      const groupedAllTime = {};
      const groupedLast7Days = {};

      // Calculate the timestamp for 7 days ago
      const sevenDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      ).getTime();

      paymentIntents.forEach((pi) => {
        if (pi.status === "succeeded") {
          const createdMs = pi.created * 1000;
          const dateStr = new Date(createdMs).toLocaleDateString("en-GB");
          // All-time grouping
          groupedAllTime[dateStr] = (groupedAllTime[dateStr] || 0) + pi.amount;

          // Last 7 days grouping
          if (createdMs >= sevenDaysAgo) {
            groupedLast7Days[dateStr] =
              (groupedLast7Days[dateStr] || 0) + pi.amount;
          }

          // Sum amounts for today and yesterday
          if (createdMs >= todayStart && createdMs < tomorrowStart) {
            todaySum += pi.amount;
          } else if (createdMs >= yesterdayStart && createdMs < todayStart) {
            yesterdaySum += pi.amount;
          }
        }
      });

      setTodayGrossVolume(todaySum / 100);
      setYesterdayGrossVolume(yesterdaySum / 100);

      // Transform grouped data into an array for Recharts (convert amounts to GBP)
      const allTimeArray = Object.entries(groupedAllTime).map(
        ([date, amount]) => ({
          date,
          amount: amount / 100,
        })
      );
      const last7DaysArray = Object.entries(groupedLast7Days).map(
        ([date, amount]) => ({
          date,
          amount: amount / 100,
        })
      );

      // Sort by date so the chart is in chronological order
      allTimeArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      last7DaysArray.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Update state
      setAllTimeChartData(allTimeArray);
      setLast7DaysChartData(last7DaysArray);

      // Fetch Stripe balance
      const balanceRes = await axios.get("/api/stripe/balance");
      const balanceData = balanceRes.data;
      // Sum available amounts for GBP currency from Stripe balance
      let totalBalance = 0;
      balanceData.available.forEach((bal) => {
        if (bal.currency === "gbp") {
          totalBalance += bal.amount;
        }
      });
      setGbpBalance(totalBalance / 100);
    } catch (err) {
      console.error("Error fetching Stripe data:", err);
    }
  }

  return (
    <Layout>
      <PageContainer>

        {/* Warning for Testers */}
        <div className="warning-banner">
          <p>
            ⚠️ You are accessing the <b>Admin Panel</b> in{" "}
            <b>Temporary Testing Mode</b>. You have been granted admin access
            for testing purposes.
          </p>
          <p>
            🚨 This mode is <b>not secure</b> and will be{" "}
            <b>disabled after Artefact Submission</b>.
          </p>
        </div>

        {/* Top Revenue and Chart Section */}
        <TopStats>
          <h2>Total Revenue: £{totalRevenue.toFixed(2)}</h2>
        </TopStats>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={allTimeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Top Stat Cards */}
        <TopSection>
          <StatBlock>
            <StatTitle>Gross Volume (Today)</StatTitle>
            <StatValue>£{todayGrossVolume.toFixed(2)}</StatValue>
          </StatBlock>
          <VerticalDivider />
          <StatBlock>
            <StatTitle>Gross Volume (Yesterday)</StatTitle>
            <StatValue>£{yesterdayGrossVolume.toFixed(2)}</StatValue>
          </StatBlock>
          <VerticalDivider />
          <StatBlock>
            <StatTitle>GBP Balance</StatTitle>
            <StatValue>£{gbpBalance.toLocaleString()}</StatValue>
            <SmallText>Estimated future payouts</SmallText>
          </StatBlock>
          <VerticalDivider />
          <StatBlock>
            <StatTitle>Payouts</StatTitle>
            <StatValue>View</StatValue>
          </StatBlock>
        </TopSection>

        {/* Overview Section */}
        <OverviewSection>
          <OverviewHeader>
            <div>
              <OverviewTitle>Your overview</OverviewTitle>
              <SubTitle>
                Last 7 days compared to Previous period &bull; Daily
              </SubTitle>
            </div>
          </OverviewHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={last7DaysChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <BottomStats>
            <StatColumn>
              <SmallTitle>Net volume from sales</SmallTitle>
              <BigValue>£0.00</BigValue>
              <SmallText>£6,357.30 previous period</SmallText>
            </StatColumn>
            <StatColumn>
              <SmallTitle>Failed payments</SmallTitle>
              <BigValue>0</BigValue>
              <SmallText>Can take up to 24 hours to update</SmallText>
            </StatColumn>
            <StatColumn>
              <SmallTitle>New customers</SmallTitle>
              <BigValue>0</BigValue>
              <SmallText>0 previous period</SmallText>
            </StatColumn>
          </BottomStats>
        </OverviewSection>
      </PageContainer>
    </Layout>
  );
}

/* -------------------------- STYLED COMPONENTS -------------------------- */

const PageContainer = styled.div`
  padding: 20px;
  font-family: Lora, sans-serif;
`;

const TopStats = styled.div`
  margin-bottom: 20px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  gap: 20px;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatTitle = styled.span`
  font-size: 14px;
  color: #666;
`;

const StatValue = styled.span`
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
`;

const SmallText = styled.span`
  font-size: 12px;
  color: #999;
`;

const VerticalDivider = styled.div`
  height: 60px;
  width: 1px;
  background-color: #eee;
`;

const OverviewSection = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
`;

const OverviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const OverviewTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const SubTitle = styled.p`
  margin: 5px 0 0;
  color: #666;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const BottomStats = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 20px;
`;

const StatColumn = styled.div`
  flex: 1;
`;

const SmallTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const BigValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;
