# SectorFlow API for Node

An unofficial wrapper around the [SectorFlow API](https://docs.sectorflowai.com/reference).

## Installation

```sh
npm install @cityssm/sectorflow
```

## Usage

```javascript
import { SectorFlow } from '@cityssm/sectorflow'

const sectorFlow = new SectorFlow(API_KEY)

const project = await sectorFlow.createProject({
  name: `My SectorFlow Project`,
  modelIds: [CHATGPT_MODEL_ID],
  chatHistoryType: 'TEAM',
  contextType: 'SHARED',
  sharingType: 'TEAM'
})

const firstChatResponse = await sectorFlow.sendChatMessage(
  project.id,
  'Tell me a joke.'
)

const secondChatResponse = await sectorFlow.sendChatMessage(
  project.id,
  'Tell me another joke.',
  firstChatResponse.threadId
)
```
