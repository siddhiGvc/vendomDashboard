"use client"
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MachinesInstalled } from 'src/sections/overview/overview-machineInstalled';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import {TotalCollections} from 'src/sections/overview/overview-totalCollections';
import { MachinesRunning } from 'src/sections/overview/overview-machinesRunning';
import { ItemsDispends } from 'src/sections/overview/overview-itemsDispends';
import {MachineStatus } from 'src/sections/overview/overview-machineStatus';
import { StockStatus } from 'src/sections/overview/overview-stockStatus';
import { useEffect ,useState} from 'react';
import moment from 'moment';
import $ from 'jquery';
import { useRouter } from 'next/router';
const now = new Date();

const Page = () => {
  const [data,setData]=useState({data:[],dataAll:[]});
  const [machine,setMachines]=useState(0)
  const [online,setOnline]=useState(0);
  const [ofline,setOfline]=useState(0);
  const [cash,setCash]=useState(0);
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
    <Head>
      {/* <title>
        Overview | Devias Kit
      </title> */}
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        // backgroundColor:'whitesmoke'
        backgroundColor:'rgba(88, 115, 254, 0.04)'
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
          mt={"-60px"}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <MachinesInstalled
              difference={12}
              positive
              sx={{ height: '90%',backgroundColor:'whitesmoke' }}
              value={machine}
              name="Machines Installed"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <MachinesRunning
              difference={16}
              positive={false}
              sx={{ height: '90%',backgroundColor:'whitesmoke' }}
              value={online}
              name="Machines Running"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalCollections
              sx={{ height: '90%',backgroundColor:'whitesmoke' }}
              value={data.data.length ?amountText(data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0}
              name="Total Collections"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <ItemsDispends
              sx={{ height: '90%',backgroundColor:'whitesmoke' }}
              value={data.data.length ?(data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)):0}
              name="Items Dispends"
            />
          </Grid>
          {/* <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          <Grid
            xs={24}
            md={6}
            lg={32}
            container
            spacing={3}
          >
            <Grid 
               xs={25}
               md={6}
               lg={5.9}>
            <MachineStatus
              chartSeries={[online,machine-online]}
              labels={['Online','Offline']}
              sx={{ height: '100%',backgroundColor:'whitesmoke' }}
            
            />
            </Grid>
            <Grid
               xs={12}
               md={6}
               lg={6}>
               <StockStatus
            
              chartSeries={[
                data.data.filter(filterOnline).filter(m => m.spiral_a_status === 3).length ,
                data.data.filter(filterOnline).filter(m => m.spiral_a_status === 1).length ,
                data.data.filter(filterOnline).filter(m => m.spiral_a_status === 0).length,
                data.data.filter(filterOnline).filter(m => m.spiral_a_status === 2).length ,
              ]}
              labels={['Ok','Low','Empty','Unknown']}
              sx={{ height: '100%',backgroundColor:'whitesmoke' }}
           
            />
            </Grid>
          </Grid>
          {/* <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewLatestProducts
              products={[
                {
                  id: '5ece2c077e39da27658aa8a9',
                  image: '/assets/products/product-1.png',
                  name: 'Healthcare Erbology',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '5ece2c0d16f70bff2cf86cd8',
                  image: '/assets/products/product-2.png',
                  name: 'Makeup Lancome Rouge',
                  updatedAt: subDays(subHours(now, 8), 2).getTime()
                },
                {
                  id: 'b393ce1b09c1254c3a92c827',
                  image: '/assets/products/product-5.png',
                  name: 'Skincare Soja CO',
                  updatedAt: subDays(subHours(now, 1), 1).getTime()
                },
                {
                  id: 'a6ede15670da63f49f752c89',
                  image: '/assets/products/product-6.png',
                  name: 'Makeup Lipstick',
                  updatedAt: subDays(subHours(now, 3), 3).getTime()
                },
                {
                  id: 'bcad5524fe3a2f8f8620ceda',
                  image: '/assets/products/product-7.png',
                  name: 'Healthcare Ritual',
                  updatedAt: subDays(subHours(now, 5), 6).getTime()
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          {/* <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestOrders
              orders={[
                {
                  id: 'f69f88012978187a6c12897f',
                  ref: 'DEV1049',
                  amount: 30.5,
                  customer: {
                    name: 'Ekaterina Tankova'
                  },
                  createdAt: 1555016400000,
                  status: 'pending'
                },
                {
                  id: '9eaa1c7dd4433f413c308ce2',
                  ref: 'DEV1048',
                  amount: 25.1,
                  customer: {
                    name: 'Cao Yu'
                  },
                  createdAt: 1555016400000,
                  status: 'delivered'
                },
                {
                  id: '01a5230c811bd04996ce7c13',
                  ref: 'DEV1047',
                  amount: 10.99,
                  customer: {
                    name: 'Alexa Richardson'
                  },
                  createdAt: 1554930000000,
                  status: 'refunded'
                },
                {
                  id: '1f4e1bd0a87cea23cdb83d18',
                  ref: 'DEV1046',
                  amount: 96.43,
                  customer: {
                    name: 'Anje Keizer'
                  },
                  createdAt: 1554757200000,
                  status: 'pending'
                },
                {
                  id: '9f974f239d29ede969367103',
                  ref: 'DEV1045',
                  amount: 32.54,
                  customer: {
                    name: 'Clarke Gillebert'
                  },
                  createdAt: 1554670800000,
                  status: 'delivered'
                },
                {
                  id: 'ffc83c1560ec2f66a1c05596',
                  ref: 'DEV1044',
                  amount: 16.76,
                  customer: {
                    name: 'Adam Denisov'
                  },
                  createdAt: 1554670800000,
                  status: 'delivered'
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
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
