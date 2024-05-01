import assert from 'node:assert';
import { before, describe, it } from 'node:test';
import { SectorFlow } from '../index.js';
import { apiKey, modelId, projectId } from './config.js';
await describe('node-sectorflow', async () => {
    let sectorFlow;
    before(() => {
        sectorFlow = new SectorFlow(apiKey);
    });
    await it('Gets models', async () => {
        const models = await sectorFlow.getModels();
        console.log(models);
        assert(models.length > 0);
    });
    await it('Gets projects', async () => {
        const projects = await sectorFlow.getProjects();
        console.log(projects);
        assert(projects.length > 0);
    });
    await it('Creates a project', async () => {
        const projectResponse = await sectorFlow.createProject({
            name: `Test Project (${Date.now()})`,
            modelIds: [modelId],
            chatHistoryType: 'USER',
            contextType: 'PRIVATE',
            sharingType: 'PRIVATE'
        });
        console.log(projectResponse);
        assert(projectResponse);
    });
    await it('Send a chat message', async () => {
        const chatResponse = await sectorFlow.sendChatMessage(projectId, 'Tell me a joke.');
        console.log(JSON.stringify(chatResponse, undefined, 2));
        const chatResponse2 = await sectorFlow.sendChatMessage(projectId, 'Tell me another joke.', chatResponse.threadId);
        console.log(JSON.stringify(chatResponse2, undefined, 2));
        assert(chatResponse2);
    });
    await it('Skips sending a message when the projectId is not a UUID', async () => {
        try {
            await sectorFlow.sendChatMessage('INVALID-UUID', 'Invalid UUID');
            assert.fail();
        }
        catch {
            assert.ok('Error thrown');
        }
    });
});
