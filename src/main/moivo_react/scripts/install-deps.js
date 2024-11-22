import os from 'os';
import { execSync } from 'child_process';

const platform = os.platform(); // 현재 플랫폼 확인
const arch = os.arch(); // 현재 아키텍처 확인

try {
  if (platform === 'darwin' && arch === 'arm64') {
    console.log('Installing dependencies for macOS ARM64...');
    execSync('npm install @esbuild/darwin-arm64 @rollup/rollup-darwin-arm64', { stdio: 'inherit' });
  } else if (platform === 'win32' && arch === 'x64') {
    console.log('Installing dependencies for Windows x64...');
    execSync('npm install @esbuild/win32-x64', { stdio: 'inherit' });
  } else {
    console.warn('No specific dependencies for your platform. Skipping...');
  }
} catch (error) {
  console.error('Error while installing platform-specific dependencies:', error);
  process.exit(1);
}
