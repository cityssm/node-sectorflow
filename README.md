# SectorFlow API for Node

An unofficial wrapper around the [SectorFlow API](https://docs.sectorflowai.com/reference),
allowing you to easily connect to [over a dozen AI models](https://docs.sectorflowai.com/docs/available-models).

## What is SectorFlow?

From the SectorFlow documentation:

> SectorFlow is an AI integration platform that simplifies and enhances the way businesses use Large Language Models (LLMs) to gain actionable insights from their data. It's designed for ease of use, offering powerful AI capabilities without requiring in-depth technical knowledge.

[More about SectorFlow](https://sectorflow.ai/)

## Installation

```sh
npm install @cityssm/sectorflow
```

## Usage

**TypeScript ready and JSDocs included for easy use!**

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

console.log(firstChatResponse.choices[0].choices[0].message.content)

// => "Why don't scientists trust atoms? Because they make up everything!"

const secondChatResponse = await sectorFlow.sendChatMessage(
  project.id,
  'Tell me another joke.',
  firstChatResponse.threadId
)

console.log(secondChatResponse.choices[0].choices[0].message.content)

// => "What do dentists call their x-rays? Tooth pics!"
```
