import React, { useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getUsersList } from './usersThunks';
import { selectUsersList, selectUsersListLoading } from './usersSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { useNavigate } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import User from './User';

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
          <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
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
              <User key={user.id} user={user} />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Users;
