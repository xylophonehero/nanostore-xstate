/* eslint-disable sort-keys/sort-keys-fix */
import {
  atom, map, action, onMount,
} from 'nanostores'
import {
  type Subscription, interpret, type InterpreterFrom, type AnyStateMachine, type StateFrom,
} from 'xstate'

const defaultSiteContext = {}

export const createActorStore = <TMachine extends AnyStateMachine>(actorLogic: TMachine) => {
  const $actor = atom<InterpreterFrom<TMachine> | null>(null)
  const $state = map<StateFrom<TMachine>>()
  const $context = map<TMachine['context']>(defaultSiteContext)

  onMount($actor, () => {
    const actor = interpret(actorLogic) as InterpreterFrom<TMachine>
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
        $state.set(actor.getSnapshot() as StateFrom<TMachine>)
        sub = actor.subscribe((snapshot) => {
          $state.set(snapshot as StateFrom<TMachine>)
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
