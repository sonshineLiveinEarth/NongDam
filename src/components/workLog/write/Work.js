import { React, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInfoDB } from "../../../redux/modules/users";

//달력
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import { ko } from "date-fns/esm/locale";
import moment from "moment";

const Work = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();

  const [checkedInputs, setCheckedInputs] = useState("");
  const [checkedCrop, setCheckedCrop] = useState("");
  const [cropTodo, setCropTodo] = useState("");
  const [work, setWork] = useState("");
  const [memo, setMemo] = useState("");
  const [workDate, setWorkDate] = useState(new Date());

  //유저가 선택한 작물 불러오기
  useEffect(() => {
    dispatch(getInfoDB());
  }, []);

  const userInfo = useSelector((state) => state.users.user);

  const changeRadioCrops = (e) => {
    if (e.target.checked) {
      props.setCrop(e.target.id);
    }
  };

  // 숫자만 입력
  function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  }

  function inputNumberFormat(e) {
    e.target.value = uncomma(e.target.value);
    props.setWorkTime(e.target.value);
  }
  console.log(userInfo.crops);
  return (
    <TodoContentWrap>
      <TitleInput
        maxLength="18"
        placeholder="제목을 작성해주세요"
        onChange={(e) => {
          props.setTitle(e.target.value);
        }}
      />

      <CategoryBigWrap>
        <SmallTitle>작물</SmallTitle>
        <CategoryWrap>
          {userInfo.crops !== undefined && userInfo.crops.length !== 0 ? (
            userInfo.crops.map((list) => {
              return (
                <Label key={list.id}>
                  <FormCheckLeft
                    type="radio"
                    id={list.id}
                    name="radioButton"
                    onChange={changeRadioCrops}
                    value={checkedCrop}
                  />
                  <FormCheckText>{list.type}</FormCheckText>
                </Label>
              );
            })
          ) : (
            <NoCropWrap>
              <NoticeT>작물을 등록해주세요 </NoticeT>
              <NoticeBtn
                onClick={() => {
                  navigate("/mypage/editmemberinfo");
                }}
              >
                등록하러 가기
              </NoticeBtn>
            </NoCropWrap>
          )}
        </CategoryWrap>
      </CategoryBigWrap>
      <CategoryBigWrap>
        <SmallTitle className="calender">작업 날짜</SmallTitle>
        <DatePickers>
          <DatePicker
            className="startDatePicker"
            selected={workDate}
            onChange={(date) => {
              setWorkDate(date);
              props.setDate(date);
            }}
            dateFormat="yyyy.MM.dd" // 시간 포맷 변경
            locale={ko} // 한글로 변경
            //inline//달력 보이게
          />
        </DatePickers>
      </CategoryBigWrap>
      <CategoryBigWrap>
        <SmallTitle className="calender">작업시간</SmallTitle>
        <TimeContent>
          <TimeInput
            type="text"
            maxLength="4"
            onChange={(e) => {
              inputNumberFormat(e);
            }}
          />
          <p className="inputTitle">시간</p>
        </TimeContent>
      </CategoryBigWrap>
    </TodoContentWrap>
  );
};

const TodoContentWrap = styled.div`
  padding: 0px;
  width: 100%;
  height: auto;
  background-color: #fff;
`;

const CategoryBigWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const TitleInput = styled.input`
  height: 30px;
  width: 500px;
  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 1px solid #bfbfbf;
  font-size: 30px;
  padding: 10px;
  margin-bottom: 10px;
  &:focus {
    outline: none;
    border-bottom: 1px solid black;
  }
  &::placeholder {
    color: #ccc;
  }
  @media only screen and (max-width: 760px) {
    width: 95%;
    font-size: 30px;
    margin-bottom: 4px;
  }
`;

const CategoryWrap = styled.div`
  display: flex;
  margin-top: 10px;
  @media only screen and (max-width: 760px) {
    font-size: 12px;
    flex-wrap: wrap;
  }
`;

const SmallTitle = styled.label`
  font-size: 18px;
  font-weight: 700;
`;

const FormCheckText = styled.span`
  width: auto;
  height: auto;
  font-size: 14px;
  padding: 5px 11px;
  margin-top: 5px;
  border-radius: 15px;
  background: transparent;
  border: 1px solid #ccc;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  color: #ccc;
  &:hover {
    color: black;
    border: 1px solid black;
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

const Label = styled.label``;

const NoCropWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoticeT = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  @media only screen and (max-width: 760px) {
    font-size: 16px;
  }
`;

const NoticeBtn = styled.button`
  padding: 8px 18px;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  color: #1aacff;
  font-size: 14px;
  margin-top: 4px;
  cursor: pointer;
  &:hover {
    font-weight: 600;
    text-decoration: underline;
  }
  @media only screen and (max-width: 760px) {
    font-size: 14px;
    text-decoration: underline;
  }
`;

const DatePickers = styled.div`
  margin-top: 6px;
  .startDatePicker {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 24px;
    width: 120px;
    border: none;
    background-color: transparent;
    color: black;
    cursor: pointer;
    border-bottom: 1px solid #bfbfbf;
    &:focus {
      outline: none;
      border-bottom: 1px solid black;
    }
  }
`;

const TimeContent = styled.div`
  display: flex;
  align-items: center;
  .inputTitle {
    font-size: 14px;
  }
`;
const TimeInput = styled.input`
  width: 40px;
  padding: 4px 10px;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #bfbfbf;
  margin-right: 6px;
  text-align: center;
  &:focus {
    outline: none;
    border-bottom: 1px solid black;
  }
`;

const TodoInput = styled.textarea`
  width: 400px;
  height: 10em;
  resize: none;
  font-size: 14px;
  border: 1px solid #bfbfbf;
  margin-top: 5px;
  border-radius: 10px;
  padding: 8px;
  &::placeholder {
    color: #ddd;
    font-size: 14px;
  }
`;

export default Work;
