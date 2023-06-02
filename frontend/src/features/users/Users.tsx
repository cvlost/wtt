import React, { useEffect } from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getUsersList } from './usersThunks';
import { selectUsersList, selectUsersListLoading } from './usersSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { useNavigate } from 'react-router-dom';
import ContactsIcon from '@mui/icons-material/Contacts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
      <Typography>Users</Typography>
      <Box>
        {usersLoading ? (
          <MainPreloader />
        ) : (
          <>
            {users.map((user) => (
              <Card key={user.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography>{user.firstName + ' ' + user.lastName}</Typography>
                  <IconButton onClick={() => navigate(`/users/${user.id}`)}>
                    <ContactsIcon />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/calendar?user=${user.id}`)}>
                    <CalendarMonthIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Users;
