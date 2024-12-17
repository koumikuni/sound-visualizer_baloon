"use client"

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

const THRESHOLD = 0.1 // 音量の閾値
const SCALE_FACTOR = 5000 // 比例定数

export default function SoundVisualizer() {
  const [radius, setRadius] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const integralRef = useRef(0)

  const resetVisualization = () => {
    integralRef.current = 0
    setRadius(0)
  }

  useEffect(() => {
    let animationFrameId: number

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)

        const updateRadius = () => {
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
            analyserRef.current.getByteFrequencyData(dataArray)
            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
            const normalizedVolume = average / 255

            if (normalizedVolume > THRESHOLD) {
              integralRef.current += normalizedVolume - THRESHOLD
              const newRadius = Math.sqrt(integralRef.current * SCALE_FACTOR / Math.PI)
              setRadius(newRadius)
            }
            // 閾値以下の場合は何もしない（現在のサイズを維持）
          }
          animationFrameId = requestAnimationFrame(updateRadius)
        }

        updateRadius()
      } catch (error) {
        console.error('マイクへのアクセスに失敗しました:', error)
      }
    }

    initAudio()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <div
        className={styles.circle}
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`
        }}
      />
      <button className={styles.resetButton} onClick={resetVisualization}>
        リセット
      </button>
    </div>
  )
}
