"use client"
import styles from "./css/machinedata.module.css"
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




    return <>
    <div className={styles.container}>
        <div className={styles.subContainer}>
            <div className={styles.selectors}>
            <MultiSelectAll />
            <MultiSelectAll />
            <MultiSelectAll />
            <MultiSelectAll/>
            <MultiSelectAll/>
            <MultiSelectAll/>

            </div>
            <div className={styles.machineData}>
                <div>
            <Grid
            xs={10}
            sm={6}
            lg={2}
          >
            <MachinesInstalled
              difference={12}
              positive
              sx={{ height: '150px',width:'160px' }}
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
              sx={{ height: '150px',width:'160px' }}
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
              sx={{ height: '150px',width:'160px' }}
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
              sx={{ height: '150px',width:'160px' }}
              value={data.data.length ?(data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)):0}
              name="Items Dispends"
            />
          </Grid>
          </div>
          <div>
          <Grid
            xs={12}
            sm={6}
            lg={2}
          >
            <StockEmpty
              difference={12}
              positive
              sx={{ height: '150px',width:'160px' }}
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
              sx={{ height: '150px',width:'160px' }}
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
              sx={{ height: '150px',width:'160px' }}
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
              sx={{ height: '150px',width:'160px'}}
              value={data.data.length ?(data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)):0}
              name="Burning Cycles"
            />
          </Grid>
          </div>
          <div className={styles.table}>
            <StickyHeadTable/>
          </div>
            </div>



        </div>




    </div>
    
    
    
    </>
}

Page.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
  
  export default Page;