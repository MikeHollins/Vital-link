import { createConfig, http } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Polygon network configuration for real NFT minting
export const web3Config = createConfig({
  chains: [polygon, polygonMumbai], // Mainnet and testnet
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'
    })
  ],
  transports: {
    [polygon.id]: http('https://polygon-rpc.com'),
    [polygonMumbai.id]: http('https://rpc-mumbai.maticvigil.com')
  }
})

// NFT Contract configuration
export const NFT_CONTRACT_CONFIG = {
  // For testnet (Mumbai)
  testnet: {
    address: '0x...', // We'll deploy our contract here
    chainId: polygonMumbai.id,
    name: 'VitalLink Health Achievements'
  },
  // For mainnet (Polygon)
  mainnet: {
    address: '0x...', // Production contract address
    chainId: polygon.id,
    name: 'VitalLink Health Achievements'
  }
}

// Smart contract ABI for NFT minting
export const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintAchievement",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

// Helper function to get the correct contract based on environment
export function getContractConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  return isDevelopment ? NFT_CONTRACT_CONFIG.testnet : NFT_CONTRACT_CONFIG.mainnet
}

// Health Data metadata template for IPFS
export interface HealthDataMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
}

export function createHealthDataMetadata(healthData: {
  title: string
  description: string
  category: string
  rarity: string
  thresholdMetric: string
  thresholdValue: number
}): HealthDataMetadata {
  return {
    name: healthData.title,
    description: healthData.description,
    image: `https://vitallink.app/health-data-images/${healthData.category.toLowerCase()}-${healthData.rarity.toLowerCase()}.png`,
    attributes: [
      {
        trait_type: 'Category',
        value: healthData.category
      },
      {
        trait_type: 'Rarity',
        value: healthData.rarity
      },
      {
        trait_type: 'Metric Type',
        value: healthData.thresholdMetric
      },
      {
        trait_type: 'Data Level',
        value: healthData.thresholdValue
      },
      {
        trait_type: 'Platform',
        value: 'VitalLink'
      }
    ],
    external_url: 'https://vitallink.app'
  }
}