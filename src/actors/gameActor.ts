import { createMachine, assign } from "xstate"
import { createActorStore } from "../utils/actorStores"
import { isTrafficLightGreen } from "./trafficLightActor"

const gameMachine = createMachine({
  context: {
    clicks: 0,
  },
  initial: 'playing',
  states: {
    playing: {
      on: {
        GO: [
          {
            cond: 'isGreen',
            actions: ['incrementClicks'],
          },
          {
            target: 'gameOver',
          },
        ],
      },
    },
    gameOver: {
      on: {
        START: {
          actions: 'resetClicks',
          target: 'playing'
        }
      }
    },
  },
}, {
  actions: {
    incrementClicks: assign({
      clicks: (context) => context.clicks + 1,
    }),
    resetClicks: assign({
      clicks: 0,
    }),
  },
  guards: {
    // FAILED: We want to make this guard pure
    isGreen: () => isTrafficLightGreen.get(),
  },
})

export const {
  $state: $gameMachineState,
  $actor: $gameMachineActor,
} = createActorStore(gameMachine)
