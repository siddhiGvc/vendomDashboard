import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import {BsBoxFill} from "react-icons/bs"
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const StockEmpty = (props) => {
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
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {name}
            </Typography>
            <Typography variant="h6">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 45,
              width: 45
            }}
          >
            <SvgIcon>
              <BsBoxFill/>
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ItemsDispends.propTypes = {
//   value: PropTypes.string.isRequired,
//   sx: PropTypes.object
// };
