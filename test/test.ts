import assert from 'node:assert'
import { before, describe, it } from 'node:test'

import { SectorFlow } from '../index.js'

import { apiKey, collectionName, fileName, projectId } from './config.js'

await describe('node-sectorflow', async () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let sectorFlow: SectorFlow

  before(() => {
    sectorFlow = new SectorFlow(apiKey)
  })

  await it.skip('Gets models', async () => {
    console.time('1st')
    await sectorFlow.getModels()
    console.timeEnd('1st')

    console.time('from cache')
    await sectorFlow.getModels()
    console.timeEnd('from cache')

    console.time('refresh cache')
    const models = await sectorFlow.getModels(true)
    console.timeEnd('refresh cache')

    console.log(models)
    assert(models.length > 0)
  })

  await it.skip('Gets the "ChatGPT" model id', async () => {
    const modelId = await sectorFlow.getModelIdByKeywords('chat gpt')
    console.log(modelId)
    assert(modelId)
  })

  await it.skip('Manages projects', async () => {
    const initialProjects = await sectorFlow.getProjects()

    const modelId = await sectorFlow.getModelIdByKeywords('amazon titan')

    assert(modelId)

    const newProjectResponse = await sectorFlow.createProject({
      name: `Test Project (${Date.now()})`,
      modelIds: [modelId],
      chatHistoryType: 'USER',
      contextType: 'PRIVATE',
      sharingType: 'PRIVATE'
    })

    assert(newProjectResponse)

    const projectsAfterCreate = await sectorFlow.getProjects()

    assert.strictEqual(projectsAfterCreate.length, initialProjects.length + 1)

    const deleteProjectSuccess = await sectorFlow.deleteProject(
      newProjectResponse.id
    )

    assert(deleteProjectSuccess)

    const projectsAfterDelete = await sectorFlow.getProjects()

    assert.strictEqual(initialProjects.length, projectsAfterDelete.length)
  })

  await it.skip('Skips creating a project when the modelIds are not all UUIDs', async () => {
    try {
      await sectorFlow.createProject({
        name: `Invalid Project (${Date.now()})`,
        modelIds: ['xxx'],
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
      {
        threadId: chatResponse.threadId
      }
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

  await it.skip('Uploads a file', async () => {
    const results = await sectorFlow.uploadFile(projectId, './LICENSE.md')

    console.log(results)
  })

  await it.skip('Sends a chat message with a file attached', async () => {
    const chatResponse = await sectorFlow.sendChatMessage(
      projectId,
      'What is this file about?',
      {
        collectionName,
        fileName
      }
    )

    console.log(JSON.stringify(chatResponse, undefined, 2))

    assert(chatResponse)
  })

  await it('Sends a chat message with a JSON response', async () => {
    // Name, no comma

    let chatResponse = await sectorFlow.sendChatMessage(
      projectId,
      'Is "JOHN DOE" a person\'s name? Respond with either `true` or `false`.'
    )

    console.log(JSON.stringify(chatResponse, undefined, 2))

    assert.strictEqual(chatResponse.choices[0].choices[0].message.content, 'true')

    // Name with comma

    chatResponse = await sectorFlow.sendChatMessage(
      projectId,
      'Is "SMITH, BONNIE" a person\'s name? Respond with either `true` or `false`.',
      {
        threadId: chatResponse.threadId
      }
    )

    console.log(JSON.stringify(chatResponse, undefined, 2))

    assert.strictEqual(chatResponse.choices[0].choices[0].message.content, 'true')

    // Company name

    chatResponse = await sectorFlow.sendChatMessage(
      projectId,
      'Is "JIM HARVEY AND SONS" a person\'s name? Respond with either `true` or `false`.',
      {
        threadId: chatResponse.threadId
      }
    )

    console.log(JSON.stringify(chatResponse, undefined, 2))

    assert.strictEqual(chatResponse.choices[0].choices[0].message.content, 'false')
  })
})
