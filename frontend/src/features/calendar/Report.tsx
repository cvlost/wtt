import React from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallMadeIcon from '@mui/icons-material/CallMade';
import FlagIcon from '@mui/icons-material/Flag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getFormattedTime } from '../../utils/getFormattedTime';
import { LoadingButton } from '@mui/lab';
import { IReport } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { selectDeleteOneReportLoading } from './calendarSlice';

interface Props {
  report: IReport;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const Report: React.FC<Props> = ({ report, index, onEdit, onDelete }) => {
  const user = useAppSelector(selectUser);
  const start = dayjs(report.startedAt);
  const finish = dayjs(report.finishedAt);
  const formattedStart = start.format('HH:mm');
  const formattedFinish = finish.format('HH:mm');
  const diff = finish.diff(start);
  const deleteOneReportLoading = useAppSelector(selectDeleteOneReportLoading);
  const formattedDiff = dayjs.duration(diff).humanize();

  return (
    <Accordion key={report.id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold" fontSize="0.9em">{`${index + 1}. ${report.title} (${formattedDiff})`}</Typography>
      </AccordionSummary>
      <Divider />
      <AccordionActions>
        <Grid
          container
          alignItems="center"
          sx={{
            justifyContent: {
              xs: 'center',
              md: 'space-between',
            },
          }}
        >
          <Grid item textAlign="center">
            <Chip
              sx={{ m: 0.5 }}
              avatar={<CallMadeIcon />}
              label={
                <Typography fontWeight="bold" fontSize="0.9em">
                  {`Started: ${formattedStart}`}
                </Typography>
              }
              variant="outlined"
            />
            <Chip
              sx={{ m: 0.5 }}
              avatar={<FlagIcon />}
              label={
                <Typography fontWeight="bold" fontSize="0.9em">
                  {`Finished: ${formattedFinish}`}
                </Typography>
              }
              variant="outlined"
            />
            <Chip
              sx={{ m: 0.5 }}
              avatar={<AccessTimeIcon />}
              label={
                <Typography fontWeight="bold" fontSize="0.9em">
                  {`Time spent: ${getFormattedTime(report.timeSpent)}`}
                </Typography>
              }
              variant="outlined"
            />
          </Grid>
          {report.user === user?.id && (
            <Box>
              <Grid container alignItems="center">
                <Grid item>
                  <Button size="small" onClick={() => onEdit(report.id)}>
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <LoadingButton
                    loading={deleteOneReportLoading}
                    disabled={deleteOneReportLoading}
                    size="small"
                    color="error"
                    onClick={() => onDelete(report.id)}
                  >
                    Delete
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </AccordionActions>
      <Divider />
      <AccordionDetails>
        <Box>
          <Typography fontWeight="bold" fontSize=".8em" sx={{ textTransform: 'uppercase' }} mb={2}>
            Description
          </Typography>
          <Box p={2} boxShadow="0 0 .5em gainsboro">
            <Typography>{report.description}</Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Report;
