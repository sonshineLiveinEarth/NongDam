import React, { useState, useRef } from "react";
import styled from "styled-components";
import Modal from "styled-react-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { deleteScheduleDB, editScheduleDB } from "../../redux/modules/schedule";
// 날짜 라이브러리
import moment from "moment";
import "moment/locale/ko";
// 날짜 선택 라이브러리
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
// alert 라이브러리
import Swal from "sweetalert2";

const EventScheduleModal = ({
  isOpen,
  toggleModal,
  eventInfo,
  scheduleList,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();
  const inputRef = useRef();
  const memoRef = useRef();

  const currentScheduleList = useSelector(
    (state) => state.schedule.currentSchedule
  );
  const yearMonth = useSelector((state) => state.account.yearMonth);
  //스케줄 상세 모달 열기
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState();
  const startTimeEventFormat = moment(eventInfo.start).format(
    "YYYY-MM-DD HH:mm"
  );
  const schedule = scheduleList?.find(
    (list) =>
      list.startTime === startTimeEventFormat && list.toDo === eventInfo.title
  );
  const myCropsList = useSelector((state) => state.users.user?.crops);
  const [openEdit, setOpenEdit] = useState(false);

  //new Date에 인자로 들어갈 날짜 형식의 -를 /로 변경
  const firstStartTime = schedule.startTime;
  const startTimeNewDateFormat = firstStartTime.replace(/-/g, "/");
  const firstEndTime = schedule.endTime;
  const endTimeNewDateFormat = firstEndTime.replace(/-/g, "/");

  const [startTime, setStartTime] = useState(new Date(startTimeNewDateFormat));
  const [endTime, setEndTime] = useState(new Date(endTimeNewDateFormat));
  const [toDo, setToDo] = useState(schedule?.toDo);
  const [checkedWork, setCheckedWork] = useState("");
  const [checkedCrops, setCheckedCrops] = useState(schedule?.cropId);
  const [dateErr, setDateErr] = useState(false);
  function toggleEditModal() {
    setOpenEdit(!openEdit);
  }

  const onChangeEndDate = (date) => {
    console.log(date);
    if (startTime > date) {
      setDateErr(true);
    } else {
      setDateErr(false);
    }
  };
  const changeRadioCrops = (e) => {
    if (e.target.checked) {
      setCheckedCrops(e.target.id);
    }
  };
  const changeRadioWork = (e) => {
    if (e.target.checked) {
      setToDo(e.target.id);
      memoRef.current.value = e.target.id;
    }
  };
  const changeRadioWorkNone = (e) => {
    if (e.target.checked) {
      setToDo("");
    }
  };

  const deleteSchedule = () => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#318F27",
      cancelButtonColor: "#ddd",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteScheduleDB(schedule.id));
        toggleModal();

        Swal.fire({
          title: "삭제가 완료되었습니다.",
          icon: "success",
          showConfirmButton: false,
          timer: 1300,
          color: "#black",
          padding: "20px",
          width: "400px",
          height: "200px",
        });
      }
    });
  };

  const editSchedule = () => {
    const id = schedule.id;
    const data = {
      cropId: checkedCrops,
      startTime: startTimeFormat,
      endTime: endTimeFormat,
      toDo: toDo,
    };

    dispatch(editScheduleDB(id, data, yearMonth)).then(() => {
      toggleModal();
    });
  };

  const startTimeFormat = moment(startTime).format("YYYY-MM-DD HH:mm");
  const endTimeFormat = moment(endTime).format("YYYY-MM-DD HH:mm");
  const startTimeLoadFormat = moment(startTime).format(
    "yyyy년 MM월 DD일 HH:mm"
  );
  const endTimeLoadFormat = moment(endTime).format("yyyy년 MM월 DD일 HH:mm");

  function detailToggleModal(id) {
    setScheduleOpen(!scheduleOpen);
    setScheduleId(id);
  }

  const eventInfoStartTime = moment(eventInfo.start).format(
    "YY년 MM월 DD일 HH시MM분"
  );
  const eventInfoEndTime = moment(eventInfo.end).format(
    "YY년 MM월 DD일 HH시MM분"
  );

  return (
    <>
      <StyledModal
        isOpen={isOpen}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
      >
        <WrapWrap>
          {openEdit ? (
            <TotalTitle> 일정 수정</TotalTitle>
          ) : (
            <TotalTitle>일정 확인</TotalTitle>
          )}
          <Wrap>
            <LeftWrap>
              <CropWrap>
                <SmallTitle>작물</SmallTitle>
                {openEdit ? (
                  <>
                    <CropEditWrap>
                      {myCropsList !== undefined
                        ? myCropsList.map((list, idx) => {
                            return (
                              <Label key={idx}>
                                <FormCheckLeft
                                  type="radio"
                                  ref={ref}
                                  id={list.id}
                                  name="cropName"
                                  onChange={changeRadioCrops}
                                  value={checkedCrops}
                                  defaultChecked={
                                    list.id === schedule?.crop.id ? true : false
                                  }
                                />
                                <FormCheckText>
                                  {list !== undefined && list?.name}
                                </FormCheckText>
                              </Label>
                            );
                          })
                        : null}
                    </CropEditWrap>
                  </>
                ) : (
                  <CropLoadWrap>
                    <CropName>
                      {schedule !== undefined && schedule?.crop.name}
                    </CropName>
                  </CropLoadWrap>
                )}
              </CropWrap>
              <TimeWrap>
                <Start>
                  <SmallTitle>시작</SmallTitle>
                  {openEdit ? (
                    <DatePicker
                      className="startDatePicker"
                      selected={startTime}
                      onChange={(date) => {
                        setStartTime(date);
                      }}
                      showTimeSelect
                      dateFormat="yyyy년 MM월 dd일 HH:mm" // 시간 포맷 변경
                      locale={ko} // 한글로 변경
                    />
                  ) : (
                    <LoadStart>{startTimeLoadFormat}</LoadStart>
                  )}
                </Start>
                <End>
                  <SmallTitle>종료</SmallTitle>
                  {openEdit ? (
                    <>
                      <DatePicker
                        className="endDatePicker"
                        selected={endTime}
                        onChange={(date) => {
                          onChangeEndDate(date);
                          setEndTime(date);
                        }}
                        startDate={startTime}
                        endDate={endTime}
                        showTimeSelect
                        selectsEnd
                        minDate={startTime} //오늘보다 이전 날짜는 선택 못하게
                        dateFormat="yyyy년 MM월 dd일 HH:mm"
                        locale={ko} // 한글로 변경
                        //inline//달력 보이게
                      />
                      {dateErr === true && (
                        <ErrorMsg>
                          종료시간은 시작시간보다 빠르게 지정할 수 없습니다.
                        </ErrorMsg>
                      )}
                    </>
                  ) : (
                    <EndTime>{endTimeLoadFormat}</EndTime>
                  )}
                </End>
              </TimeWrap>
            </LeftWrap>
            <RightWrap>
              <WorkWrap>
                {openEdit ? (
                  <>
                    <SmallTitle>농작업</SmallTitle>
                    <WorkSelectBoxWrap>
                      <LabelWork>
                        <FormCheckLeftWork
                          type="radio"
                          id="비료뿌리기"
                          name="radioButtonWork"
                          onChange={changeRadioWork}
                          value={checkedWork}
                          defaultChecked={
                            schedule.toDo === "비료뿌리기" ? true : false
                          }
                        />
                        <FormCheckTextWork>비료뿌리기 </FormCheckTextWork>
                      </LabelWork>
                      <LabelWork>
                        <FormCheckLeftWork
                          type="radio"
                          id="농약치기"
                          name="radioButtonWork"
                          onChange={changeRadioWork}
                          value={checkedWork}
                          defaultChecked={
                            schedule.toDo === "농약치기" ? true : false
                          }
                        />
                        <FormCheckTextWork>농약치기</FormCheckTextWork>
                      </LabelWork>
                      <LabelWork>
                        <FormCheckLeftWork
                          type="radio"
                          id="수확"
                          name="radioButtonWork"
                          onChange={changeRadioWork}
                          value={checkedWork}
                          defaultChecked={
                            schedule.toDo === "수확" ? true : false
                          }
                        />
                        <FormCheckTextWork>수확</FormCheckTextWork>
                      </LabelWork>
                    </WorkSelectBoxWrap>
                    <MemoWrap>
                      <SmallTitle>작업 내용</SmallTitle>
                      <InputMemo
                        maxLength="100"
                        ref={memoRef}
                        defaultValue={schedule.toDo}
                        onChange={(e) => setToDo(e.target.value)}
                        placeholder="메모를 입력해주세요"
                      />
                    </MemoWrap>
                  </>
                ) : (
                  <MemoWrap>
                    <SmallTitle>작업 내용</SmallTitle>
                    {schedule.toDo !== "" ? (
                      <WorkContent>{schedule.toDo}</WorkContent>
                    ) : null}
                  </MemoWrap>
                )}
              </WorkWrap>

              <BtnWrap>
                {openEdit ? (
                  <>
                    <EditBtn
                      onClick={() => {
                        editSchedule();
                        navigate("/schedule");
                      }}
                    >
                      수정완료
                    </EditBtn>
                    <Btn
                      onClick={() => {
                        toggleModal();
                      }}
                    >
                      취소
                    </Btn>
                  </>
                ) : (
                  <div>
                    <Btn onClick={toggleEditModal}>수정하기</Btn>
                    <Btn onClick={deleteSchedule}>삭제하기</Btn>
                    <Btn onClick={toggleModal}>닫기</Btn>
                  </div>
                )}
              </BtnWrap>
            </RightWrap>
          </Wrap>
        </WrapWrap>
        {/* {scheduleOpen && (
          <ScheduleModal
            isOpen={scheduleOpen}
            toggleModal={detailToggleModal}
            scheduleId={scheduleId}
            scheduleList={scheduleList}
          />
        )} */}
      </StyledModal>
    </>
  );
};
const StyledModal = Modal.styled`
  min-width : 560px;
  height : auto;
  background-color: white;
  border-radius: 10px;
  padding: 20px 30px 20px 20px;
  @media only screen and (max-width: 760px) {
    min-width : 340px;
    width: 70%;
  }
`;

