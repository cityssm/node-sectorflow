import assert from 'node:assert';
import { before, describe, it } from 'node:test';
import { SectorFlow, wizards } from '../index.js';
import { apiKey, collectionName, fileName, workspaceId } from './config.js';
await describe('node-sectorflow', async () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let sectorFlow;
    before(() => {
        sectorFlow = new SectorFlow(apiKey);
    });
    await it('Gets models', async () => {
        console.time('1st');
        await sectorFlow.getModels();
        console.timeEnd('1st');
        console.time('from cache');
        await sectorFlow.getModels();
        console.timeEnd('from cache');
        console.time('refresh cache');
        const models = await sectorFlow.getModels(true);
        console.timeEnd('refresh cache');
        console.log(models);
        assert.ok(models.length > 0);
    });
    await it('Gets the "ChatGPT" model id', async () => {
        const modelId = await sectorFlow.getModelIdByKeywords('chat gpt');
        console.log(modelId);
        assert.ok(modelId);
    });
    await it.skip('Manages workspaces', async () => {
        const initialWorkspaces = await sectorFlow.getWorkspaces();
        const modelId = await sectorFlow.getModelIdByKeywords('openai gpt');
        assert.notStrictEqual(modelId, undefined);
        const newWorkspaceResponse = await sectorFlow.createWorkspace({
            name: `Test Workspace (${Date.now()})`,
            modelIds: [modelId],
            chatHistoryType: 'USER',
            contextType: 'PRIVATE',
            sharingType: 'PRIVATE'
        });
        assert.ok(newWorkspaceResponse);
        const workspacesAfterCreation = await sectorFlow.getWorkspaces();
        assert.strictEqual(workspacesAfterCreation.length, initialWorkspaces.length + 1);
        const deleteWorkspaceSuccess = await sectorFlow.deleteWorkspace(newWorkspaceResponse.id);
        assert.ok(deleteWorkspaceSuccess);
        const workspacesAfterDeletion = await sectorFlow.getWorkspaces();
        assert.strictEqual(initialWorkspaces.length, workspacesAfterDeletion.length);
    });
    await it.skip('Skips creating a workspace when the modelIds are not all UUIDs', async () => {
        try {
            await sectorFlow.createWorkspace({
                name: `Invalid Workspace (${Date.now()})`,
                modelIds: ['xxx'],
                chatHistoryType: 'USER',
                contextType: 'PRIVATE',
                sharingType: 'PRIVATE'
            });
            assert.fail();
        }
        catch {
            assert.ok('Error thrown');
        }
    });
    await it.skip('Send a chat message', async () => {
        const chatResponse = await sectorFlow.sendChatMessage(workspaceId, 'Tell me a joke.');
        console.log(JSON.stringify(chatResponse, undefined, 2));
        const chatResponse2 = await sectorFlow.sendChatMessage(workspaceId, 'Tell me another joke.', {
            threadId: chatResponse.threadId
        });
        console.log(JSON.stringify(chatResponse2, undefined, 2));
        assert.ok(chatResponse2);
    });
    await it.skip('Skips sending a message when the workspaceId is not a UUID', async () => {
        try {
            await sectorFlow.sendChatMessage('INVALID-UUID', 'Invalid UUID');
            assert.fail();
        }
        catch {
            assert.ok('Error thrown');
        }
    });
    await it.skip('Uploads a file', async () => {
        const results = await sectorFlow.uploadFile(workspaceId, './LICENSE.md');
        console.log(results);
    });
    await it.skip('Sends a chat message with a file attached', async () => {
        const chatResponse = await sectorFlow.sendChatMessage(workspaceId, 'What is this file about?', {
            collectionName,
            fileName
        });
        console.log(JSON.stringify(chatResponse, undefined, 2));
        assert.ok(chatResponse);
    });
    await it('Uses the `isPersonName()` wizard', async () => {
        // Name without a comma
        let isPersonResponse = await wizards.isPersonName(sectorFlow, 'JAKE RAJNOVICH');
        assert.strictEqual(isPersonResponse, true);
        // Name with comma
        isPersonResponse = await wizards.isPersonName(sectorFlow, 'BESSERER, TIM');
        assert.strictEqual(isPersonResponse, true);
        // Company name
        isPersonResponse = await wizards.isPersonName(sectorFlow, 'BILL JONES AND SONS TRUCKING');
        assert.strictEqual(isPersonResponse, false);
    });
});
