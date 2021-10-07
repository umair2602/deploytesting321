import React from "react";
import { Spinner } from "react-bootstrap";
import usersInfoBox from "../../../../appStyles/adminStyles/usersInfoBox.module.css";

const ButtonCustomWidth = (props: any) => {
  const { width, height, onClick, title, type, disabled, loading } = props;
  return (
    <button
      style={{ width: width, height: height }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={usersInfoBox.buttonCustomWIdth}
    >
      {loading ? <Spinner animation="grow" variant="secondary" /> : title}
    </button>
  );
};

export default ButtonCustomWidth;
