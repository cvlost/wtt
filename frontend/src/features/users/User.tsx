import React from 'react';
import { Avatar, Box, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { apiBaseUrl } from '../../config';
import ContactsIcon from '@mui/icons-material/Contacts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { IUserWithActivity } from '../../types';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import { getFormattedTime } from '../../utils/getFormattedTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface Props {
  user: IUserWithActivity;
}

const User: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <Box key={user.id} sx={{ bgcolor: 'white', borderBottom: '1px solid gainsboro' }}>
      <Grid container alignItems="center">
        <Grid item p={1} xs={4}>
          <Box>
            <Grid container alignItems="center">
              <Grid item p={1}>
                <Avatar
                  alt={user.lastName}
                  src={`${apiBaseUrl}/${user.avatar}`}
                  sx={{ height: '80px', width: '80px', boxShadow: ' 0 0 .5em gainsboro' }}
                />
              </Grid>
              <Grid item p={1}>
                <Typography fontWeight="bold" fontSize="0.9em">
                  {user.firstName + ' ' + user.lastName}
                </Typography>
                <Tooltip title="Profile" arrow>
                  <IconButton onClick={() => navigate(`/profile/${user.id}`)}>
                    <ContactsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Calendar" arrow>
                  <IconButton onClick={() => navigate(`/calendar?user=${user.id}`)}>
                    <CalendarMonthIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item p={1}>
          <Box>
            <Grid container alignItems="center">
              <Grid item p={1}>
                <Avatar sx={{ bgcolor: 'deeppink' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Grid>
              <Grid item p={1}>
                <Box>
                  <Typography fontWeight="bold" fontSize=".8em" mb={0.5}>
                    Today
                  </Typography>
                  <Box>
                    <Chip
                      variant="outlined"
                      size="small"
                      color={user.dayActivity.time === 0 ? 'warning' : 'success'}
                      icon={<AccessTimeIcon />}
                      label={getFormattedTime(user.dayActivity.time)}
                    />
                  </Box>
                  <Box>
                    <Chip
                      variant="outlined"
                      size="small"
                      color={user.dayActivity.count === 0 ? 'warning' : 'success'}
                      icon={<DoneIcon />}
                      label={`${user.dayActivity.count} report${user.dayActivity.count === 1 ? '' : 's'}`}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item p={1}>
                <Box>
                  <Typography fontWeight="bold" fontSize=".8em" mb={0.5}>
                    Overall
                  </Typography>
                  <Box>
                    <Chip
                      variant="outlined"
                      size="small"
                      color={user.overallActivity.time === 0 ? 'warning' : 'info'}
                      icon={<AccessTimeIcon />}
                      label={getFormattedTime(user.overallActivity.time)}
                    />
                  </Box>
                  <Box>
                    <Chip
                      variant="outlined"
                      size="small"
                      color={user.overallActivity.count === 0 ? 'warning' : 'info'}
                      icon={<DoneIcon />}
                      label={`${user.overallActivity.count} report${user.overallActivity.count === 1 ? '' : 's'}`}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default User;
