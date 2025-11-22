import type { Database } from '~/types/database.types'

export const useTrackable = (
  tableName: keyof Database['public']['Tables'],
  userTableName: keyof Database['public']['Tables'],
  foreignKey: string
) => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // Get all items with user completion status
  const getAllWithStatus = async () => {
    const userId = user.value?.id || user.value?.sub
    if (!userId) {
      // Not logged in - just return items without status
      const { data, error } = await client
        .from(tableName)
        .select('*')
        .order('sort_order')

      return { data, error }
    }

    // Logged in - join with user table
    // We use any cast here because the dynamic string builder for the join
    // makes TypeScript lose the specific type inference, but the runtime behavior is correct.
    const { data, error } = await client
      .from(tableName)
      .select(`
        *,
        ${userTableName}!left(completed, completed_at)
      `)
      .eq(`${userTableName}.user_id`, userId)
      .order('sort_order')

    return { data, error }
  }

  // Toggle item completion
  const toggle = async (itemId: string, completed: boolean) => {
    const userId = user.value?.id || user.value?.sub
    if (!userId) return { error: { message: 'Not authenticated' } }

    // Check if record exists
    const { data: existing } = await client
      .from(userTableName)
      .select('id')
      .eq('user_id', userId)
      .eq(foreignKey, itemId)
      .maybeSingle()

    if (existing) {
      // Update existing record
      const { error } = await client
        .from(userTableName)
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        } as any) // Cast to any because the table is dynamic
        .eq('user_id', userId)
        .eq(foreignKey, itemId)

      return { error }
    } else {
      // Insert new record
      const { error } = await client.from(userTableName).insert({
        user_id: userId,
        [foreignKey]: itemId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      } as any)

      return { error }
    }
  }

  return {
    getAllWithStatus,
    toggle,
  }
}
