import { createMachine, assign } from "xstate"
import { createActorStore } from "../utils/actorStores"
import { $trafficLightActor, isTrafficLightGreen } from "./trafficLightActor"
import { createUpdater, type ImmerUpdateEvent } from '@xstate/immer'

type IsTrafficLightGreenUpdateContext = { isTrafficLightGreen: boolean }
type IsTrafficLightGreenUpdateEvent = ImmerUpdateEvent<'computed.isTrafficLightGreen', boolean>
const isTrafficLightGreenUpdater = createUpdater<IsTrafficLightGreenUpdateContext, IsTrafficLightGreenUpdateEvent>('computed.isTrafficLightGreen', (ctx, { input }) => {
  ctx.isTrafficLightGreen = input
})

const gameMachine = createMachine({
  tsTypes: {} as import("./gameActor.typegen").Typegen0,
  schema: {
    context: {} as {
      clicks: number
    } & IsTrafficLightGreenUpdateContext,
    events: {} as
      | { type: "START" }
      | { type: "GO" }
      | IsTrafficLightGreenUpdateEvent
  },
  on: {
    [isTrafficLightGreenUpdater.type]: {
      actions: isTrafficLightGreenUpdater.action,
    }
  },
  context: {
    clicks: 0,
    // TODO: calculate this instead from the event that is intially sent to it
    isTrafficLightGreen: false,
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
      $trafficLightActor.value?.send({ type: 'START' })
    },
    stopTrafficLight: () => {
      $trafficLightActor.value?.send({ type: 'STOP' })
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

// TODO: Make this part of the computed atom
isTrafficLightGreen.subscribe((value) => {
  // TODO: The actor is null. Need to pass in some initial state here
  $gameMachineActor.value?.send(isTrafficLightGreenUpdater.update(value))
})
