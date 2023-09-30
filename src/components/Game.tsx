import { useStore } from '@nanostores/react'
import { $gameMachineActor, $gameMachineState } from '../actors/gameActor'
import { useEffect, useRef } from 'react'

export const Game = () => {
  const gameState = useStore($gameMachineState)
  const { clicks } = gameState.context

  const clickButtonRef = useRef<HTMLButtonElement>(null)

  // TODO: Make into a custom hook which auto subscribes and unsubscribes
  // NOTE: Subscribe to events happing in the machine
  useEffect(() => {
    const unsub = $gameMachineState.subscribe((state) => {
      if (state.event.type === 'START') {
        setTimeout(() => {
          clickButtonRef.current?.focus()
        })
      }
    })

    return () => {
      unsub()
    }
  }, [])

  if (gameState.matches('idle')) {
    return (
      <div className="prose text-center m-auto">
        <h1>Welcome to the game</h1>
        <p>Press space bar when the light is green</p>
        <p>If you press when the light is not green, you will lose</p>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => $gameMachineActor.value?.send({ type: 'START' })}>Start game</button>
        </div>
      </div>
    )
  }

  if (gameState.matches('gameOver')) {
    return (
      <div className="prose text-center m-auto">
        <h1>Game over</h1>
        <p>You got {clicks} points</p>
        <button
          className="btn btn-primary"
          onClick={() => $gameMachineActor.value?.send({ type: 'START' })}>Start game</button>
      </div>
    )
  }

  return (
    <div className="prose text-center m-auto">
      <p>Points: {clicks}</p>
      <button
        ref={clickButtonRef}
        className="btn btn-primary"
        onClick={() => $gameMachineActor.value?.send({ type: 'GO' })}>Click</button>
    </div>
  )
}
