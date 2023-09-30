import { createMachine, assign, raise } from "xstate"
import { createActorStore } from "../utils/actorStores"
import { $trafficLightActor, isTrafficLightGreen } from "./trafficLightActor"
import { createUpdater } from '@xstate/immer'

const isTrafficLightGreenUpdater = createUpdater('computed.isTrafficLightGreen', (ctx, { input }) => {
  ctx.isTrafficLightGreen = input
})

const gameMachine = createMachine({
  on: {
    // TODO: Spread this in to the root somehow (multiple updaters)
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
      invoke: {
        id: 'keydownListener',
        src: () => (callback) => {
          document.addEventListener('keydown', callback)
          return () => {
            document.removeEventListener('keydown', callback)
          }
        },
      },
      on: {
        keydown: {
          cond: 'isSpacebar',
          actions: raise({ type: 'GO' }),
        },
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
      $trafficLightActor.value?.send('START')
    },
    stopTrafficLight: () => {
      $trafficLightActor.value?.send('STOP')
    },
  },
  guards: {
    isSpacebar: (ctx, e) => {
      console.log(e)
      return e.code === 'Space'
    },
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
  console.log('isTrafficLightGreen subscribe', value, $gameMachineActor.value)
  $gameMachineActor.value?.send(isTrafficLightGreenUpdater.update(value))
})
