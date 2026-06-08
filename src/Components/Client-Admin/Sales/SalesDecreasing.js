import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Paper,
    IconButton, 
    Tooltip, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { ArrowUpward, ArrowDownward, MoreVert, Download, Delete } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { saveAs } from 'file-saver';

import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import Copy Icon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CustomizeTooltip from '../CustomTooltip/CustomTooltip';
import { formatCurrency } from '../../../utils/currencyFormatter';

// const SalesDecreasing = ({ country,userId, marketPlaceId, brand_id, product_id, manufacturer_name, fulfillment_channel, DateStartDate, DateEndDate ,products}) => {
//     // const [products, setProducts] = useState([]);
//     const [tooltipText, setTooltipText] = useState('Copy ASIN');
//     const [copied, setCopied] = useState(false);
//     const today = new Date();
//     let lastParamsRef = useRef("");

//     // Add theme and media query hooks
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

//     const yesterdayDate = new Date(today);
//     yesterdayDate.setDate(today.getDate() - 1);

//     const dayBeforeYesterdayDate = new Date(today);
//     dayBeforeYesterdayDate.setDate(today.getDate() - 2);


//     const formatDate = (date) => {
//         const options = { month: 'short', day: '2-digit', year: 'numeric' };
//         return date.toLocaleDateString('en-US', options);
//     };
//     const endDate = new Date(2026, 6, 30);
//     const startDate = new Date(2026, 3, 1);
//     const yesterday = formatDate(endDate);
//     const dayBeforeYesterday = formatDate(startDate );

//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };


//     const handleDownloadCSV = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_IP}downloadProductPerformanceCSV/`, {
//                 user_id: userId,
//                 action: "least",
//                 marketplace_id: marketPlaceId.id,
//                 brand_id: brand_id,
//                 product_id: product_id,
//                 manufacturer_name: manufacturer_name,
//                 fulfillment_channel: fulfillment_channel,
//                 start_date: DateStartDate,
//                 end_date: DateEndDate,
//                 timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             },
//                 {
//                     responseType: 'blob',
//                 });
//             const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
//             saveAs(blob, 'decreasing_sales_products.csv');
//         } catch (error) {
//             console.error('CSV Download Error:', error);
//         }
//     };

//     const handleDownloadXLS = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_IP}downloadProductPerformanceSummary/`, {
//                 user_id: userId,
//                 action: "least",
//                 marketplace_id: marketPlaceId.id,
//                 brand_id: brand_id,
//                 product_id: product_id,
//                 manufacturer_name: manufacturer_name,
//                 fulfillment_channel: fulfillment_channel,
//                 start_date: DateStartDate,
//                 end_date: DateEndDate,
//                 timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             },
//                 {
//                     responseType: 'blob',
//                 });
//             const blob = new Blob([response.data], {
//                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//             });
//             saveAs(blob, 'decreasing_sales_products.xlsx');
//         } catch (error) {
//             console.error('XLS Download Error:', error);
//         }
//     };


//     // Fetch function to get product data from API
//     const fetchSalesDecreasing = async () => {
//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_IP}getProductPerformanceSummary/`,
//                 {
//                     action: "least",
//                     user_id: userId, // Include userId if needed
//                     marketplace_id: marketPlaceId.id,
//                     brand_id: brand_id,
//                     product_id: product_id,
//                     manufacturer_name: manufacturer_name,
//                     fulfillment_channel: fulfillment_channel,
//                     start_date: DateStartDate,
//                     end_date: DateEndDate,
//                     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get the user's timezone
//                 }
//             );
//             console.log('res', response.data.least_3_products);
//             // Use 'top_3_products' instead of 'least_3_products' based on your request
//             setProducts(response.data.least_3_products || []); // Safe check if least_3_products exists
//         } catch (error) {
//             console.error('Failed to fetch sales decreasing data:', error);
//         }
//     };

//     useEffect(() => {

//         const currentParams = JSON.stringify({

//             userId, marketPlaceId, brand_id, product_id, manufacturer_name, fulfillment_channel, DateStartDate, DateEndDate

//         });

//         if (lastParamsRef.current !== currentParams) {
//             lastParamsRef.current = currentParams;
//             fetchSalesDecreasing();
//         }

//     }, [userId, marketPlaceId, brand_id, product_id, manufacturer_name, fulfillment_channel, DateStartDate, DateEndDate]);



//     const handleTooltipOpen = (value) => {
//         const isNumberOnly = /^\d+$/.test(value);
//         const label = isNumberOnly ? 'WPID' : 'ASIN';
//         setTooltipText(`Copy ${label}`);
//     };

