import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

const SalesCard = () => {
  return (
    <Wrap>
      <h2>매출현황</h2>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 400px;
  height: 250px;
  border: none;
  border-radius: 18px;
  box-shadow: 0px 3px 6px #00000029;
  padding: 4px 18px;
  margin: 20px;
`;

export default SalesCard;