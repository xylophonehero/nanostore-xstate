import { useStore } from '@nanostores/react'
import { $gameMachineActor, $gameMachineState } from '../actors/gameActor'

export const Game = () => {
  const gameState = useStore($gameMachineState)
  const clicks = gameState.context.clicks

  if (gameState.matches('gameOver')) {
    return (
      <div>
        <button onClick={() => $gameMachineActor.value?.send({ type: 'START' })}>Start game</button>
        <div>Game over</div>
        <div>You got {clicks} points</div>
      </div>
    )
  }

  return (
    <div>
      <div>Points: {clicks}</div>
      <button onClick={() => $gameMachineActor.value?.send({ type: 'GO' })}>Click</button>
    </div>
  )
}
