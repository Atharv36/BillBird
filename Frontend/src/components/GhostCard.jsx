import React from "react";

const GhostCard = ({style="",width="w-32" , name=""}) => {
  return (
    <span
      className={`inline-block bg-black/20 duration-200 rounded ${style} ${width} h-5 animate-pulse`}
      aria-hidden="true"
      style={{ animationDuration: "2s" }}
    />
  );
};

export default GhostCard;