const WrapWrap = styled.div`
  width: auto;
  @media only screen and (max-width: 760px) {
    width: 95%;
    justify-content: flex-start;
  }
`;

const TotalTitle = styled.label`
  font-size: 27px;
  font-weight: 700;
  display: flex;
  text-align: left;
  align-items: start;
  margin-left: 5px;
  margin-bottom: 10px;
  @media only screen and (max-width: 760px) {
    margin: 0px;
  }
`;
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 10px;
  background-color: white;
  border-radius: 20px;
  position: relative;
  @media only screen and (max-width: 760px) {
    width: 97%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0px;
  }
`;
const LeftWrap = styled.div`
  flex-direction: column;
  min-width: 150px;
  margin-right: 70px;
  @media only screen and (max-width: 760px) {
    display: flex;
    justify-content: flex-start;
    margin-right: 0px;
    width: 100%;
  }
`;

const CropWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
  max-width: 300px;
  flex-wrap: wrap;
  @media only Screen and (max-width: 760px) {
    margin-top: 20px;
    margin-bottom: 10px;
    justify-content: flex-start;
  }
`;

const SmallTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  @media only Screen and (max-width: 760px) {
  }
`;

const Label = styled.label`
  font-size: 18px;
`;

const CropEditWrap = styled.div`
  display: flex;
  margin-top: 5px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  @media only Screen and (max-width: 760px) {
    justify-content: flex-start;
    margin: 0px;
    flex-wrap: wrap;
    width: 100%;
  }