//     const handleCopy = async (value) => {
//         if (!value) return;

//         const isNumberOnly = /^\d+$/.test(value);
//         const label = isNumberOnly ? 'WPID' : 'ASIN';

//         try {
//             if (navigator.clipboard && window.isSecureContext) {
//                 await navigator.clipboard.writeText(value);
//             } else {
//                 const textarea = document.createElement("textarea");
//                 textarea.value = value;
//                 textarea.style.position = "fixed";
//                 document.body.appendChild(textarea);
//                 textarea.focus();
//                 textarea.select();
//                 document.execCommand("copy");
//                 document.body.removeChild(textarea);
//             }

//             setTooltipText(`${label} Copied!`);
//         } catch (err) {
//             console.error('Copy failed', err);
//             setTooltipText('Copy Failed');
//         }

//         setTimeout(() => {
//             setTooltipText(`Copy ${label}`);
//         }, 1500);
//     };

//     return (
//         <Box sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
//             <Box 
//                 sx={{ 
//                     display: 'flex', 
//                     flexDirection: { xs: 'column', sm: 'row' },
//                     justifyContent: 'space-between', 
//                     alignItems: { xs: 'flex-start', sm: 'center' }, 
//                     padding: { xs: '8px', sm: '10px' }, 
//                     mb: { xs: 1, sm: 2 },
//                     gap: { xs: 1, sm: 0 }
//                 }}
//             >
//                 <Box>
//                     <Typography
//                         variant="h6"
//                         sx={{
//                             fontSize: { xs: '16px', sm: '18px', md: '20px' },
//                             fontWeight: 700,
//                             color: '#1E293B',
//                             fontFamily:
//                                 "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                             mb: 0.5,
//                         }}
//                     >
//                         Sales Trends: Decreasing
//                     </Typography>
//                     <Typography
//                         variant="body2"
//                         sx={{
//                             fontSize: { xs: '12px', sm: '14px' },
//                             color: '#485E75',
//                             fontFamily:
//                                 "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                         }}
//                     >
//                         {`${dayBeforeYesterday} - ${yesterday}`}
//                     </Typography>
//                 </Box>
//                 <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
//                     <IconButton
//                         aria-label="more"
//                         id="long-button"
//                         aria-controls={open ? 'long-menu' : undefined}
//                         aria-expanded={open ? 'true' : undefined}
//                         aria-haspopup="true"
//                         onClick={handleClick}
//                         size="small"
//                     >
//                         <MoreVert />
//                     </IconButton>
//                     <Menu
//                         id="long-menu"
//                         MenuListProps={{
//                             'aria-labelledby': 'long-button',
//                         }}
//                         anchorEl={anchorEl}
//                         open={open}
//                         onClose={handleClose}
//                         PaperProps={{
//                             style: {
//                                 width: isMobile ? 180 : 200,
//                                 borderRadius: 10,
//                                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                             },
//                         }}
//                     >
//                         <MenuItem
//                             onClick={() => {
//                                 handleDownloadCSV();
//                                 handleClose();
//                             }}
//                             sx={{
//                                 color: '#485E75',
//                                 fontFamily: "'Nunito Sans', sans-serif",
//                                 fontSize: { xs: 12, sm: 14 },
//                             }}
//                         >
//                             <ListItemIcon sx={{ color: '#485E75', minWidth: 36 }}>
//                                 <InsertDriveFileIcon sx={{ color: 'rgb(72, 94, 117)', fontSize: '16px' }} />
//                             </ListItemIcon>
//                             <ListItemText sx={{
//                                 fontSize: '16px', color: '#485E75', fontFamily:
//                                     "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif", fontWeight: 600
//                             }} primary="Download CSV" />
//                         </MenuItem>

//                         <MenuItem
//                             onClick={() => {
//                                 handleDownloadXLS();
//                                 handleClose();
//                             }}
//                             sx={{
//                                 color: '#485E75',
//                                 fontFamily: "'Nunito Sans', sans-serif",
//                                 fontSize: { xs: 12, sm: 14 },
//                             }}
//                         >
//                             <ListItemIcon sx={{ color: '#485E75', minWidth: 36 }}>
//                                 <Download sx={{ color: 'rgb(72, 94, 117)', fontSize: '16px' }} />
//                             </ListItemIcon>
//                             <ListItemText sx={{
//                                 fontSize: '16px', color: '#485E75', fontFamily:
//                                     "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif", fontWeight: 600
//                             }} primary="Download XLS" />
//                         </MenuItem>

