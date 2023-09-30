// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    incrementClicks: "GO";
    resetClicks: "START";
    startTrafficLight: "START";
    stopTrafficLight: "GO";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isGreen: "GO";
  };
  eventsCausingServices: {};
  matchesStates: "gameOver" | "idle" | "playing";
  tags: never;
}
