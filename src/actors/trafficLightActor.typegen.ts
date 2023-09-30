// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(2000)#trafficLight.on.green": {
      type: "xstate.after(2000)#trafficLight.on.green";
    };
    "xstate.after(2000)#trafficLight.on.red": {
      type: "xstate.after(2000)#trafficLight.on.red";
    };
    "xstate.after(2000)#trafficLight.on.yellow": {
      type: "xstate.after(2000)#trafficLight.on.yellow";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "off"
    | "on"
    | "on.green"
    | "on.red"
    | "on.yellow"
    | { on?: "green" | "red" | "yellow" };
  tags: never;
}
