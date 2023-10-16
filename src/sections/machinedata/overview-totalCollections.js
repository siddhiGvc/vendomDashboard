import PropTypes from 'prop-types';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import {FaRupeeSign} from "react-icons/fa"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';

export const TotalCollections = (props) => {
  const {name, value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack spacing={1} >
            <Typography
              color="text.secondary"
              gutterBottom
              variant="overline"
              fontSize={"11px"}
            >
              {name}
            </Typography>
            <Typography variant="h6" >
              {`${value}`}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 40,
              width: 40
            }}
          >
            <SvgIcon>
              <FaRupeeSign/>
            </SvgIcon>
          </Avatar>
        </Stack>
        {/* <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={value}
            variant="determinate"
          />
        </Box> */}
      </CardContent>
    </Card>
  );
};

// TotalCollections.propTypes = {
//   value: PropTypes.string.isRequired,
//   sx: PropTypes.object
// };
