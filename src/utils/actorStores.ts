/* eslint-disable sort-keys/sort-keys-fix */
import {
  atom, map, action, onMount,
} from 'nanostores'
import {
  type ActorRefFrom, type Subscription, interpret,
} from 'xstate'

const defaultSiteContext = {}

export const createActorStore = (actorLogic) => {
  // TODO: Figue out types
  const $actor = atom<ActorRefFrom<typeof actorLogic> | null>(null)
  const $state = map<any>()
  const $context = map<object>(defaultSiteContext)

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


  const setContext = action(
    $context,
    'contextUpdate',
    (store, context) => {
      store.set(context)
      return store.get()
    },
  )


  onMount($context, () => {
    const unSub = $state.subscribe((state) => {
      setContext(state.context)
    })
    return () => {
      unSub()
    }
  })

  return {
    $actor,
    $state,
    $context,
  }
}


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

