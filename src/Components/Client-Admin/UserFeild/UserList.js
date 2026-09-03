import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import UserAdd from "../UserFeild/UserAdd";
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

function UserList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleDialogClose = () => {
    setOpenDialog(false);
    fetchClientData();
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async (key = "", direction = "desc") => {
    setLoading(true);
    setError(null);
    try {
      const userData = localStorage.getItem("user");
      let userIds = "";

      if (userData) {
        const data = JSON.parse(userData);
        userIds = data.id;
      }

      const sortValue = direction === "asc" ? 1 : direction === "desc" ? -1 : 1;

      const response = await axios.post(
        `${process.env.REACT_APP_IP}listUsers/`,
        {
          user_id: userIds,
          sort_by: key,
          sort_by_value: sortValue,
        }
      );
      setClientData(response.data.data.users || []);
    } catch (err) {
      setError("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.replace(/^\s+/g, "");
    setSearchTerm(value);
    setPage(0);
  };

  const filteredClientData = (clientData || []).filter(
    (client) =>
      (client.first_name && client.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.role_name && client.role_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedClientData = filteredClientData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredClientData.length / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, marginTop: { xs: "60px", md: "80px" } }}>
      {/* Header Section - Fixed position below navbar */}
      <Box sx={{ 
        p: { xs: 2, md: 2 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: "space-between", md: "flex-end" },  
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 2, md: 0 },
        position: 'fixed',
        top: { xs: '55px', md: '65px' },
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        px: { xs: 2, md: 3 },
        py: 2,
      }}>
        {/* Search Field */}
        <TextField
          variant="outlined"
          value={searchTerm}
          size="small"
          onChange={handleSearchChange}
          autoFocus
          placeholder="Search by Username, Email, Role..."
          fullWidth={isMobile}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "20px" }} />
              </InputAdornment>
            ),
            style: { fontSize: "12px" },
          }}
          sx={{ 
            maxWidth: { xs: '100%', md: '300px' },
            marginRight: { xs: 0, md: 2 }
          }}
        />

        {/* Add New User Button */}
        <Button
          sx={{
            textTransform: "capitalize",
            color: '#fff',
            background: "#000080",
            "&:hover": {
              backgroundColor: "#000080",
            },
            maxWidth: { xs: '100%', md: '150px' },
            width: { xs: '100%', md: 'auto' },
          }}
          variant="contained"
          onClick={() => {
            setSelectedClient(null);
            setOpenDialog(true);
          }} 
        >
          Add New User
        </Button>
      </Box>

      {/* Dialog for Adding/Editing User */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          style: {
            width: isMobile ? '100%' : '600px',
            maxWidth: '100%',
            margin: isMobile ? 0 : '32px',
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : '80vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: { xs: '1.1rem', md: '1.25rem' }
        }}>
          {selectedClient ? "Edit Client" : "Add New User"}
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <UserAdd
          clientData={selectedClient}
          onClose={handleDialogClose}
          reloadUser={fetchClientData}
        />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, mt: 8 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" align="center" sx={{ p: 2, mt: 8 }}>
          {error}
        </Typography>
      )}

      {/* Main Content Area - Adjusted margin for fixed header */}
      <Box sx={{ mt: { xs: 12, md: 10 } }}>
        {/* Client Data Display */}
        {!loading && !error && (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <Box>
                {paginatedClientData.length > 0 ? (
                  paginatedClientData.map((client) => (
                    <Card key={client.id} sx={{ mb: 2, p: 2 }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={8}>
                            <Typography 
                              variant="subtitle1" 
                              fontWeight="bold"
                              component={Link}
                              to={`/Home/users/userdetails/${client.id}?page=${page}`}
                              sx={{ 
                                textDecoration: "none", 
                                color: "black",
                                display: "block",
                                mb: 1
                              }}
                            >
                              {client?.first_name || "N/A"} {client?.last_name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                              {client.email || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              Role: {client.role_name || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: "right" }}>
                            <IconButton 
                              onClick={() => {
                                setSelectedClient(client);
                                setOpenDialog(true);
                              }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography align="center" sx={{ p: 3 }}>
                    No data available.
                  </Typography>
                )}
              </Box>
            ) : (
              /* Desktop Table View */
              <TableContainer 
                component={Paper} 
                sx={{ 
                  maxHeight: "60vh",
                  overflowY: "overlay",
                  overflowX: "overlay",
                  "&::-webkit-scrollbar": {
                    height: "2px",
                    width: "2px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "10px",
                  },
                }}
              >
                <Table size="small">
                  <TableHead sx={{
                    backgroundColor: "#f6f6f6",
                    position: "sticky",
                    right: 0,
                    top: 0,
                    zIndex: 2,
                    textAlign: "center",
                  }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Username
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Role
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedClientData.length > 0 ? (
                      paginatedClientData.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <Link to={`/Home/users/userdetails/${client.id}?page=${page}`} style={{ textDecoration: 'none', color: 'black' }}>
                              {client?.first_name || "N/A"} {client?.last_name || "N/A"}
                            </Link>
                          </TableCell>
                          <TableCell>{client.email || "N/A"}</TableCell>
                          <TableCell>{client.role_name || "N/A"}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => {
                              setSelectedClient(client);
                              setOpenDialog(true);
                            }}>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>

      {/* Pagination UI */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: "flex-end", 
        mt: 2,
        gap: { xs: 2, md: 1 }
      }}>
        {/* Rows per page selector */}
        <Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          size="small"
          sx={{ 
            minWidth: 70,
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <MenuItem value={25}>25/page</MenuItem>
          <MenuItem value={50}>50/page</MenuItem>
          <MenuItem value={75}>75/page</MenuItem>
        </Select>

        {/* Pagination component */}
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handleChangePage}
          color="primary"
          size="small"
          sx={{
            '& .MuiPagination-ul': {
              justifyContent: { xs: 'center', md: 'flex-start' }
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default UserList;