import { createMachine } from "xstate"
import { createActorStore } from "../utils/actorStores"
import { computed } from "nanostores"

const trafficLightMachine = createMachine({
  context: {} as object,
  id: 'trafficLight',
  initial: 'off',
  states: {
    off: {
      on: {
        START: 'on',
      },
    },
    on: {
      initial: 'red',
      on: {
        TIMER: 'on',
        STOP: 'off',
      },
      states: {
        green: {
          after: {
            2000: 'red',
          },
        },
        red: {
          after: {
            2000: 'yellow',
          },
        },
        yellow: {
          after: {
            2000: 'green',
          },
        },
      },
    },
  },
})

export const {
  $state: $trafficLightState,
  $actor: $trafficLightActor,
} = createActorStore(trafficLightMachine)

export const isTrafficLightGreen = computed($trafficLightState, (state) => state.matches('on.green'))
