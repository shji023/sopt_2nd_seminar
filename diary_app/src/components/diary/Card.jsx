import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Styled from "styled-components";
import CardHeader from "../diary/CardHeader";
import CardInfo from "../diary/CardInfo";
import { createCardData } from "../../lib/api";

const CardWrap = Styled.div`
  width: 785px;
  height: 600px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  textarea {
    width: 642px;
    height: 219px;
    background-color: #EFEFEF;
    font-size: 18px;
    resize: none;
    font-family: Roboto;
    border: none;
    padding: 14px;
    box-sizing: border-box;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #C4C4C4;
    }
  }
`;

const Card = ({ data, match, history, rawData, year, month }) => {
  const isReadOnly = match.path === "/diary/:id" ? true : false;
  const [state, setState] = useState(data);
  const id = parseInt(match.params.id);

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleEdit = async () => {
    const index = rawData[year][month].findIndex((data) => data.id === id);
    const newList = rawData[year].filter((data) => data);
    newList[month][index] = state;
    const data = await createCardData({ ...rawData, [year]: newList });
    history.goBack();
  };

  const handleDelete = async () => {
    const filteredList = rawData[year][month].filter((data) => data.id !== id);
    const newList = rawData[year].filter((data) => data);
    newList[month] = filteredList;
    const data = await createCardData({ ...rawData, [year]: newList });
    history.goBack();
  };

  return (
    <CardWrap>
      <CardHeader
        title={state.title}
        isReadOnly={isReadOnly}
        handleChange={handleChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <CardInfo
        data={state}
        isReadOnly={isReadOnly}
        handleChange={handleChange}
      />
      <textarea
        placeholder="오늘을 기록해 주세요"
        readOnly={isReadOnly}
        value={state.text}
        name="text"
        onChange={handleChange}
      />
    </CardWrap>
  );
};

export default withRouter(Card);