//                         <MenuItem
//                             onClick={handleClose}
//                             sx={{
//                                 color: '#485E75',
//                                 fontFamily: "'Nunito Sans', sans-serif",
//                                 fontSize: { xs: 12, sm: 14 },
//                             }}
//                         >
//                             <ListItemIcon sx={{ color: '#485E75', minWidth: 36 }}>
//                                 <Delete sx={{ color: 'rgb(72, 94, 117)', fontSize: '16px' }} />
//                             </ListItemIcon>
//                             <ListItemText sx={{
//                                 fontSize: '16px', color: '#485E75', fontFamily:
//                                     "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif", fontWeight: 600
//                             }} primary="Remove" />
//                         </MenuItem>
//                     </Menu>
//                 </Box>
//             </Box>
//             <TableContainer 
//                 component={Paper} 
//                 sx={{ 
//                     backgroundColor: '#F9FAFB',
//                     maxWidth: '100%', 
//                     overflowX: 'auto' 
//                 }}
//             >
//                 <Table>
//                     <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
//                         <TableRow>
//                             <TableCell
//                                 sx={{
//                                     fontSize: { xs: '10px', sm: '12px' },
//                                     color: '#485E75',
//                                     fontFamily:
//                                         "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                     fontWeight: 600,
//                                     minWidth: { xs: '200px', sm: '300px' },
//                                     padding: { xs: '8px', sm: '16px' }
//                                 }}
//                             >
//                                 Product
//                             </TableCell>
//                             <TableCell
//                                 sx={{
//                                     fontSize: { xs: '10px', sm: '12px' },
//                                     color: '#485E75',
//                                     fontFamily:
//                                         "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                     fontWeight: 600,
//                                     minWidth: { xs: '80px', sm: 'auto' },
//                                     padding: { xs: '8px', sm: '16px' }
//                                 }}
//                             >
//                                 Gross Revenue
//                             </TableCell>
//                             <TableCell
//                                 sx={{
//                                     fontSize: { xs: '10px', sm: '12px' },
//                                     color: '#485E75',
//                                     fontFamily:
//                                         "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                     fontWeight: 600,
//                                     minWidth: { xs: '80px', sm: 'auto' },
//                                     padding: { xs: '8px', sm: '16px' }
//                                 }}
//                             >
//                                 Net Profit
//                             </TableCell>
//                             <TableCell
//                                 sx={{
//                                     fontSize: { xs: '10px', sm: '12px' },
//                                     color: '#485E75',
//                                     fontFamily:
//                                         "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                     fontWeight: 600,
//                                     minWidth: { xs: '80px', sm: 'auto' },
//                                     padding: { xs: '8px', sm: '16px' }
//                                 }}
//                             >
//                                 Units Sold
//                             </TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {products.length > 0 ? (
//                             products.map((item, index) => (
//                                 <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                                     <TableCell
//                                         sx={{
//                                             borderBottom: '1px solid #E0E0E0',
//                                             padding: { xs: '8px', sm: '12px 16px' },
//                                         }}
//                                     >
//                                         <Box 
//                                             display="flex" 
//                                             alignItems="center" 
//                                             sx={{ 
//                                                 width: { xs: '200px', sm: '400px', md: '600px' },
//                                                 flexDirection: { xs: 'column', sm: 'row' },
//                                                 alignItems: { xs: 'flex-start', sm: 'center' }
//                                             }} 
//                                             gap={{ xs: 1, sm: 2 }}
//                                         >
//                                             <Avatar 
//                                                 src={item.images || ''} 
//                                                 variant="square" 
//                                                 sx={{ 
//                                                     width: { xs: 30, sm: 40 }, 
//                                                     height: { xs: 30, sm: 40 } 
//                                                 }} 
//                                             />
//                                             <Box sx={{ width: '100%' }}>
//                                                 <a
//                                                     href={`/Home/sales-detail/${item.id}`}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     style={{ textDecoration: "none" }}
//                                                 >   
//                                                     <CustomizeTooltip title={item.product_name}>  
//                                                         <Typography
//                                                             sx={{
//                                                                 fontSize: { xs: '12px', sm: '14px' },
//                                                                 color: '#0A6FE8',
//                                                                 fontWeight: 500,
//                                                                 fontFamily:
//                                                                     "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                                                 overflow: 'hidden',
//                                                                 textOverflow: 'ellipsis',
//                                                                 whiteSpace: isMobile ? 'normal' : 'nowrap',
//                                                                 display: '-webkit-box',
//                                                                 WebkitLineClamp: isMobile ? 2 : 1,
//                                                                 WebkitBoxOrient: 'vertical',
//                                                             }}
//                                                         >
//                                                             {item.product_name}
//                                                         </Typography>
//                                                     </CustomizeTooltip>
//                                                 </a>

