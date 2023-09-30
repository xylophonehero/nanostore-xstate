import { useStore } from '@nanostores/react'
import { $trafficLightState } from '../actors/trafficLightActor'
import { cva } from 'class-variance-authority'

const light = cva([
  'h-12 w-12 rounded-full'
], {
  variants: {
    type: {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
    },
    isOn: {
      true: 'bg-opacity-100',
      false: 'bg-opacity-40',
    }
  }
})

export const TrafficLight = () => {
  const state = useStore($trafficLightState)

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col bg-base-300 p-2 space-y-2 rounded-lg">
        <div className={light({ type: "red", isOn: state.matches('on.red') })} />
        <div className={light({ type: "yellow", isOn: state.matches('on.yellow') })} />
        <div className={light({ type: "green", isOn: state.matches('on.green') })} />
      </div>
    </div>
  )
}
