import type { SectorFlow } from '../index.js'

const preferredModel = 'gpt-4o-mini'

/**
 * Checks if a name is a person's name using the SectorFlow API.
 * Uses the "gpt-4o-mini" model (1 credit).
 * @param sectorFlow - The SectorFlow instance.
 * @param name - The name to check.
 * @returns `true` if the name is a person's name, `false` otherwise.
 */
export async function isPersonName(
  sectorFlow: SectorFlow,
  name: string
): Promise<boolean> {
  const model = await sectorFlow.getModelIdByKeywords(preferredModel)

  if (model === undefined) {
    throw new Error(`Model "${preferredModel}" not found`)
  }

  const workspace = await sectorFlow.createWorkspace({
    modelIds: [model],
    name: `Is "${name}" a person's name?`,

    chatHistoryType: 'USER',
    contextType: 'PRIVATE',
    sharingType: 'PRIVATE'
  })

  const response = await sectorFlow.sendChatMessage(
    workspace.id,
    `Is "${name}" a person's name? Respond with either "true" or "false".`
  )

  await sectorFlow.deleteWorkspace(workspace.id)

  return (
    response.choices[0].choices[0].message.content.trim().toLowerCase() ===
    'true'
  )
}
