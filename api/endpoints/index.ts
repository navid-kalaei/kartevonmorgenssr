import { BASICS_ENDPOINTS } from './BasicsEndpoints'
import { OFDB_ENDPOINTS } from './OFDBEndpoints'
import { SlugEntity } from '../../utils/types'


export const mapEntityToOFDB = {
  [SlugEntity.ENTRY]: OFDB_ENDPOINTS.getOFDBEntry,
  [SlugEntity.EVENT]: OFDB_ENDPOINTS.getOFDBEvent,
}

export const API_ENDPOINTS = {
  ...BASICS_ENDPOINTS,
  ...OFDB_ENDPOINTS,
}

export default API_ENDPOINTS