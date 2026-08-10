import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.motoristasfinancas.app',
  appName: 'Motoristas Finanças',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
