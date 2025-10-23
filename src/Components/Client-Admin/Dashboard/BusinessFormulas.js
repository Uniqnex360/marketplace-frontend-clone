import React from 'react'
import { 
  Box, 
  Divider, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid
} from "@mui/material"

const BusinessFormulas = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formulas = [
        {
            name: "Gross Revenue",
            formula: "Order Total"
        },
        {
            name: "Expenses",
            formula: "COGS + Channel Fees"
        },
        {
            name: "COGS",
            formula: "(Product Cost * Quantity)+Shipping cost by merchant"
        },
        {
            name: "Channel Fees",
            formula: "Channel Fees * Quantity"
        },
        {
            name: "Net Profit",
            formula: "(Product Price + Shipping Cost by customer + Funding + Item Promotion Discount) - (Channel Fee + COGS + Vendor Discount + Shipping Promotion Discount)"
        },
        {
            name: "Profit Margin",
            formula: "(Net Profit/Gross Revenue)*100"
        },
        {
            name: "ROI",
            formula: "(Net Profit/Expenses)*100"
        }
    ]
    
    const dataFields = [
        { field: "Product Cost", source: "Manual" },
        { field: "Ship Cost (Merchant Cost)", source: "From ShipStation" },
        { field: "Product Price (Customer Price)", source: "From API" },
        { field: "Shipping Price by Customer", source: "From ShipStation" },
        { field: 'Funding', source: "Manual" },
        { field: "Referral Fee", source: "Calculating on 0.15 * product price" },
        { field: "Tax", source: "From API" },
        { field: "Promotion Discount", source: "From API" },
        { field: "Ship Promotion Discount", source: "From API" },
        { field: "Vendor Discount", source: "Manual" },
    ]
    
    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
            <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                gutterBottom 
                sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}
            >
                Business Rules
            </Typography>
            
            {/* Formulas Section */}
            <Paper 
                elevation={2} 
                sx={{ 
                    padding: { xs: 2, sm: 3 }, 
                    mb: 4, 
                    border: '1px solid', 
                    borderColor: '#000080',
                    borderRadius: 2
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {formulas.map((item, index) => (
                        <Card 
                            key={index} 
                            variant="outlined"
                            sx={{
                                border: '1px solid',
                                borderColor: '#000080',
                                borderRadius: 2,
                                '&:hover': {
                                    boxShadow: 2
                                }
                            }}
                        >
                            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'flex-start' },
                                    gap: { xs: 1, sm: 2 }
                                }}>
                                    <Typography 
                                        variant={isMobile ? 'subtitle1' : 'h6'} 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            minWidth: { xs: 'auto', sm: '150px' }, 
                                            color: '#000080',
                                            fontSize: { xs: '0.9rem', sm: '1rem' }
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography 
                                        variant='body2' 
                                        sx={{ 
                                            fontFamily: 'monospace',
                                            padding: "4px 8px", 
                                            borderRadius: '4px',
                                            backgroundColor: 'grey.50',
                                            border: '1px solid',
                                            borderColor: 'grey.300',
                                            flex: 1,
                                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word'
                                        }}
                                    >
                                        {item.formula}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Paper>

            <Divider sx={{ my: 3 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        backgroundColor: 'white', 
                        px: 2,
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                    }}
                >
                    Data Sources
                </Typography>
            </Divider>

            {/* Data Sources Section */}
            <Paper elevation={2} sx={{ padding: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 'semibold', 
                        mb: 3,
                        textAlign: { xs: 'center', md: 'left' },
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                >
                    Data Sources
                </Typography>
                
                {isMobile ? (
                    // Mobile Card View
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {dataFields.map((row, index) => (
                            <Card key={index} variant="outlined" sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography 
                                                variant="subtitle2" 
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: '#000080',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {row.field}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ fontSize: '0.8rem' }}
                                            >
                                                {row.source}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    // Desktop Table View
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label='data sources table'>
                            <TableHead>
                                <TableRow sx={{ borderBottom: '2px solid', borderColor: '#000080' }}>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        color: '#000080',
                                        borderBottom: 'none'
                                    }}>
                                        Fields
                                    </TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        color: '#000080',
                                        borderBottom: 'none'
                                    }}>
                                        Data fetched from ?
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataFields.map((row, index) => (
                                    <TableRow 
                                        key={index} 
                                        sx={{
                                            borderBottom: '1px solid',
                                            borderColor: '#000080',
                                            '&:hover': {
                                                backgroundColor: 'rgba(25,118,210,0.04)'
                                            }
                                        }}
                                    >
                                        <TableCell 
                                            component='th' 
                                            scope='row' 
                                            sx={{ 
                                                fontWeight: 'medium', 
                                                borderBottom: "none",
                                                fontSize: { sm: '0.9rem', md: '1rem' }
                                            }}
                                        >
                                            {row.field}
                                        </TableCell>
                                        <TableCell 
                                            sx={{ 
                                                color: 'text.secondary', 
                                                borderBottom: 'none',
                                                fontSize: { sm: '0.9rem', md: '1rem' }
                                            }}
                                        >
                                            {row.source}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    )
}

export default BusinessFormulas