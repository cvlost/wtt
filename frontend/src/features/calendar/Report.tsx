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
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import { isAllowedDate } from '../../utils/isAllowedDate';
import { useParams } from 'react-router';

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
  const date = useParams().id as string;
  const formattedStart = start.format('HH:mm');
  const formattedFinish = finish.format('HH:mm');
  const deleteOneReportLoading = useAppSelector(selectDeleteOneReportLoading);
  const showControls = report.user === user?.id && date && isAllowedDate(date);

  return (
    <Accordion key={report.id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="div" fontWeight="bold" fontSize="0.9em">
          {`${index + 1}. ${report.title} `}
          <Chip
            color="info"
            avatar={<AccessTimeIcon sx={{ color: '#0288d1 !important' }} />}
            label={
              <Typography fontWeight="bold" fontSize="0.9em">
                {`${getFormattedTime(report.timeSpent)}`}
              </Typography>
            }
            variant="outlined"
          />
        </Typography>
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
          {showControls && (
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
      {report.description && (
        <>
          <Divider />
          <AccordionDetails>
            <Box>
              <Typography fontWeight="bold" fontSize=".8em" sx={{ textTransform: 'uppercase' }} mb={2}>
                Description
              </Typography>
              <Box p={2} boxShadow="0 0 0.5em #ffe2e2" borderLeft="3px solid deeppink">
                <FroalaEditorView model={report.description} />
              </Box>
            </Box>
          </AccordionDetails>
        </>
      )}
    </Accordion>
  );
};

export default Report;
