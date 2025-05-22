# SectorFlow API for Node

[![DeepSource](https://app.deepsource.com/gh/cityssm/node-sectorflow.svg/?label=active+issues&show_trend=true&token=JNfvxWju1bt6LN1oizyHvJ2Q)](https://app.deepsource.com/gh/cityssm/node-sectorflow/)
[![Maintainability](https://api.codeclimate.com/v1/badges/879123fd71a505a3484c/maintainability)](https://codeclimate.com/github/cityssm/node-sectorflow/maintainability)

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

/*
 * Get the model id for ChatGPT
 */

const chatGPT = await sectorFlow.getModelIdByKeywords('ChatGPT')

/*
 * Create a workspace
 */

const workspace = await sectorFlow.createWorkspace({
  name: `My SectorFlow Workspace`,
  modelIds: [chatGPT],
  chatHistoryType: 'TEAM',
  contextType: 'SHARED',
  sharingType: 'TEAM'
})

/*
 * Chat
 */

const firstChatResponse = await sectorFlow.sendChatMessage(
  workspace.id,
  'Tell me a joke.'
)

console.log(firstChatResponse.choices[0].choices[0].message.content)
// => "Why don't scientists trust atoms? Because they make up everything!"

const secondChatResponse = await sectorFlow.sendChatMessage(
  workspace.id,
  'Tell me another joke.',
  {
    threadId: firstChatResponse.threadId
  }
)

console.log(secondChatResponse.choices[0].choices[0].message.content)
// => "What do dentists call their x-rays? Tooth pics!"
```

🧙‍♂️ This package also offers "wizards" to handle some of the heavy lifting
associated with raw API calls.

```javascript
import { SectorFlow, wizards } from '@cityssm/sectorflow'

const sectorFlow = new SectorFlow(API_KEY)

const wizardPersonResponse = await wizards.isPersonName(
  sectorFlow,
  'JAKE RAJNOVICH'
)

console.log(wizardPersonResponse)
// => true

const wizardOtherResponse = await wizards.isPersonName(
  sectorFlow,
  'BILL JONES AND SONS TRUCKING'
)

console.log(wizardOtherResponse)
// => false
```
