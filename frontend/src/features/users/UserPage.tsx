import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useParams } from 'react-router';
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { selectOneUser, selectOneUserLoading, selectUser } from './usersSlice';
import { deleteUser, getOneUser } from './usersThunks';
import { apiBaseUrl } from '../../config';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Navigate, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import CakeIcon from '@mui/icons-material/Cake';
import SettingsIcon from '@mui/icons-material/Settings';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';

const UserPage = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const oneUser = useAppSelector(selectOneUser);
  const oneUserLoading = useAppSelector(selectOneUserLoading);
  const navigate = useNavigate();
  const id = useParams().id as string;
  const { confirm } = useConfirm();

  useEffect(() => {
    if (id) dispatch(getOneUser(id));
  }, [dispatch, id]);

  if (user?.role !== 'admin' && user?.id !== id) return <Navigate to={'/calendar'} />;

  return (
    <Box p={2}>
      {oneUserLoading ? (
        <MainPreloader />
      ) : oneUser ? (
        <>
          <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }} mb={2}>
            Profile
          </Typography>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              p={2}
              boxShadow="0 0 0.5em gainsboro"
              alignSelf="flex-start"
              bgcolor="white"
            >
              <Box>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{ bgcolor: 'rgba(0,0,0,.4)' }}
                      onClick={() => navigate(`/profile/${oneUser.id}/edit`)}
                    >
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
                <Grid container>
                  <Grid item xs={12}>
                    <Button onClick={() => navigate(`/calendar?user=${oneUser.id}`)} startIcon={<CalendarMonthIcon />}>
                      Activity
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button startIcon={<SettingsIcon />} onClick={() => navigate(`/profile/${oneUser.id}/edit`)}>
                      Edit profile
                    </Button>
                  </Grid>
                  {user?.role === 'admin' && user?.id !== id && (
                    <Grid item xs={12}>
                      <Button
                        startIcon={<GppMaybeIcon />}
                        color="error"
                        onClick={async () => {
                          if (
                            await confirm(
                              "Delete user's account",
                              'This action will remove all activity as well. Do you want to continue?',
                            )
                          ) {
                            await dispatch(deleteUser(id));
                            navigate(`/users`);
                          }
                        }}
                      >
                        Delete account
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} lg={8} p={2}>
              <Typography fontWeight="bold" fontSize="0.8em">
                Personal data
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
