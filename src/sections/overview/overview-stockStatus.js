import PropTypes from 'prop-types';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
// import { createTheme } from '@material-ui/core/styles';
import { createTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
  
} from '@mui/material';
import { Chart } from 'src/components/chart';
import { useEffect, useState } from 'react';



const useChartOptions = (labels) => {
    const theme = useTheme();
    const Theme=createTheme({
        palette: {
            primary: {
              main: '#808080', // Medium grey color
            },
          },
    })
  return {
    chart: {
      background: 'transparent'
    },
    colors: [
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        Theme.palette.primary.main
  
      
    ],
    dataLabels: {
      enabled: true
    },
    labels,
    legend: {
      show: true
    },
    plotOptions: {
      pie: {
        expandOnClick: true
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 3
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const iconMap = {
  Desktop: (
    <SvgIcon>
      <ComputerDesktopIcon />
    </SvgIcon>
  ),
  Tablet: (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
  Phone: (
    <SvgIcon>
      <PhoneIcon />
    </SvgIcon>
  )
};

export const StockStatus = (props) => {
  const [data,setData]=useState([]);
  const { chartSeries, labels, sx ,chartType} = props;
  const chartOptions = useChartOptions(labels);
  

  useEffect(()=>{
    

  })

  return (
    <Card sx={sx}>
      <CardHeader title="Stock Status" />
      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type={chartType}
          width="100%"
        />
       
        {/* <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {iconMap[label]}
                <Typography
                  sx={{ my: 1 }}
                  variant="h6"
                >
                  {label}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {item}%
                </Typography>
              </Box>
            );
          })}
        </Stack> */}
      </CardContent>
    </Card>
  );
};

// StockStatus.propTypes = {
//   chartSeries: PropTypes.array.isRequired,
//   labels: PropTypes.array.isRequired,
//   sx: PropTypes.object
// };
