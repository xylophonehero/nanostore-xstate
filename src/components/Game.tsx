import { useStore } from '@nanostores/react'
import { $gameMachineActor, $gameMachineState } from '../actors/gameActor'

export const Game = () => {
  const gameState = useStore($gameMachineState)
  const clicks = gameState.context.clicks

  console.log(gameState.context)

  if (gameState.matches('idle')) {
    return (
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => $gameMachineActor.value?.send({ type: 'START' })}>Start game</button>


      </div>
    )
  }

  if (gameState.matches('gameOver')) {
    return (
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => $gameMachineActor.value?.send({ type: 'START' })}>Start game</button>
        <div>Game over</div>
        <div>You got {clicks} points</div>
      </div>
    )
  }

  return (
    <div>
      <div>Points: {clicks}</div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => $gameMachineActor.value?.send({ type: 'GO' })}>Click</button>
    </div>
  )
}
