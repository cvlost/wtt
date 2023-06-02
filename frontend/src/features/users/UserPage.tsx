import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useParams } from 'react-router';
import { Alert, Box, Grid, Typography } from '@mui/material';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { selectOneUser, selectOneUserLoading } from './usersSlice';
import { getOneUser } from './usersThunks';

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
          <Typography>{`${oneUser.firstName} ${oneUser.lastName} (${oneUser.position})`}</Typography>
          <Grid container>
            <Grid item xs={4}>
              AVATAR
            </Grid>
            <Grid item xs={8}>
              <Typography>{oneUser.firstName}</Typography>
              <Typography>{oneUser.lastName}</Typography>
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
