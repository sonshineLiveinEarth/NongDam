import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../../BigCalendarSchedule.css";

// 컴포넌트
import ToolBarSchedule from "./ToolBarSchedule";
import Day from "./DaySchedule";
import EventSchedule from "./EventSchedule";
import EventScheduleModal from "./EventScheduleModal";

const ScheduleCalendar = () => {
  const navigate = useNavigate();
  const [nowMonth, setNowMonth] = useState(null);

  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);
  const userInfo = useSelector((state) => state.users.user);
  const scheduleList = useSelector((state) => state.schedule.scheduleList);
  const yearMonth = useSelector((state) => state.schedule.yearMonth);

  //큰 달력에서 모달 열기
  const [isOpen, setOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState(null);
  const [eventDate, setEventDate] = useState([]);
  const [view, setView] = useState("month");
  const [windowSize, setWindowSize] = useState(getWindowSize());

  function toggleModal() {
    setOpen(!isOpen);
  }

  // 윈도우 사이즈 추적
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  return (
    <>
      {userInfo?.crops.length === 0 ? (
        <NoticeWrap windowSize={windowSize.innerWidth}>
          <NoticeT>
            지금 내 작물을 등록하고
            <br />
            농사 일정을 기록해보세요!
          </NoticeT>
          <NoticeBtn
            onClick={() => {
              navigate("/mypage/editmemberinfo");
            }}
          >
            등록하러 가기
          </NoticeBtn>
        </NoticeWrap>
      ) : null}

      {view === "day" ? (
        <MonthChangeBtn
          onClick={(e) => {
            if (view === "month") {
              setView("day");
            } else {
              setView("month");
            }
          }}
        >
          month
        </MonthChangeBtn>
      ) : null}
      {windowSize.innerWidth > 760 && (
        <Calendar
          events={scheduleList.map((list, id) => {
            const startTimeFormat = list.startTime.replace(/-/g, "/");
            const endTimeFormat = list.endTime.replace(/-/g, "/");
            // 여기에 달력 모달 내용 삽입
            // <div key={id} />;
            return {
              title: list.toDo,
              allDay: false,
              start: new Date(startTimeFormat),
              end: new Date(endTimeFormat),
              crop: list.crop,
            };
          })}
          localizer={localizer}
          style={{ height: 100 + "%", width: 100 + "%" }}
          components={{
            toolbar: ToolBarSchedule,
            month: {
              dateHeader: Day,
            },
          }}
          defaultView="month"
          view={view}
          onView={(view) => setView(view)}
          setNowMonth={setNowMonth}
          onSelectEvent={(eventInfo) => {
            setEventInfo(eventInfo);
            toggleModal();
          }}
          eventPropGetter={EventSchedule}
        />
      )}
      {windowSize.innerWidth <= 760 && userInfo?.crops.length !== 0 ? (
        <Calendar
          events={scheduleList.map((list, id) => {
            // 여기에 달력 모달 내용 삽입
            const startTimeFormat = list.startTime.replace(/-/g, "/");
            const endTimeFormat = list.endTime.replace(/-/g, "/");
            <div key={id} />;
            return {
              title: list.toDo,
              allDay: false,
              start: new Date(startTimeFormat),
              end: new Date(endTimeFormat),
              crop: list.crop,
            };
          })}
          localizer={localizer}
          style={{ height: 100 + "%", width: 100 + "%" }}
          components={{
            toolbar: ToolBarSchedule,
            month: {
              dateHeader: Day,
            },
          }}
          defaultView="month"
          view={view}
          onView={(view) => setView(view)}
          setNowMonth={setNowMonth}
          onSelectEvent={(eventInfo) => {
            setEventInfo(eventInfo);
            toggleModal();
          }}
          eventPropGetter={EventSchedule}
        />
      ) : null}

      {isOpen && (
        <EventScheduleModal
          isOpen={isOpen}
          toggleModal={toggleModal}
          eventInfo={eventInfo}
          scheduleList={scheduleList}
        />
      )}
    </>
  );
};

const Wrap = styled.div``;

const NoticeWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${({ windowSize }) => (windowSize <= 760 ? "0" : "100")};
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 1) 40%,
    white 100%
  );
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 10px;
`;

const NoticeT = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
`;

const NoticeBtn = styled.button`
  padding: 8px 18px;
  margin-top: 8px;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  color: #1aacff;
  font-size: 14px;
  margin-bottom: 1px;
  cursor: pointer;
  &:hover {
    font-weight: 600;
  }
`;

const MonthChangeBtn = styled.div`
  border: 1px solid #bfbfbf;
  border-radius: 13px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 13px;
  padding-left: 13px;
  color: #616161;
  font-size: 14px;
  background-color: transparent;
  position: absolute;
  /* left: 75%; */
  right: 140px;
  top: 35px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  @media only screen and (max-width: 760px) {
    width: 40px;
    transform: translate(20px, -5px);
  }
`;

export default ScheduleCalendar;
