"use client"
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MachinesInstalled } from 'src/sections/machinedata/overview-machineInstalled';
import {TotalCollections} from 'src/sections/machinedata/overview-totalCollections';
import { MachinesRunning } from 'src/sections/machinedata/overview-machinesRunning';
import { ItemsDispends } from 'src/sections/machinedata/overview-itemsDispends';

import { StockEmpty } from 'src/sections/machinedata/stockEmpty';
import { StockLow } from 'src/sections/machinedata/stockLow';
import { BurningEnabled } from 'src/sections/machinedata/burningEnabled';
import { BurningCycles } from 'src/sections/machinedata/totalBurningCycles';
import { useEffect ,useState} from 'react';
import moment from 'moment';
import $ from 'jquery';
import { useRouter } from 'next/router';
import MultiSelectAll from 'src/sections/machinedata/machinestatusSelector';
import StickyHeadTable from 'src/sections/machinedata/table';
import { Gradient } from '@mui/icons-material';


const Page=()=>{
    const [data,setData]=useState({data:[],dataAll:[]});
    const [machine,setMachines]=useState(0)
    const [online,setOnline]=useState(0);
    const [ofline,setOfline]=useState(0);
    const [cash,setCash]=useState(0);
    const [stokEmpty,setStockEmpty]=useState(0);
    const [stockLow,setStockLow]=useState(0);
    const [burningEnabled,setBurningEnambled]=useState(0);
    const [burningCycles,setBurningCycles]=useState(0);
    // const [minuteWiseData,setMinuteWiseData]=useState([]);
    const router=useRouter();
    const filterOnline = q => moment().diff(moment.utc((q.lastHeartbeatTime || q.lastOnTime).replace('Z', '')), 'minute') < 5;
    const filterStock = q => moment().diff(moment.utc((q.lastHeartbeatTime || q.lastOnTime).replace('Z', '')), 'minute') < 5;
  
  
  
  const amountText = amt => {
    amt = amt || 0;
   
    if(amt>=10000000)
    {
      var cr = parseInt(amt / 100000) / 100;
      const Cr=parseFloat(cr.toFixed(2))
      return Cr+' Cr';
    }
    else if(amt>=100000)
    {
      var l = parseInt(amt / 1000) / 100;
      const L=parseFloat(l.toFixed(2))
      return L+' L';
    }
    else if(amt>=1000)
    {
      var k = parseInt(amt / 10) / 100;
      const K=parseFloat(k.toFixed(2))
      return K+' K';
    }
    else
    {
      return amt;
    }
   
   
  
    // return cr < 1 ? l < 1 ? k + ' K' : l + ' L' : cr + ' Cr';
    // return k + ' K';
  };
  const sum = (a, b) => a + b;
  
  
      const LoadData=()=>{
        const apiUrl = 'http://zest-iot.in:8080/api/machine/data?status=Online,Offine & city=Mumbai'; // Replace with your API URL
        const url = `${apiUrl}/me`;
    
        // Set up the headers
        $.ajaxSetup({
          headers: {
            'x-token':sessionStorage.getItem('token'),
          },
        });
    
        // Make the AJAX request
        $.ajax({
          url,
          type: 'GET',
          success: (json) => {
           
            setData(json.data);
                setMachines(json.data.dataAll.length)
                setOnline(json.data.data.filter(filterOnline).length);
                setOfline(json.data.data.length-json.data.data.filter(filterOnline).length);
                setCash(json.data.data.length ?amountText(json.data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0);
              
            
          },
          error: (_) => {
            // console.log("Error")
            // Handle an error here (e.g., redirect to the login page)
            router.push('/auth/login')
          },
        });
    
       
    }
  
    useEffect(()=>{
    
  
      LoadData();
      setInterval(()=>{
        LoadData();
  
      },2000)
      
    
    },[])


    return<>

    <Box
      component="main"
      sx={{
        width:'100%',
        flexGrow: 1,
        py: 8,
        px:0,
        backgroundColor:'whitesmoke'
      }}
    >
      <Container maxWidth="xl">
        <Grid>
        <Grid
         xs={14}
         md={6}
         lg={12}
         container
        spacing={-5}
         
        >
        <Grid
           xs={10}
           md={6}
           lg={3.0}
           sx={{marginTop:"-43px",backgroundColor:"white"}}>
            <MultiSelectAll />
            <MultiSelectAll />
            <MultiSelectAll />
            <MultiSelectAll/>
                <MultiSelectAll/>
                <MultiSelectAll/>
         
        </Grid>
        <Grid
           xs={15}
           md={6}
           lg={7.9}
           sx={{
            marginLeft:"50px"

           }}>
        <Grid
        container
        spacing={21}
         sx={{
          marginTop:"-130px"
         }}
         
        >
          <Grid
            xs={10}
            sm={6}
            lg={2}
          >
            <MachinesInstalled
              difference={12}
              positive
              sx={{ height: '90%',width:'160px' }}
              value={machine}
              name="Machines Installed"
            />
          </Grid>
          <Grid
            xs={12}
            sm={5}
            lg={2}
          >
            <MachinesRunning
              difference={16}
              positive={false}
              sx={{ height: '90%',width:'160px' }}
              value={online}
              name="Machines Running"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <TotalCollections
              sx={{ height: '90%',width:'160px' }}
              value={data.data.length ?amountText(data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0}
              name="Total Collections"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <ItemsDispends
              sx={{ height: '90%',width:'160px' }}
              value={data.data.length ?(data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)):0}
              name="Items Dispends"
            />
          </Grid>
          </Grid>
         
          
        <Grid
          container
          spacing={21}
          sx={{
            marginTop:"-160px"
           }}
          
        >
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <StockEmpty
              difference={12}
              positive
              sx={{ height: '90%',width:'160px' }}
              value={machine}
              name="Stock Empty"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <StockLow
              difference={16}
              positive={false}
              sx={{ height: '90%',width:'160px' }}
              value={online}
              name="Stock Low"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <BurningEnabled
              sx={{ height: '90%',width:'160px' }}
              value={data.data.length ?amountText(data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0}
              name="Burning Enabled"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <BurningCycles
              sx={{ height: '90%',width:'160px'}}
              value={data.data.length ?(data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)):0}
              name="Burning Cycles"
            />
          </Grid>
          </Grid>
          </Grid>
          </Grid>
          <Grid
           sx={{
            marginLeft:"310px",
            marginTop:'-10px'
           }}>
              <StickyHeadTable/>
              </Grid>
              </Grid>
          </Container>
         
          </Box>
    
    
    
    
    </>

}

Page.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
  
  export default Page;
  