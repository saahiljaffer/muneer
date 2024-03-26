import { SchemaTypeDefinition } from 'sanity'

import announcement from './announcement'
import blockContent from './blockContent'
import event from './event'

export const schemaTypes = [event, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [event, blockContent, announcement],
}
