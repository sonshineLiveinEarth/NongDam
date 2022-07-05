import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

const SalesCard = () => {
  return (
    <Wrap>
      <Title>📊 농장 관리 현황</Title>
    </Wrap>
  );
};

const Wrap = styled.div`
  border: none;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 16px 16px;
  background-color: #fff;
  grid-column: 3 / 5;
  grid-row: 4 / 6;
  @media only screen and (max-width: 760px) {
    grid-column: 2 / 3;
    grid-row: 7 / 8;
  }
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 1.4em;
  line-height: 10px;
`;

export default SalesCard;
