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
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  MoreVert,
  Download,
  Delete
} from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { saveAs } from 'file-saver';
import CustomizeTooltip from '../CustomTooltip/CustomTooltip';
import { formatCurrency } from '../../../utils/currencyFormatter';

const SalesIncreasing = ({
  country,
  userId,
  marketPlaceId,
  brand_id,
  product_id,
  manufacturer_name,
  fulfillment_channel,
  DateStartDate,
  DateEndDate,
  products: initialProducts = [],
  widgetDate,
}) => {

  // ❌ FIX: prevent duplicate state name clash
  const [products, setProducts] = useState(initialProducts || []);

  const [tooltipText, setTooltipText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const lastParamsRef = useRef("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const today = new Date();

  const formatDate = (date) => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const yesterday = formatDate(new Date(today.getTime() - 86400000));
  const dayBeforeYesterday = formatDate(new Date(today.getTime() - 2 * 86400000));

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // =========================
  // DOWNLOAD CSV
  // =========================
  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}downloadProductPerformanceCSV/`,
        {
          action: "top",
          user_id: userId,
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
      saveAs(blob, 'increasing_sales_products.csv');
    } catch (error) {
      console.error('CSV Download Error:', error);
    }
  };

  // =========================
  // DOWNLOAD XLS
  // =========================
  const handleDownloadXLS = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}downloadProductPerformanceSummary/`,
        {
          action: "top",
          user_id: userId,
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

      saveAs(blob, 'increasing_sales_products.xlsx');
    } catch (error) {
      console.error('XLS Download Error:', error);
    }
  };

  // =========================
  // FIX: SAFE NORMALIZER
  // =========================
  const normalizeProducts = (data = []) => {
    return (Array.isArray(data) ? data : []).map((item) => ({
      product_id: item.product_id || "",
      sku: item.sku || "",
      product_name: item.product_name || "",
      images: item.images || "",
      asin: item.asin || "",
      fulfillmentChannel: item.fulfillmentChannel || item.fulfillment_channel || "",
      unitsSold: item.unitsSold ?? 0,
      grossRevenue: item.grossRevenue ?? 0,
      totalCogs: item.totalCogs ?? 0,
      vendor_funding: item.vendor_funding ?? 0,
      netProfit: item.netProfit ?? 0,
      margin: item.margin ?? 0,
    }));
  };

  // =========================
  // FETCH API
  // =========================
  const fetchSalesIncreasing = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}getProductPerformanceSummary/`,
        {
          user_id: userId,
          target_date: dayjs().format('DD/MM/YYYY'),
          marketplace_id: marketPlaceId.id,
          brand_id,
          product_id,
          manufacturer_name,
          fulfillment_channel,
          start_date: DateStartDate,
          end_date: DateEndDate,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preset: widgetDate,
        }
      );

      // ❌ FIX MAIN BUG HERE
      const data = response.data || [];

      setProducts(normalizeProducts(data));
    } catch (error) {
      console.error('Failed to fetch sales increasing data:', error);
      setProducts([]);
    }
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    const currentParams = JSON.stringify({
      userId,
      marketPlaceId,
      brand_id,
      product_id,
      manufacturer_name,
      fulfillment_channel,
      DateStartDate,
      DateEndDate,
    });

    if (lastParamsRef.current !== currentParams) {
      lastParamsRef.current = currentParams;
      fetchSalesIncreasing();
    }
  }, [
    userId,
    marketPlaceId,
    brand_id,
    product_id,
    manufacturer_name,
    fulfillment_channel,
    DateStartDate,
    DateEndDate,
  ]);

  // =========================
  // COPY TOOLTIP
  // =========================
  const handleTooltipOpen = (value) => {
    const isNumberOnly = /^\d+$/.test(value);
    const label = isNumberOnly ? 'WPID' : 'ASIN';
    setTooltipText(`Copy ${label}`);
  };

  const handleCopy = async (value) => {
    if (!value) return;

    const isNumberOnly = /^\d+$/.test(value);
    const label = isNumberOnly ? 'WPID' : 'ASIN';

    try {
      await navigator.clipboard.writeText(value);
      setTooltipText(`${label} Copied!`);
    } catch (err) {
      setTooltipText('Copy Failed');
    }

    setTimeout(() => setTooltipText(`Copy ${label}`), 1500);
  };

  // =========================
  // RETURN UI (UNCHANGED STRUCTURE)
  // =========================
  return (
    <Box sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>

      {/* HEADER */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2
      }}>
        <Box>
          <Typography variant="h6">
            Sales Trends: Increasing
          </Typography>
          <Typography variant="body2">
            {/* {dayBeforeYesterday} - {yesterday} */}
          </Typography>
        </Box>

        <IconButton onClick={handleClick}>
          <MoreVert />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleDownloadCSV}>Download CSV</MenuItem>
          <MenuItem onClick={handleDownloadXLS}>Download XLS</MenuItem>
        </Menu>
      </Box>

      {/* TABLE */}
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
            {products.length > 0 ? (
              products.map((item, index) => (
                <TableRow key={index}>

                  <TableCell>
                    {item.sku}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(item.grossRevenue, country)}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(item.netProfit, country)}
                  </TableCell>

                  <TableCell>
                    {item.unitsSold}
                  </TableCell>

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


export default SalesIncreasing;