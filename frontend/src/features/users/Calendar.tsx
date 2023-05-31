import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DayCellContentArg } from '@fullcalendar/core';

const dayCellContent = (arg: DayCellContentArg) => {
  return (
    <Box>
      <Typography>{arg.dayNumberText}</Typography>
      <CircularProgress />
    </Box>
  );
};

const Calendar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 1 }}>
      <FullCalendar
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}
        dayCellContent={dayCellContent}
        weekends={false}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={(info) => navigate(`/calendar/${info.dateStr}`)}
      />
    </Box>
  );
};

export default Calendar;
