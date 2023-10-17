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

import * as React from 'react';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import { deepOrange, green,red } from '@mui/material/colors';
import {GiCheckMark} from "react-icons/gi"
import {FaXmark} from "react-icons/fa6"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Machines = [
  'Online',
  'Offline',
 
];

const Stocks=[
    'Ok',
    'Low',
    'Empty',

]

const Burns=[
    'Idle',
    'Burning',
    'Error',

]
const Zones=[
  '1',
  '2',
  '3',
  '4',
  '5',
  '6'

]
const Wards=[
  'A',
  'D',
  'E',
  'FN',
  'FS',
  'GS',
  'HE',
  'HW',
  'KE',
  'L',
  'MW',
  'N',
  'PS'


]

const Beats=[
  

]


const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));


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
    const [machineStatus, setMachineStatus] = React.useState([]);
    const [stockStatus,setStockStatus] = React.useState([]);
    const [burnStatus,setBurnStatus] = React.useState([]);
    const [zone,setZone] = React.useState([]);

    const handleMachineChange = (event) => {
      const {
        target: { value },
      } = event;
      setMachineStatus(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
    const handleStockChange = (event) => {
        const {
          target: { value },
        } = event;
        setStockStatus(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
      const handleBurnChange = (event) => {
        const {
          target: { value },
        } = event;
        setBurnStatus(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
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


            <FormControl sx={{ m: 1, width: 225 }}>
        <InputLabel id="demo-multiple-checkbox-label">Machine Status</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={machineStatus}
          onChange={handleMachineChange}
          input={<BootstrapInput/>}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return "None Selected";
            } else if (selected.length === 1) {
              return selected[0];
            } else if(selected.length==Machines.length) {
              return `All Selected (${selected.length})`
            }
            else if(selected.length<Machines.length)
            {
              return `${selected.length} Selected`
            }

          }}
          MenuProps={MenuProps}
        >
          {Machines.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox defaultChecked checked={machineStatus.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 225 }}>
        <InputLabel id="demo-multiple-checkbox-label">Stock Status</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={stockStatus}
          onChange={handleStockChange}
          input={<BootstrapInput/>}
          placeholder="Non Selected"
           
          renderValue={(selected) => {
            if (selected.length === 0) {
              return "None Selected";
            } else if (selected.length === 1) {
              return selected[0];
            } else if(selected.length==Stocks.length) {
              return `All Selected (${selected.length})`
            }   
            else if(selected.length<Stocks.length)
            {
              return `${selected.length} Selected`
            }
            else if(!selected){
              return "None Selected";
            }

          }}
          MenuProps={MenuProps}
        >
        
          {Stocks.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox defaultChecked checked={stockStatus.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      <FormControl sx={{ m: 1, width: 225 }}>
   
        <InputLabel id="demo-multiple-checkbox-label">Burn Status</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={burnStatus}
          onChange={handleBurnChange}
          input={<BootstrapInput/>}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return "None Selected";
            } else if (selected.length === 1) {
              return selected[0];
            } else if(selected.length==Burns.length) {
              return `All Selected (${selected.length})`
            }
            else if(selected.length<Burns.length)
            {
              return `${selected.length} Selected`
            }

          }}
          MenuProps={MenuProps}
        >
          {Burns.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox defaultChecked checked={burnStatus.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <hr style={{width:'90%',color:'grey'}}></hr>
      <div style={{display:"flex",width:'100%',height:'70px',alignItems:'center'}}>
      <Avatar sx={{ backgroundColor:"success.main",marginBottom:'-22px'}} variant="square">
        <GiCheckMark/>
      </Avatar>
      <FormControl sx={{ m: 1, width: 150}}>
        <InputLabel id="demo-multiple-checkbox-label">Zone</InputLabel>
      
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={burnStatus}
          onChange={handleBurnChange}
          input={<BootstrapInput/>}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {Burns.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={burnStatus.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
    </FormControl>
    <Avatar sx={{ bgcolor:"error.main",marginBottom:'-22px' }} variant="square">
       <FaXmark/>
      </Avatar>
      </div>



      <div style={{display:"flex",width:'100%',height:'70px',alignItems:'center'}}>
      <Avatar sx={{ bgcolor:'success.main' ,marginBottom:'-22px'}} variant="square">
      <GiCheckMark/>
      </Avatar>
      <FormControl sx={{ m: 1, width: 150}}>
        <InputLabel id="demo-multiple-checkbox-label">Ward</InputLabel>
      
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={burnStatus}
          onChange={handleBurnChange}
          input={<BootstrapInput/>}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {Burns.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={burnStatus.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
    </FormControl>
    <Avatar sx={{ bgcolor: 'error.main',marginBottom:'-22px' }} variant="square">
           <FaXmark/>
      </Avatar>
      </div>


      <div style={{display:"flex",width:'100%',height:'70px',alignItems:'center'}}>
      <Avatar sx={{ bgcolor:'success.main' ,marginBottom:'-22px'}} variant="square">
      <GiCheckMark/>
      </Avatar>
      <FormControl sx={{ m: 1, width: 150}}>
        <InputLabel id="demo-multiple-checkbox-label">Beat</InputLabel>
      
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={burnStatus}
          onChange={handleBurnChange}
          input={<BootstrapInput/>}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {Burns.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={burnStatus.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
    </FormControl>
    <Avatar sx={{ bgcolor:'error.main',marginBottom:'-22px' }} variant="square">
        <FaXmark/>
      </Avatar>
      </div>


           
         

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
              sx={{ height: '150px',width:'160px',  backgroundColor: '#fff' }}
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
              sx={{ height: '150px',width:'160px',   backgroundColor: '#fff'}}
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
              sx={{ height: '150px',width:'160px', backgroundColor: '#fff' }}
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
              sx={{ height: '150px',width:'160px', backgroundColor: '#fff' }}
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
              sx={{ height: '150px',width:'160px', backgroundColor: '#fff' }}
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
              sx={{ height: '150px',width:'160px', backgroundColor: '#fff' }}
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
              sx={{ height: '150px',width:'160px', backgroundColor: '#fff' }}
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
              sx={{ height: '150px',width:'160px', backgroundColor: '#fff'}}
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