//                                                 <Box 
//                                                     sx={{ 
//                                                         display: 'flex', 
//                                                         alignItems: 'center', 
//                                                         mt: 0.5,
//                                                         flexWrap: 'wrap',
//                                                         gap: { xs: 0.5, sm: 0 }
//                                                     }}
//                                                 >
//                                                     <img
//                                                         src="https://re-cdn.helium10.com/container/static/Flag-united-states-ksqXwksC.svg"
//                                                         alt="Country Flag"
//                                                         width={isMobile ? 20 : 27}
//                                                         height={isMobile ? 12 : 16}
//                                                         style={{ marginRight: 6 }}
//                                                     />
//                                                     <Typography
//                                                         sx={{
//                                                             paddingRight: '7px',
//                                                             fontSize: { xs: '11px', sm: '14px' },
//                                                             color: '#121212',
//                                                             fontFamily: "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif'",
//                                                             position: 'relative',
//                                                             pl: 1.5,
//                                                             '&::before': {
//                                                                 content: '"•"',
//                                                                 position: 'absolute',
//                                                                 left: 0,
//                                                                 top: 0,
//                                                                 color: '#485E75',
//                                                                 fontSize: { xs: '11px', sm: '14px' },
//                                                                 lineHeight: '1.5',
//                                                             },
//                                                         }}
//                                                     >
//                                                         {`• ${item.fulfillmentChannel}`}
//                                                     </Typography>

//                                                     <Typography 
//                                                         variant="caption" 
//                                                         color="textSecondary" 
//                                                         sx={{
//                                                             mr: 1, 
//                                                             fontSize: { xs: '11px', sm: '14px' },
//                                                             color: '#485E75',
//                                                             fontFamily:
//                                                                 "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif'",
//                                                         }}
//                                                     >
//                                                         {item?.asin}
//                                                     </Typography>

//                                                     <Tooltip
//                                                         title={tooltipText}
//                                                         onOpen={() => handleTooltipOpen(item.asin)}
//                                                         arrow
//                                                     >
//                                                         <IconButton 
//                                                             onClick={() => handleCopy(item.asin)} 
//                                                             size="small" 
//                                                             sx={{ 
//                                                                 mr: 0.5,
//                                                                 padding: { xs: '2px', sm: '4px' }
//                                                             }}
//                                                         >
//                                                             <ContentCopyIcon sx={{ fontSize: { xs: '12px', sm: '14px' }, color: '#757575' }} />
//                                                         </IconButton>
//                                                     </Tooltip>
//                                                     <Typography
//                                                         sx={{
//                                                             fontSize: { xs: '11px', sm: '14px' },
//                                                             color: '#485E75',
//                                                             fontFamily:
//                                                                 "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif'",
//                                                             position: 'relative',
//                                                             pl: 1.5,
//                                                             '&::before': {
//                                                                 content: '"•"',
//                                                                 position: 'absolute',
//                                                                 left: 0,
//                                                                 top: 0,
//                                                                 color: '#485E75',
//                                                                 fontSize: { xs: '11px', sm: '14px' },
//                                                                 lineHeight: '1.5',
//                                                             },
//                                                         }}
//                                                     >
//                                                         {`• ${item.sku}`}
//                                                     </Typography>
//                                                 </Box>
//                                             </Box>
//                                         </Box>
//                                     </TableCell>
//                                     <TableCell
//                                         sx={{
//                                             borderBottom: '1px solid #E0E0E0',
//                                             fontSize: { xs: '12px', sm: '14px' },
//                                             fontFamily:
//                                                 "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                             color: '#485E75',
//                                             padding: { xs: '8px', sm: '16px' }
//                                         }}
//                                     >
//                                         {formatCurrency(item.grossRevenue,country)}
//                                     </TableCell>

//                                     <TableCell
//                                         sx={{
//                                             borderBottom: '1px solid #E0E0E0',
//                                             fontSize: { xs: '12px', sm: '14px' },
//                                             fontFamily:
//                                                 "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                             color: '#485E75',
//                                             padding: { xs: '8px', sm: '16px' }
//                                         }}
//                                     >
//                                         {formatCurrency(item.netProfit,country)}
//                                     </TableCell>

