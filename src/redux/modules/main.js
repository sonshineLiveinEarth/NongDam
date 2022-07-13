import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { apis } from "../../shared/api";

// Action
const GET_WEATHER = "GET_WEATHER";
const GET_TODAY_MARKET_PRICE = "GET_TODAY_MARKET_PRICE";
const GET_MARKET_PRICE = "GET_MARKET_PRICE";
const GET_TODAY_SCHEDULE_LIST = "GET_TODAY_SCHEDULE_LIST";

// Action Creator
const getWeather = createAction(GET_WEATHER, (data) => ({ data }));
const getTodayMarketPrice = createAction(GET_TODAY_MARKET_PRICE, (data) => ({
  data,
}));
const getMarketPrice = createAction(GET_MARKET_PRICE, (data) => ({
  data,
}));
const getTodaySchedule = createAction(GET_TODAY_SCHEDULE_LIST, (data) => ({
  data,
}));

// InitialState
const initialState = {
  weather: [],
  marketPrice: [],
  todayMarketPrice: [],
  todayScheduleList: [],
};

// Middleware
// 오늘 날씨 조회
export const getWeatherDB = () => {
  return async function (dispatch) {
    apis
      .loadWeather()
      .then((response) => {
        dispatch(getWeather(response.data));
      })
      .catch((error) => {
        // window.alert("날씨정보를 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};
// 오늘 시세 조회
export const getTodayMarketPriceDB = (data) => {
  return async function (dispatch) {
    apis
      .loadTodayMarketPrice(data)
      .then((response) => {
        dispatch(getTodayMarketPrice(response.data));
      })
      .catch((error) => {
        // window.alert("시세정보를 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};
// 선택 작물 시세 조회
export const getMarketPriceDB = (data) => {
  return async function (dispatch) {
    apis
      .loadMarketPrice(data)
      .then((response) => {
        dispatch(getMarketPrice(response.data));
      })
      .catch((error) => {
        // window.alert("시세정보를 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};

// 오늘 일정 조회
export const loadTodayScheduleDB = () => async (dispatch) => {
  try {
    const { data } = await apis.loadTodaySchedule();
    dispatch(getTodaySchedule(data));
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

// Reducer
export default handleActions(
  {
    // 오늘 날씨 조회
    [GET_WEATHER]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.weather = payload.data;
      }),
    // 오늘 시세 조회
    [GET_TODAY_MARKET_PRICE]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.todayMarketPrice = payload.data;
      }),
    // 선택 작물 시세 조회
    [GET_MARKET_PRICE]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.marketPrice = payload.data;
      }),
    // 오늘 일정 조회
    [GET_TODAY_SCHEDULE_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.todayScheduleList = payload.data;
      }),
  },
  initialState
);
