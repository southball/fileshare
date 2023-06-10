import React from "react";

type Props = {
  message: string;
};

export const IndexPage: React.FC<Props> = (props) => {
  return <div>{props.message}</div>;
};
