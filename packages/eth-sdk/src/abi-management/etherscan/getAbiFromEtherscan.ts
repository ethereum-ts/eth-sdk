import got from 'got'

import { Address } from '../../config'
import { symbolToNetworkId } from '../networks'
import { EtherscanURLs, networkIDtoEndpoints } from './urls'

export async function getABIFromEtherscan(networkSymbol: string, address: Address, apiKey: string): Promise<any> {
  const etherscanUrls = getEtherscanLinkFromNetworkSymbol(networkSymbol)
  if (!etherscanUrls) {
    throw new Error(`Can't find network info for ${networkSymbol}`)
  }

  const url = `${etherscanUrls.apiURL}?module=contract&action=getabi&address=${address}&apikey=${apiKey}`
  const rawResponse = await got(url)
  // @todo error handling for incorrect api keys
  const jsonResponse = JSON.parse(rawResponse.body)

  if (jsonResponse.status !== '1') {
    throw new Error(`Can't find mainnet abi for ${address}. Msg: ${rawResponse.body}`)
  }

  const abi = JSON.parse(jsonResponse.result)

  return abi
}

function getEtherscanLinkFromNetworkSymbol(networkSymbol: string): EtherscanURLs | undefined {
  const networkId = symbolToNetworkId[networkSymbol]
  if (networkId === undefined) {
    return undefined
  }

  const etherscanUrls = networkIDtoEndpoints[networkId]

  return etherscanUrls
}
