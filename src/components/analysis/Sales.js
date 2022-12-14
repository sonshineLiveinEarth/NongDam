import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
// 로딩 효과
import { ShimmerThumbnail } from "react-shimmer-effects";

//컴포넌트
import SalesChart from "./SalesChart";

const Sales = ({ salesData, setSalesCategory, salesCategory }) => {
  const is_loaded = useSelector((state) => state.analysis.sales_is_loaded);
  // 항목 선택
  const changeRadio = (e) => {
    if (e.target.checked) {
      setSalesCategory(e.target.id);
    }
  };

  const allDataList = [];
  salesData.datas !== undefined &&
    salesData.datas.map((list, idx) => {
      return allDataList.push(...list.data);
    });
  const allDataListSort = allDataList.sort((a, b) => b - a);

  return (
    <>
      <Wrap>
        <Title>매출 현황</Title>
        {is_loaded ? (
          <>
            {allDataListSort[0] !== "0" ? (
              <CategoryWrap>
                <Label>
                  <FormCheckLeft
                    type="radio"
                    id="month"
                    name="SalesCategory"
                    onChange={changeRadio}
                    value={salesCategory}
                    defaultChecked
                  />
                  <FormCheckText>월별</FormCheckText>
                </Label>
                <Label>
                  <FormCheckLeft
                    type="radio"
                    id="year"
                    name="SalesCategory"
                    onChange={changeRadio}
                    value={salesCategory}
                  />
                  <FormCheckText>연도별</FormCheckText>
                </Label>
              </CategoryWrap>
            ) : null}

            {salesCategory === "month" && <SalesChart salesData={salesData} />}
            {salesCategory === "year" && <SalesChart salesData={salesData} />}
          </>
        ) : (
          <ShimmerWrap>
            <ShimmerThumbnail
              className="thumNail-weather"
              height={200}
              rounded
            />
          </ShimmerWrap>
        )}
      </Wrap>
    </>
  );
};

const Wrap = styled.div`
  grid-column: 6 / 10;
  grid-row: 3 / 4;

  background: #ffffff;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 20px;
  @media only screen and (max-width: 760px) {
    grid-column: 2 / 3;
    grid-row: 5 / 6;
  }
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const CategoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 14px;
`;

const FormCheckText = styled.span`
  width: auto;
  height: 26px;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  margin-right: 4px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;
  color: black;
  &:hover {
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
    font-weight: 700;
    border-bottom: 2px solid #000000;
  }
  display: none;
`;

const Label = styled.label``;

const ShimmerWrap = styled.div`
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export default Sales;
