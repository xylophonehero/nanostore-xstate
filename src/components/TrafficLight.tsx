import { useStore } from '@nanostores/react'
import { $trafficLightState, $trafficLightActor } from '../actors/trafficLightActor'

export const TrafficLight = () => {
  const state = useStore($trafficLightState)

  return (
    <div className="flex flex-col items-center mt-8">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => $trafficLightActor.value.send('TOGGLE')}
      >
        Start game
      </button>
      <div className="flex mt-4">
        <div
          style={{
            backgroundColor: state.matches('on.red')
              ? '#e74c3c'
              : '#bdc3c7',
            borderRadius: '50%',
            height: '48px',
            width: '48px',
          }}
          data-state={state.matches('on.red')
            ? 'active'
            : 'inactive'}
        />
        <div
          style={{
            backgroundColor: state.matches('on.yellow')
              ? '#f39c12'
              : '#bdc3c7',
            borderRadius: '50%',
            height: '48px',
            marginLeft: '8px',
            width: '48px',
          }}
          data-state={state.matches('on.yellow')
            ? 'active'
            : 'inactive'}
        />
        <div
          style={{
            backgroundColor: state.matches('on.green')
              ? '#2ecc71'
              : '#bdc3c7',
            borderRadius: '50%',
            height: '48px',
            marginLeft: '8px',
            width: '48px',
          }}
          data-state={state.matches('on.green')
            ? 'active'
            : 'inactive'}
        />
      </div>
    </div>
  )
}
