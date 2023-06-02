import { createSlice } from '@reduxjs/toolkit';
import { createReport, getAllReports, getAllReportsByDay, getOneReport } from './calendarThunks';
import { RootState } from '../../app/store';
import { IDayReport, IReport } from '../../types';

interface CalendarState {
  createReportLoading: boolean;
  reportsList: IDayReport[];
  reportsListLoading: boolean;
  oneReport: IReport | null;
  oneReportLoading: boolean;
  reportsByDayList: IReport[];
  reportsByDayListLoading: boolean;
}

const initialState: CalendarState = {
  createReportLoading: false,
  reportsList: [],
  reportsListLoading: false,
  oneReport: null,
  oneReportLoading: false,
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

    builder.addCase(getOneReport.pending, (state) => {
      state.oneReportLoading = true;
    });
    builder.addCase(getOneReport.fulfilled, (state, { payload: report }) => {
      state.oneReport = report;
      state.oneReportLoading = false;
    });
    builder.addCase(getOneReport.rejected, (state) => {
      state.oneReportLoading = false;
    });

    builder.addCase(createReport.pending, (state) => {
      state.createReportLoading = true;
    });
    builder.addCase(createReport.fulfilled, (state) => {
      state.createReportLoading = false;
    });
    builder.addCase(createReport.rejected, (state) => {
      state.createReportLoading = false;
    });
  },
});

export const calendarReducer = calendarSlice.reducer;

export const selectReportsList = (state: RootState) => state.calendar.reportsList;
export const selectReportsByDayList = (state: RootState) => state.calendar.reportsByDayList;
export const selectReportsListLoading = (state: RootState) => state.calendar.reportsListLoading;
export const selectReportsByDayListLoading = (state: RootState) => state.calendar.reportsByDayListLoading;
export const selectOneReport = (state: RootState) => state.calendar.oneReport;
export const selectOneReportLoading = (state: RootState) => state.calendar.oneReportLoading;
export const selectCreateReportLoading = (state: RootState) => state.calendar.createReportLoading;
