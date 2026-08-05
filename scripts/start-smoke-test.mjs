import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const backendRoot = path.join(root, 'packages', 'backend')
const tsNodeBin = path.join(root, 'node_modules', 'ts-node', 'dist', 'bin.js')
const child = spawn(process.execPath, [tsNodeBin, 'src/index.ts'], {
  cwd: backendRoot,
  env: {
    ...process.env,
    DATABASE_URL: ':memory:',
    PORT: '3001',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let output = ''
child.stdout.on('data', (chunk) => { output += chunk })
child.stderr.on('data', (chunk) => { output += chunk })

async function waitForHealth(timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Backend development server exited early (${child.exitCode}).\n${output}`)
    }
    try {
      const response = await fetch('http://127.0.0.1:3001/health', {
        signal: AbortSignal.timeout(1_000),
      })
      if (response.ok) return response
    } catch {
      // The backend may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Timed out waiting for the backend.\n${output}`)
}

try {
  const health = await waitForHealth()
  assert.deepEqual(await health.json(), { status: 'ok' })

  const frontendConfig = await readFile(
    path.join(root, 'packages', 'frontend', 'src', 'config', 'api.ts'),
    'utf8',
  )
  assert.match(frontendConfig, /http:\/\/localhost:3001/)
  console.log('Development start smoke test: OK')
} finally {
  child.kill('SIGTERM')
}
