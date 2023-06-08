import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CalculateIcon from '@mui/icons-material/Calculate';
import PersonIcon from '@mui/icons-material/Person';
import HandymanIcon from '@mui/icons-material/Handyman';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const FeatureSection = () => {
  return (
    <Box p={2} mb={6}>
      <Typography component="h2" variant="h4" mt={4} mb={6} textAlign="center">
        <Typography component="span" variant="h4" fontWeight="bold" color="#ff5b1e">
          You{' '}
        </Typography>
        get
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6} p={1}>
          <Card sx={{ maxWidth: '400px', m: 'auto' }}>
            <CardContent>
              <Box display="flex" justifyContent="center">
                <Avatar sx={{ width: '80px', height: '80px', my: 3, bgcolor: '#ff5b1e' }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: '2em' }} />
                </Avatar>
              </Box>
              <Typography variant="h5" textAlign="center">
                as an
                <Typography component="span" variant="h5" fontWeight="bold" color="deeppink">
                  {' '}
                  Admin
                </Typography>
              </Typography>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'deeppink' }}>
                      <ManageAccountsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="User management" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'deeppink' }}>
                      <PendingActionsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Immediate access to reports" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'deeppink' }}>
                      <CalculateIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="High quality time calculation" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} p={1}>
          <Card sx={{ maxWidth: '400px', m: 'auto' }}>
            <CardContent>
              <Box display="flex" justifyContent="center">
                <Avatar sx={{ width: '80px', height: '80px', my: 3, bgcolor: '#ff5b1e' }}>
                  <PersonIcon sx={{ fontSize: '2em' }} />
                </Avatar>
              </Box>
              <Typography variant="h5" textAlign="center">
                as a
                <Typography component="span" variant="h5" fontWeight="bold" color="deeppink">
                  {' '}
                  User
                </Typography>
              </Typography>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'deeppink' }}>
                      <HandymanIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Convenient tool for reports" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'deeppink' }}>
                      <AccessTimeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Time management system" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'deeppink' }}>
                      <TrendingUpIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Growth in efficiency" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeatureSection;
