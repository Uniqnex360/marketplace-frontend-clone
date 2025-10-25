import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CustomBarChart from "./CustomBarChart";
import DottedCircleLoading from "../../Loading/DotLoading";
import { format } from "date-fns";
import DonutChart from "./DonutChart";
import { formatCurrency } from "../../../utils/currencyFormatter";
import { fetchMarketplaceList } from "../../../utils/marketplace";
import { useMarketplace } from "../../../utils/MarketplaceProvider";

const CardComponent = ({
  widgetData,
  country,
  marketPlaceId,
  DateStartDate,
  DateEndDate,
  brand_id,
  product_id,
  manufacturer_name,
}) => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [market, setMarket] = useState("");
  const [shipping, setShipping] = useState({});
  const [fulfillment, setFulfillment] = useState({});
//   const [categories, setCategories] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filter, setFilter] = useState("all");
  const [salesData, setSalesData] = useState([]);
  const [chartOffset, setChartOffset] = useState(0);
  const chartContainerRef = useRef(null);
  const lastFetchParamsRef = useRef(null);
  const {categories,loading:marketplaceLoading,error}=useMarketplace()

  const userData = localStorage.getItem("user");
  let userIds = "";

  if (userData) {
    const data = JSON.parse(userData);
    userIds = data.id;
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleScroll = (direction) => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.offsetWidth;
      const scrollAmount = containerWidth * 0.8; // Scroll 80% of the container width

      if (direction === "left") {
        chartContainerRef.current.scrollLeft -= scrollAmount;
        setChartOffset((prevOffset) => Math.max(0, prevOffset - scrollAmount));
      } else {
        chartContainerRef.current.scrollLeft += scrollAmount;
        setChartOffset((prevOffset) => prevOffset + scrollAmount);
      }
    }
  };
  
//   useEffect(()=>{
//     fetchMarketplaceListAPI()
//   },[userIds])

// const fetchMarketplaceListAPI = async () => {
//     try {
//       const categoryData = await fetchMarketplaceList(userIds,'Cardcomponent');
//             setCategories(categoryData);

