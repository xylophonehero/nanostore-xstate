import { useStore } from '@nanostores/react'
import { $gameMachineActor, $gameMachineState } from '../actors/gameActor'

export const Game = () => {
  const gameState = useStore($gameMachineState)
  const clicks = gameState.context.clicks

  console.log(gameState.context)

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
        className="btn btn-primary"
        onClick={() => $gameMachineActor.value?.send({ type: 'GO' })}>Click</button>
    </div>
  )
}
