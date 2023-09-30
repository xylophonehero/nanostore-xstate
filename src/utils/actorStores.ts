/* eslint-disable sort-keys/sort-keys-fix */
import {
  atom, map, action, onMount, listenKeys, computed,
} from 'nanostores'
import {
  type ActorRefFrom, type Subscription, assign, createMachine, interpret,
} from 'xstate'
const defaultSiteContext = {}

export const createActorStore = (actorLogic) => {
  const $actor = atom<ActorRefFrom<typeof actorLogic> | null>(null)
  const $state = map<any>()

  const createSiteActor = () => interpret(actorLogic)

  onMount($actor, () => {
    const actor = createSiteActor()
    $actor.set(actor)
    actor.start()
    return () => {
      actor.stop()
      $actor.set(null)
    }
  })

  onMount($state, () => {
    let sub: Subscription | null = null
    const actorSub = $actor.subscribe((actor) => {
      if (actor) {
        // TODO: figure out undefined
        $state.set(actor.getSnapshot())
        sub = actor.subscribe((snapshot) => {
          $state.set(snapshot)
        })
      } else {
        console.warn('🔥 ~ file: site.store.ts:43 ~ actor not active')
      }
    })
    return () => {
      sub?.unsubscribe()
      actorSub()
    }
  })

  return {
    $actor,
    $state,
  }
}

export const $siteActor = atom<ActorRefFrom<TrafficLightMachine> | null>(null)
export const $siteState = map<TrafficMachineState>()
export const $siteContext = map<TrafficLightMachineContext>(defaultSiteContext)

export const setSiteContext = action(
  $siteContext,
  'contextUpdate',
  (store, context) => {
    store.set(context)
    return store.get()
  },
)

const trafficLightMachine = createMachine({
  context: {} as object,
  id: 'trafficLight',
  initial: 'off',
  states: {
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
    on: {
      initial: 'red',
      on: {
        TIMER: 'on',
        TOGGLE: 'off',
      },
      states: {
        green: {
          after: {
            3000: 'red',
          },
        },
        red: {
          after: {
            3000: 'yellow',
          },
        },
        yellow: {
          after: {
            3000: 'green',
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

const gameMachine = createMachine({
  context: {
    clicks: 0,
  },
  initial: 'playing',
  states: {
    playing: {
      on: {
        // TODO: Only can go if traffict light is green
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

    },
  },
}, {
  actions: {
    incrementClicks: assign({
      clicks: (context) => context.clicks + 1,
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

export type TrafficLightMachine = typeof trafficLightMachine
export type TrafficLightMachineActorRef = ActorRefFrom<TrafficLightMachine>
export type TrafficMachineState = Exclude<ReturnType<TrafficLightMachineActorRef['getSnapshot']>, undefined>
export type TrafficLightMachineContext = TrafficLightMachine['context']

const createSiteActor = () => interpret(trafficLightMachine)

onMount($siteActor, () => {
  const actor = createSiteActor()
  $siteActor.set(actor)
  actor.start()
  return () => {
    actor.stop()
    $siteActor.set(null)
  }
})

onMount($siteState, () => {
  let sub: Subscription | null = null
  const actorSub = $siteActor.subscribe((actor) => {
    if (actor) {
      // TODO: figure out undefined
      $siteState.set(actor.getSnapshot())
      sub = actor.subscribe((snapshot) => {
        $siteState.set(snapshot)
      })
    } else {
      console.warn('🔥 ~ file: site.store.ts:43 ~ actor not active')
    }
  })
  return () => {
    sub?.unsubscribe()
    actorSub()
  }
})

onMount($siteContext, () => {
  const unSub = $siteState.subscribe((state) => {
    setSiteContext(state.context)
  })
  return () => {
    unSub()
  }
})

// $trafficLightState.subscribe((state) => {
//   console.log('machine subscribe is on', state.matches('on'))
// })
//
// export const isOnStore = computed($trafficLightState, (state) => state.matches('on'))
//
// isOnStore.subscribe((value) => {
//   console.log('computed machine subscribe', value)
// })

// $siteState.listen((state, changed) => {
//   console.log('machine listen is on', changed, state.matches('on'))
// })
//
// listenKeys($siteContext, [''])

