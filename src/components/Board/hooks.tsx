import React from "react";
import { BoardActions } from "./Board";

const useBoardActions = () => {
  const [actions, setActions] = React.useState<BoardActions>({
    alert: () => console.error("Missing Implementation!"),
  });

  const onLoaded = (actions: BoardActions) => {
    setActions(actions);
  };

  return { actions, onLoaded };
};

export default useBoardActions;