//     } catch (error) {
//       console.error("Error fetching marketplace list:", error);
//     }
//   };
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch marketplace categories
      // const marketplaceResponse = await axios.get(
      //     `${process.env.REACT_APP_IP}getMarketplaceList/`,
      //     { params: { user_id: userIds } }
      //   );
      //   const categoryData = marketplaceResponse.data.data.map((item) => ({
      //     id: item.id,
      //     name: item.name,
      //     imageUrl: item.image_url,

      // }));
    //   const categoryData = await fetchMarketplaceList(userIds);
    //   setCategories(categoryData);

      // Fetch sales analytics
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_IP}salesAnalytics/`,
        {
          country:country,
          preset: widgetData,
          marketplace_id: marketPlaceId.id,
          date_range: filter,
          start_date: DateStartDate,
          end_date: DateEndDate,
          user_id: userIds,
          brand_id: brand_id,
          product_id: product_id,
          manufacturer_name: manufacturer_name,
          timezone: "US/Pacific",
        }
      );

      if (orderResponse.data?.data) {
        setOrder(orderResponse.data.data);

        // Map the data to format it for the chart
        const formattedData = orderResponse.data.data.order_days.map(
          (item) => ({
            date: new Date(item.date), // Convert date string to Date object
            revenue: item.order_value,
            orderCount: item.order_count, // Add order count
          })
        );

        setSalesData(formattedData);
      }

      const orderSam = await axios.get(
        `${process.env.REACT_APP_IP}ordersCountForDashboard/`,
        {
          params: {
            country:country,
            preset: widgetData,
            marketplace_id: marketPlaceId.id,
            start_date: DateStartDate,
            end_date: DateEndDate,
            user_id: userIds,
            brand_id: brand_id,
            product_id: product_id,
            manufacturer_name: manufacturer_name,
            timezone: "US/Pacific",
          },
        }
      );

      if (orderSam.data?.data) {
        const { total_order_count, ...marketplaces } = orderSam.data.data;
        setTotalOrders(total_order_count?.value || 0);

        if (marketPlaceId.id === "all") {
          const pieData = Object.entries(marketplaces)
            .filter(([name, data]) => data?.count > 0)
            .map(([name, data], index) => ({
              name,
              value: data.count,
              percentage: parseFloat(data.percentage || 0).toFixed(2),
              color: getPastelColor(name, index),
              orderValue: data.order_value || 0,
            }));
          setOrderData(pieData);
        } else {
          const marketplaceName = Object.keys(marketplaces)[0];
          const marketplaceData = marketplaces[marketplaceName];

          if (marketplaceData) {
            console.log("000banu", marketplaceData);
            let color = "#000000"; // Default color
            if (marketplaceName === "Amazon") color = "#0b3954";
            else if (marketplaceName === "Walmart") color = "#ff6663";
            else if (marketplaceName === "custom") color = "#9381ff";

            setOrderData([
              {
                name: marketplaceName,
                value: marketplaceData.value || marketplaceData.count,
                percentage: parseFloat(marketplaceData.percentage || 0).toFixed(
                  2
                ),
                color: color,
                orderValue: marketplaceData?.order_value || 0, // Bind orderValue here
              },
            ]);
          } else {
            setOrderData([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = JSON.stringify({
      preset: widgetData,
      country,
      marketplace_id: marketPlaceId?.id,
      start_date: DateStartDate,
      end_date: DateEndDate,
      filter,
      brand_id,
      product_id,
      manufacturer_name,
      user_id: userIds,
    });

    // Only fetch if params have changed
    if (lastFetchParamsRef.current !== currentParams) {
      lastFetchParamsRef.current = currentParams;
      fetchData();
    }
  }, [
    widgetData,
    marketPlaceId?.id,
    DateStartDate,
    DateEndDate,
    filter,
    brand_id,
    product_id,
    manufacturer_name,
    country,
    JSON.stringify(product_id),
  ]);
const PASTEL_COLORS = {
  Amazon: "#A8D5E2",      // Pastel Blue
  Walmart: "#FFB5A7",     // Pastel Coral
  custom: "#C5A3FF",      // Pastel Purple
  default: [
    "#FFD4A3",            // Pastel Peach
    "#B5EAD7",            // Pastel Mint
    "#FFDFD3",            // Pastel Pink
    "#E2F0CB",            // Pastel Lime
    "#C7CEEA",            // Pastel Lavender
    "#FFCCD5",            // Pastel Rose
    "#B4E7CE",            // Pastel Teal
    "#FFF4A3",            // Pastel Yellow
  ]
};
const getPastelColor = (name, index) => {
    if (PASTEL_COLORS[name]) {
      return PASTEL_COLORS[name];
    }
    return PASTEL_COLORS.default[index % PASTEL_COLORS.default.length];
  };
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading||marketplaceLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">
          <DottedCircleLoading />
        </Typography>
      </Box>
    );
  }

  const formatDateTick = (tickItem) => {
    return format(tickItem, "MMM dd"); // Format date as "Month Day" (e.g., "Jan 01")
  };
   const renderCustomLabel = (entry) => {
    return entry.name;
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              mb: 2,
              maxWidth: 600,
              marginLeft: "-10px",
              minHeight: 330,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "1px solid #ccc", // ✅ Adds the border
              borderRadius: 2, // Optional: rounded corners
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px:4
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: "0.9rem", margin: 0 }}
                >
                  🛒 Total Orders
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ marginBottom: 0 }}
                >
                  {totalOrders}
                </Typography>
              </Box>


{totalOrders > 0 ? (
  <Box sx={{ position: 'relative' }}>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={orderData}
          dataKey="value"
          nameKey="name"
          innerRadius={35}
          outerRadius={60}
          cx="50%"
          cy="50%"
        >
          {orderData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const { payload } = props;
            if (payload) {
              const marketplaceData = orderData.find(
                (item) => item.name === payload.name
              );
              if (marketplaceData) {
                const orderValue = marketplaceData.orderValue || 0;
                return [
                  `Order Count: ${marketplaceData.value} | Order Value: ${formatCurrency(orderValue)}`
                ];
              }
            }
            return [value];
          }}
          contentStyle={{ fontSize: "14px" }}
        />
      </PieChart>
    </ResponsiveContainer>
    
    {/* Custom Legend Below Chart */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        mt: 2,
        px: 2,
      }}
    >
      {orderData.map((entry, index) => (
        <Box
          key={`legend-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.75rem',
              color: '#333',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {entry.name} ({entry.percentage}%)
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
) : (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 200,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        textAlign: "center",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#888",
      }}
    >
      No total orders found
    </Typography>
  </Box>
)}
            </CardContent>
          </Card>
        </Grid>

        {/* Custom Bar Chart */}
        {/* <Grid item xs={12} sm={6}>
                    <CustomBarChart marketPlaceId={marketPlaceId} />
                </Grid> */}

        {/* <Grid item xs={12} sm={4}>
                       
                <DonutChart marketPlaceId={marketPlaceId}  DateStartDate={DateStartDate} DateEndDate={DateEndDate}/>
                 
                
                        </Grid> */}
      </Grid>
    </Box>
  );
};

export default CardComponent;
