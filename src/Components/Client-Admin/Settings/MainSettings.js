// src/components/SuperAdmin/Dashboard/MainSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Input,
  Switch,
  Typography,
} from "@mui/material";

const MainSettings = () => {
  const [categories,setCategories] = useState([]);
  const [file,setFile]=useState([])
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [updateProductCost,setUpdateProductCost]=useState(false)
  const userData = localStorage.getItem("user");
  let userIds = "";

  if (userData) {
    const data = JSON.parse(userData);
    userIds = data.id;
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(`${process.env.REACT_APP_IP}obtainManufactureUnitList/?user_id=${userIds}`);
        console.log('9090',categoryResponse)
        setCategories(categoryResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleFileChange=(e)=>{
    setFile(e.target.files[0])
  }
  const handleUpload=async()=>{
    if (!file)
    {
      setMessage("Please select a file to upload")
      return
    }
    const formData=new FormData()
    formData.append('pdf',file)
    setLoading(true)
    setMessage('')
    try {
      const response=await axios.post(`${process.env.REACT_APP_IP}uploadPDF`,
      formData,{
        headers:{
          'Content-Type':"multipart/form-data",
        }
      }
    )
    setMessage(response.data.message)
    } catch (error) {
      console.error("Error uploading file",error)
      setMessage("Failed to upload file,Try again!")
    }
    
  }

  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
      textAlign: "center",
      flexDirection: "column",
      marginTop:'5%'
    }}
  >
    <Typography variant="h6" color="textSecondary">
      This feature will be available soon!
    </Typography>
    <FormControlLabel control={
      <Switch checked={updateProductCost}
      onChange={(e)=>setUpdateProductCost(e.target.checked)}
      name='UpdateProductCost'
      color='primary'
      />
      
    }
    label='Update Product Cost via PDF'/>
    {updateProductCost && (
      <Box sx={{marginTop:"20px"}}>
        <Typography variant='h6' color='textSecondary'>
          Upload PDF
        </Typography>
        <Input type='file' accept='.pdf' onChange={handleFileChange}/>
        <Button variant='contained' color='primary' onClick={handleUpload} disabled={loading} sx={{marginTop:'20px'}}>
          {loading ? <CircularProgress size={24}/>:"Upload"}
        </Button>
        {message && (
          <Typography variant='body2' color={message.includes('success')?"green":'error'}>
            {message}
          </Typography>
        )}
      </Box>
    )}
    <Typography variant="body2" color="textSecondary">
      We're working on it. Stay tuned!
    </Typography>
  </Box>
  
  );
};

export default MainSettings;
