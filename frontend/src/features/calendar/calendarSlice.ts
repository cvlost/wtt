import { createSlice } from '@reduxjs/toolkit';
import {
  createReport,
  deleteOneReport,
  getAllDaysSummary,
  getOneDayReport,
  getOneReport,
  updateOneReport,
} from './calendarThunks';
import { RootState } from '../../app/store';
import { IDayReport, IDaySummary, IReport } from '../../types';

interface CalendarState {
  reportsSummaryList: IDaySummary[];
  reportsSummaryListLoading: boolean;
  oneDayReport: IDayReport | null;
  oneDayReportLoading: boolean;
  oneReport: IReport | null;
  oneReportLoading: boolean;
  createReportLoading: boolean;
  updateOneReportLoading: boolean;
  deleteOneReportLoading: boolean;
}

const initialState: CalendarState = {
  reportsSummaryList: [],
  reportsSummaryListLoading: false,
  oneDayReport: null,
  oneDayReportLoading: false,
  oneReport: null,
  oneReportLoading: false,
  createReportLoading: false,
  deleteOneReportLoading: false,
  updateOneReportLoading: false,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    unsetOneReport: (state) => {
      state.oneReport = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllDaysSummary.pending, (state) => {
      state.reportsSummaryListLoading = true;
    });
    builder.addCase(getAllDaysSummary.fulfilled, (state, { payload: reports }) => {
      state.reportsSummaryList = reports;
      state.reportsSummaryListLoading = false;
    });
    builder.addCase(getAllDaysSummary.rejected, (state) => {
      state.reportsSummaryListLoading = false;
    });

    builder.addCase(getOneDayReport.pending, (state) => {
      state.oneDayReportLoading = true;
    });
    builder.addCase(getOneDayReport.fulfilled, (state, { payload: reports }) => {
      state.oneDayReport = reports;
      state.oneDayReportLoading = false;
    });
    builder.addCase(getOneDayReport.rejected, (state) => {
      state.oneDayReportLoading = false;
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

    builder.addCase(updateOneReport.pending, (state) => {
      state.updateOneReportLoading = true;
    });
    builder.addCase(updateOneReport.fulfilled, (state) => {
      state.updateOneReportLoading = false;
    });
    builder.addCase(updateOneReport.rejected, (state) => {
      state.updateOneReportLoading = false;
    });

    builder.addCase(deleteOneReport.pending, (state) => {
      state.deleteOneReportLoading = true;
    });
    builder.addCase(deleteOneReport.fulfilled, (state) => {
      state.deleteOneReportLoading = false;
    });
    builder.addCase(deleteOneReport.rejected, (state) => {
      state.deleteOneReportLoading = false;
    });
  },
});

export const calendarReducer = calendarSlice.reducer;
export const { unsetOneReport } = calendarSlice.actions;

export const selectReportsSummaryList = (state: RootState) => state.calendar.reportsSummaryList;
export const selectReportsSummaryListLoading = (state: RootState) => state.calendar.reportsSummaryListLoading;
export const selectOneDayReport = (state: RootState) => state.calendar.oneDayReport;
export const selectOneDayReportLoading = (state: RootState) => state.calendar.oneDayReportLoading;
export const selectCreateReportLoading = (state: RootState) => state.calendar.createReportLoading;
export const selectOneReport = (state: RootState) => state.calendar.oneReport;
export const selectOneReportLoading = (state: RootState) => state.calendar.oneReportLoading;
export const selectUpdateOneReportLoading = (state: RootState) => state.calendar.updateOneReportLoading;
export const selectDeleteOneReportLoading = (state: RootState) => state.calendar.deleteOneReportLoading;
