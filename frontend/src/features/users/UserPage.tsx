import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useParams } from 'react-router';
import { Alert, Badge, Box, Button, Grid, IconButton, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { selectOneUser, selectOneUserLoading } from './usersSlice';
import { getOneUser } from './usersThunks';
import { apiBaseUrl } from '../../config';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import CakeIcon from '@mui/icons-material/Cake';

const UserPage = () => {
  const dispatch = useAppDispatch();
  const oneUser = useAppSelector(selectOneUser);
  const oneUserLoading = useAppSelector(selectOneUserLoading);
  const navigate = useNavigate();
  const id = useParams().id as string;

  useEffect(() => {
    if (id) dispatch(getOneUser(id));
  }, [dispatch, id]);

  return (
    <Box p={2}>
      {oneUserLoading ? (
        <MainPreloader />
      ) : oneUser ? (
        <>
          <Typography variant="h5">Profile</Typography>
          <Grid container>
            <Grid item xs={4} p={2}>
              <Box>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,.4)' }}>
                      <EditIcon sx={{ color: 'white' }} />
                    </IconButton>
                  }
                >
                  <img
                    alt={oneUser.firstName}
                    src={`${apiBaseUrl}/${oneUser.avatar}`}
                    style={{ width: '100%', boxShadow: '0 0 .5em gainsboro' }}
                  />
                </Badge>
                <Typography color="gray" textAlign="center" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                  {oneUser.position}
                </Typography>
                <Button onClick={() => navigate(`/calendar?user=${oneUser.id}`)}>
                  <CalendarMonthIcon sx={{ mr: 1 }} /> Activity
                </Button>
              </Box>
            </Grid>
            <Grid item xs={8} p={2}>
              <Typography fontWeight="bold" fontSize="0.8em">
                General info
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <Typography>
                    Name:{' '}
                    {`${oneUser.firstName} ${oneUser.lastName} (${dayjs().diff(oneUser.birthDay, 'years')} years)`}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CakeIcon />
                  </ListItemIcon>
                  <Typography>Birthday: {dayjs(oneUser.birthDay).format('D MMMM YYYY')}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BadgeIcon />
                  </ListItemIcon>
                  <Typography>Position: {oneUser.position}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <Typography>Role: {oneUser.role}</Typography>
                </ListItem>
              </List>
              <Typography fontWeight="bold" fontSize="0.8em">
                Contacts
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocalPhoneIcon />
                  </ListItemIcon>
                  <Typography>Phone: {oneUser.phone}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <Typography>Email: {oneUser.email}</Typography>
                </ListItem>
              </List>
              <Typography fontWeight="bold" fontSize="0.8em">
                Company
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <WorkHistoryIcon />
                  </ListItemIcon>
                  <Typography>Employed: {dayjs(oneUser.employed).format('D MMMM YYYY')}</Typography>
                </ListItem>
              </List>
              <Button>Edit profile</Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="warning">Could not get User information!</Alert>
      )}
    </Box>
  );
};

export default UserPage;
