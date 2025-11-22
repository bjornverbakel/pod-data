export const useChecklist = <T extends { id: any }>(
  fetcher: () => Promise<any>,
  toggler: (id: any, completed: boolean) => Promise<any>,
  userRelationKey: string
) => {
  const user = useSupabaseUser()
  const items = ref<T[]>([])
  const loading = ref(true)
  const error = ref('')

  const fetchItems = async () => {
    error.value = ''
    const { data, error: fetchError } = await fetcher()

    if (fetchError) {
      error.value = fetchError.message
    } else if (data) {
      items.value = data
    }
    loading.value = false
  }

  const isCompleted = (item: any) => {
    const relation = item[userRelationKey]
    if (!relation || relation.length === 0) {
      return false
    }
    return relation[0]?.completed || false
  }

  const handleToggle = async (item: any, completed: boolean) => {
    if (!user.value) {
      return navigateTo({
        path: '/login',
        query: { redirect: useRoute().fullPath }
      })
    }

    // Optimistic update
    const index = items.value.findIndex((e: any) => e.id === item.id)
    if (index !== -1) {
      const currentItem = items.value[index] as any
      if (!currentItem[userRelationKey] || currentItem[userRelationKey].length === 0) {
        currentItem[userRelationKey] = [{ completed, completed_at: null }]
      } else {
        currentItem[userRelationKey][0].completed = completed
        currentItem[userRelationKey][0].completed_at = completed
          ? new Date().toISOString()
          : null
      }
    }

    // Actual database update
    const { error: toggleError } = await toggler(item.id, completed)

    if (toggleError) {
      error.value = `Error updating item: ${toggleError.message}`
      await fetchItems()
    }
  }

  onMounted(fetchItems)
  watch(user, fetchItems)

  return {
    items,
    loading,
    error,
    isCompleted,
    handleToggle
  }
}
