import { createMachine, assign } from "xstate"
import { createActorStore } from "../utils/actorStores"
import { $trafficLightActor, isTrafficLightGreen } from "./trafficLightActor"

const gameMachine = createMachine({
  on: {
    'update.isTrafficLightGreen': {
      actions: assign({
        isTrafficLightGreen: (_, event) => event.value,
      }),
    },
  },
  context: {
    clicks: 0,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: {
          actions: ['resetClicks', 'startTrafficLight'],
          target: 'playing'
        }
      }
    },
    playing: {
      on: {
        GO: [
          {
            cond: 'isGreen',
            actions: ['incrementClicks'],
          },
          {
            actions: 'stopTrafficLight',
            target: 'gameOver',
          },
        ],
      },
    },
    gameOver: {
      on: {
        START: {
          actions: ['resetClicks', 'startTrafficLight'],
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
    startTrafficLight: () => {
      $trafficLightActor.value?.send('TOGGLE')
    },
    stopTrafficLight: () => {
      $trafficLightActor.value?.send('TOGGLE')
    },
  },
  guards: {
    // FAILED: We want to make this guard pure
    // isGreen: () => isTrafficLightGreen.get(),
    isGreen: (context) => context.isTrafficLightGreen,
  },
})

export const {
  $state: $gameMachineState,
  $actor: $gameMachineActor,
} = createActorStore(gameMachine)

isTrafficLightGreen.subscribe((value) => {
  $gameMachineActor.value?.send({ type: 'update.isTrafficLightGreen', value })
})