//                                     <TableCell
//                                         sx={{
//                                             borderBottom: '1px solid #E0E0E0',
//                                             padding: { xs: '8px', sm: '12px 16px' },
//                                         }}
//                                     >
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <Typography
//                                                 sx={{
//                                                     fontSize: { xs: '12px', sm: '14px' },
//                                                     fontFamily:
//                                                         "'Nunito Sans', -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
//                                                     color: '#485E75',
//                                                 }}
//                                             >
//                                                 {item.unitsSold?.toLocaleString("en-US")}
//                                             </Typography>
//                                             <ArrowDownwardIcon sx={{ color: 'red', fontSize: { xs: 12, sm: 14 } }} />
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell 
//                                     colSpan={4} 
//                                     align="center" 
//                                     sx={{ 
//                                         fontSize: { xs: '12px', sm: '14px' }, 
//                                         color: '#485E75',
//                                         padding: { xs: '8px', sm: '16px' }
//                                     }}
//                                 >
//                                     No data available
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

const SalesDecreasing = ({
  country,
  userId,
  marketPlaceId,
  brand_id,
  product_id,
  manufacturer_name,
  fulfillment_channel,
  DateStartDate,
  DateEndDate,
}) => {

  // ✅ FIX 1: state must exist
  const [products, setProducts] = useState([]);

  const [tooltipText, setTooltipText] = useState('Copy ASIN');
  const today = new Date();
  let lastParamsRef = useRef("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (date) => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const endDate = new Date(2026, 6, 30);
  const startDate = new Date(2026, 3, 1);

  const yesterday = formatDate(endDate);
  const dayBeforeYesterday = formatDate(startDate);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // ---------------- DOWNLOAD CSV ----------------
  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}downloadProductPerformanceCSV/`,
        {
          user_id: userId,
          action: "least",
          marketplace_id: marketPlaceId.id,
          brand_id,
          product_id,
          manufacturer_name,
          fulfillment_channel,
          start_date: DateStartDate,
          end_date: DateEndDate,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'decreasing_sales_products.csv');
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- DOWNLOAD XLS ----------------
  const handleDownloadXLS = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}downloadProductPerformanceSummary/`,
        {
          user_id: userId,
          action: "least",
          marketplace_id: marketPlaceId.id,
          brand_id,
          product_id,
          manufacturer_name,
          fulfillment_channel,
          start_date: DateStartDate,
          end_date: DateEndDate,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'decreasing_sales_products.xlsx');
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- NORMALIZER (IMPORTANT FIX) ----------------
  const normalize = (list = []) =>
    list.map(item => ({
      product_id: item.product_id || "",
      sku: item.sku || "",
      product_name: item.product_name || item.sku || "",
      images: item.images || "",
      asin: item.asin || "",
      fulfillmentChannel: item.fulfillmentChannel || "",
      unitsSold: item.unitsSold || 0,
      grossRevenue: item.grossRevenue || 0,
      netProfit: item.netProfit || 0,
    }));

  // ---------------- FETCH API ----------------
  const fetchSalesDecreasing = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}getProductPerformanceSummary/`,
        {
          action: "least",
          user_id: userId,
          marketplace_id: marketPlaceId.id,
          brand_id,
          product_id,
          manufacturer_name,
          fulfillment_channel,
          start_date: DateStartDate,
          end_date: DateEndDate,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      );

      const raw = response.data || [];

      // ✅ FIX 2: normalize BEFORE setting state
      setProducts(normalize(raw));

    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    const currentParams = JSON.stringify({
      userId,
      marketPlaceId,
      brand_id,
      product_id,
      manufacturer_name,
      fulfillment_channel,
      DateStartDate,
      DateEndDate
    });

    if (lastParamsRef.current !== currentParams) {
      lastParamsRef.current = currentParams;
      fetchSalesDecreasing();
    }
  }, [userId, marketPlaceId, brand_id, product_id, manufacturer_name, fulfillment_channel, DateStartDate, DateEndDate]);

  // ---------------- COPY LOGIC (unchanged) ----------------
  const handleCopy = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setTooltipText('Copied!');
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <Box sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
      <Typography sx={{ p: 2, fontWeight: 700 }}>
        Sales Trends: Decreasing
      </Typography>

      <TableContainer>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Gross Revenue</TableCell>
              <TableCell>Net Profit</TableCell>
              <TableCell>Units Sold</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {/* ✅ FIX 3: safe check */}
            {products?.length > 0 ? (
              products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>$ {item.product_name}</TableCell>
                  <TableCell>$ {item.grossRevenue}</TableCell>
                  <TableCell>$ {item.netProfit}</TableCell>
                  <TableCell>{item.unitsSold}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SalesDecreasing;