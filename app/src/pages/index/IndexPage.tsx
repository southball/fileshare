import React from "react";

type Props = {
  message: string;
};

export const IndexPage: React.FC<Props> = (props) => {
  return (
    <div>
      <h1>Home</h1>
      <div>{props.message}</div>
    </div>
  );
};
