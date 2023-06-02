import React, { useEffect } from 'react';
import { Avatar, Box, Button, Card, Grid, IconButton, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getUsersList } from './usersThunks';
import { selectUsersList, selectUsersListLoading } from './usersSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { useNavigate } from 'react-router-dom';
import ContactsIcon from '@mui/icons-material/Contacts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { apiBaseUrl } from '../../config';

const Users = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector(selectUsersList);
  const usersLoading = useAppSelector(selectUsersListLoading);

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  return (
    <Box p={2}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant={'h5'} component={'h5'}>
            Users
          </Typography>
        </Grid>
        <Grid item>
          <Button size="small" variant="contained" startIcon={<GroupAddIcon />} onClick={() => navigate('/register')}>
            New user
          </Button>
        </Grid>
      </Grid>
      <Box>
        {usersLoading ? (
          <MainPreloader />
        ) : (
          <>
            {users.map((user) => (
              <Card key={user.id} sx={{ mb: 2, boxShadow: '0 0 1.7em gainsboro' }}>
                <Grid container alignItems="center">
                  <Grid item p={1}>
                    <Avatar
                      alt={user.lastName}
                      src={`${apiBaseUrl}/${user.avatar}`}
                      sx={{ height: '80px', width: '80px' }}
                    />
                  </Grid>
                  <Grid item p={1}>
                    <Typography>{user.firstName + ' ' + user.lastName}</Typography>
                    <IconButton onClick={() => navigate(`/profile/${user.id}`)}>
                      <ContactsIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/calendar?user=${user.id}`)}>
                      <CalendarMonthIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Users;
