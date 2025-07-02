import { useState } from 'react'
import reactLogo from 'src/assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useUser } from './hooks/useUser.ts'
import { Flex } from 'src/theme/Flex.tsx'
import { Box } from 'src/theme/Box.tsx'

function App() {
  const [count, setCount] = useState(0)
  const { data, isLoading, error } = useUser()
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {(error as Error).message}</p>
  return (
    <>
      <Flex bg="primary" py={2} justifyContent="center" flexDirection="row">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </Flex>
      <h1>Vite + React</h1>
      <Box py={4}>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </Box>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
