import assert from 'node:assert'
import { before, describe, it } from 'node:test'

import { SectorFlow } from '../index.js'

import { apiKey, modelId, projectId } from './config.js'

await describe('node-sectorflow', async () => {
  let sectorFlow: SectorFlow

  before(() => {
    sectorFlow = new SectorFlow(apiKey)
  })

  await it('Gets models', async () => {
    console.time('1st')
    let models = await sectorFlow.getModels()
    console.timeEnd('1st')

    console.time('from cache')
    models = await sectorFlow.getModels()
    console.timeEnd('from cache')

    console.time('refresh cache')
    models = await sectorFlow.getModels(true)
    console.timeEnd('refresh cache')

    console.log(models)
    assert(models.length > 0)
  })

  await it.skip('Gets projects', async () => {
    const projects = await sectorFlow.getProjects()

    console.log(projects)

    assert(projects.length > 0)
  })

  await it.skip('Creates a project', async () => {
    const projectResponse = await sectorFlow.createProject({
      name: `Test Project (${Date.now()})`,
      modelIds: [modelId],
      chatHistoryType: 'USER',
      contextType: 'PRIVATE',
      sharingType: 'PRIVATE'
    })

    console.log(projectResponse)

    assert(projectResponse)
  })

  await it.skip('Skips creating a project when the modelIds are not all UUIDs', async () => {
    try {
      await sectorFlow.createProject({
        name: `Invalid Project (${Date.now()})`,
        modelIds: [modelId, 'xxx'],
        chatHistoryType: 'USER',
        contextType: 'PRIVATE',
        sharingType: 'PRIVATE'
      })

      assert.fail()
    } catch {
      assert.ok('Error thrown')
    }
  })

  await it.skip('Send a chat message', async () => {
    const chatResponse = await sectorFlow.sendChatMessage(
      projectId,
      'Tell me a joke.'
    )

    console.log(JSON.stringify(chatResponse, undefined, 2))

    const chatResponse2 = await sectorFlow.sendChatMessage(
      projectId,
      'Tell me another joke.',
      chatResponse.threadId
    )

    console.log(JSON.stringify(chatResponse2, undefined, 2))

    assert(chatResponse2)
  })

  await it.skip('Skips sending a message when the projectId is not a UUID', async () => {
    try {
      await sectorFlow.sendChatMessage('INVALID-UUID', 'Invalid UUID')
      assert.fail()
    } catch {
      assert.ok('Error thrown')
    }
  })
})
