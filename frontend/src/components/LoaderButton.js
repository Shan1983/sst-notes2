import React from "react";
import Button from "react-bootstrap/esm/Button";
import "./LoaderButton.css";
import { BsArrowRepeat } from "react-icons/bs";

const LoaderButton = ({
  isLoading,
  classname = "",
  disbaled = false,
  ...props
}) => {
  return (
    <Button
      disabled={disbaled || isLoading}
      className={`LoaderButton ${classname}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
};

export default LoaderButton;