`;

const EditStart = styled.div`
  @media only Screen and (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const FormCheckText = styled.span`
  width: auto;
  height: auto;
  font-size: 14px;
  padding: 4px 13px;
  border-radius: 13px;
  background: transparent;
  border: 1px solid #bfbfbf;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  color: #ccc;
  margin: 4px 6px 4px 0px;
  &:hover {
    color: black;
    border: 1px solid black;
  }
  @media only screen and (max-width: 760px) {
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const FormCheckLeft = styled.input.attrs({ type: "radio" })`
  &:checked {
    display: inline-block;
    background: none;
    text-align: center;
    display: none;
  }
  &:checked + ${FormCheckText} {
    color: black;
    border: 1px solid black;
  }
  display: none;
`;

const CropLoadWrap = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 0px;
  min-width: 200px;
`;

const CropName = styled.p`
  width: auto;
  height: auto;
  text-align: center;
  padding: 4px 13px;
  font-size: 14px;
  border: 1px solid #bfbfbf;
  border-radius: 10px;
  margin-top: 8px;
  font-size: 14px;
  @media only Screen and (max-width: 760px) {
    font-size: 16px;
    margin-top: 10px;
  }
`;

const TimeWrap = styled.div`
  flex-direction: column;
  width: auto;
  margin-bottom: 15px;
  .startDatePicker {
    width: 190px;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 20px;
    background-color: transparent;
    color: black;
    border: none;
    cursor: pointer;
    border-bottom: 1px solid #bfbfbf;
    &:focus {
      outline: none;
      border-bottom: 1px solid black;
    }
    @media only Screen and (max-width: 760px) {
      width: 65%;
      font-size: 18px;
      justify-content: flex-start;
      margin-top: 10px;
      margin-bottom: 0px;
    }
  }
  .endDatePicker {
    width: 190px;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 40px;
    background-color: transparent;
    color: black;
    border: none;
    cursor: pointer;
    border-bottom: 1px solid #bfbfbf;
    &:focus {
      outline: none;
      border-bottom: 1px solid black;
    }
    @media only Screen and (max-width: 760px) {
      width: 65%;
      justify-content: flex-start;
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 18px;
    }
  }
  @media only Screen and (max-width: 760px) {
    justify-content: flex-start;

    margin-bottom: 0px;
  }
`;

const LoadStart = styled.div`
  font-size: 16px;
  background-color: transparent;
  color: #02113b;
  margin-bottom: 15px;
  border: none;
  :focus {
    outline: none;
  }
  @media only screen and (max-width: 760px) {
  }
`;

const EditEnd = styled.div`
  @media only screen and (max-width: 760px) {
    margin: 0px;
  }
`;
const EndTime = styled.div`
  font-size: 16px;
  background-color: transparent;
  color: #02113b;
  border: none;
  :focus {
    outline: none;
  }
  @media only screen and (max-width: 760px) {
    margin-bottom: 20px;
  }
`;
const End = styled.div`
  .endDatePicker {
    width: 63%;
  }
  @media only screen and (max-width: 760px) {
    margin-bottom: 10px;
  }
`;
const ErrorMsg = styled.span`
  text-align: left;
  margin-top: 3px;
  font-size: 11px;
  color: #ec0000;
`;
const Start = styled.div`
  margin-bottom: 5px;
  @media only screen and (max-width: 760px) {
    margin-bottom: 20px;
  }
`;

const RightWrap = styled.div`
  margin-left: 25px;
  margin-right: 10px;
  @media only screen and (max-width: 760px) {
    justify-content: flex-start;
    margin: 0px;
    width: 100%;
  }
`;

const WorkWrap = styled.div`
  margin-left: -69px;
  @media only screen and (max-width: 760px) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 0px;
  }
`;
const EditWork = styled.div`
  @media only screen and (max-width: 760px) {
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
`;

const WorkSelectBoxWrap = styled.div`
  margin-top: 5px;
  margin-bottom: 13px;
  display: flex;
  @media only screen and (max-width: 760px) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 7px;
    margin-bottom: 9px;
  }
`;

const LabelWork = styled.label``;

const FormCheckTextWork = styled.span`
  width: auto;
  height: auto;
  padding: 4px 13px;
  border-radius: 13px;
  background: transparent;
  border: 1px solid #bfbfbf;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-size: 14px;
  margin-top: 4px;
  cursor: pointer;
  color: #ccc;
  &:hover {
    color: black;
    border: 1px solid black;
  }
  @media only screen and (max-width: 760px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

const FormCheckLeftWork = styled.input.attrs({ type: "radio" })`
  &:checked {
    display: inline-block;
    background: none;
    text-align: center;
    display: none;
  }
  &:checked + ${FormCheckTextWork} {
    color: black;
    border: 1px solid black;
  }
  display: none;
`;
const MemoWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  @media only screen and (max-width: 760px) {
    margin-top: 20px;
  }
`;

const InputMemo = styled.textarea`
  /* max-width: 400px; */
  min-width: 250px;
  height: auto;
  font-size: 16px;
  color: #616161;
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 120px;
  border: 1px solid #bfbfbf;
  border-radius: 10px;
  margin-top: 5px;

  resize: none;
  &::placeholder {
    color: #ddd;
    font-size: 14px;
  }
  &:focus {
    outline: none;
    border: 1px solid black;
  }
  @media only screen and (max-width: 760px) {
    justify-content: flex-start;
    width: 100%;
    margin-top: 10px;
    font-size: 18px;
  }
`;
const WorkLoadWrap = styled.div`
  @media only screen and (max-width: 760px) {
    justify-content: flex-start;
  }
`;
const WorkContent = styled.div`
  font-size: 16px;
  color: #616161;
  max-width: 350px;
  min-width: 250px;
  min-height: 100px;
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #bfbfbf;
  border-radius: 10px;
  @media only screen and (max-width: 760px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const BtnWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  margin-right: 1px;
  @media only screen and (max-width: 760px) {
    justify-content: flex-end;
    margin-top: 8px;
    width: 107%;
  }
`;
const EditBtn = styled.button`
  font-size: 14px;
  background-color: #318f27;
  color: #ffffff;
  border-radius: 8px;
  border: none;
  margin-left: 10px;
  padding: 6px 15px;
  cursor: pointer;
  &:hover {
    background-color: #22631c;
  }
`;

const Btn = styled.button`
  font-size: 14px;
  background-color: transparent;
  color: #616161;
  border-radius: 8px;
  border: 1px solid #bfbfbf;
  margin-left: 10px;
  padding: 6px 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  @media only screen and (max-width: 760px) {
  }
`;

export default EventScheduleModal;
