import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useParams } from 'react-router';
import { Alert, Box, Grid, Typography } from '@mui/material';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { selectOneUser, selectOneUserLoading } from './usersSlice';
import { getOneUser } from './usersThunks';
import { apiBaseUrl } from '../../config';
import dayjs from 'dayjs';

const UserPage = () => {
  const dispatch = useAppDispatch();
  const oneUser = useAppSelector(selectOneUser);
  const oneUserLoading = useAppSelector(selectOneUserLoading);
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
          <Typography variant="h5">{`${oneUser.firstName} ${oneUser.lastName} - ${oneUser.position}`}</Typography>
          <Grid container>
            <Grid item xs={4} p={2}>
              <Box>
                <img
                  alt={oneUser.firstName}
                  src={`${apiBaseUrl}/${oneUser.avatar}`}
                  style={{ width: '100%', boxShadow: '0 0 .5em gainsboro' }}
                />
                <Typography color="gray" textAlign="center" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                  {oneUser.position}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8} p={2}>
              <Typography>Name: {`${oneUser.firstName} ${oneUser.lastName}`}</Typography>
              <Typography>Position: {oneUser.position}</Typography>
              <Typography>Role: {oneUser.role}</Typography>
              <Typography>Employment date: {dayjs(oneUser.employed).format('D MMMM YYYY')}</Typography>
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
