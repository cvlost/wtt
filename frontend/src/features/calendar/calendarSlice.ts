import { createSlice } from '@reduxjs/toolkit';
import { getAllReports, getAllReportsByDay } from './calendarThunks';
import { RootState } from '../../app/store';
import { IDayReport, IReport } from '../../types';

interface CalendarState {
  reportsList: IDayReport[];
  reportsListLoading: boolean;
  reportsByDayList: IReport[];
  reportsByDayListLoading: boolean;
}

const initialState: CalendarState = {
  reportsList: [],
  reportsListLoading: false,
  reportsByDayList: [],
  reportsByDayListLoading: false,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllReports.pending, (state) => {
      state.reportsListLoading = true;
    });
    builder.addCase(getAllReports.fulfilled, (state, { payload: reports }) => {
      state.reportsList = reports;
      state.reportsListLoading = false;
    });
    builder.addCase(getAllReports.rejected, (state) => {
      state.reportsListLoading = false;
    });

    builder.addCase(getAllReportsByDay.pending, (state) => {
      state.reportsByDayListLoading = true;
    });
    builder.addCase(getAllReportsByDay.fulfilled, (state, { payload: reports }) => {
      state.reportsByDayList = reports;
      state.reportsByDayListLoading = false;
    });
    builder.addCase(getAllReportsByDay.rejected, (state) => {
      state.reportsByDayListLoading = false;
    });
  },
});

export const calendarReducer = calendarSlice.reducer;

export const selectReportsList = (state: RootState) => state.calendar.reportsList;
export const selectReportsByDayList = (state: RootState) => state.calendar.reportsByDayList;
export const selectReportsListLoading = (state: RootState) => state.calendar.reportsListLoading;
export const selectReportsByDayListLoading = (state: RootState) => state.calendar.reportsByDayListLoading;
