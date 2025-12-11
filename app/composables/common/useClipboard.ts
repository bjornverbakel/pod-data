export const useClipboard = () => {
  const copied = ref(false)

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  return {
    copied,
    copy,
  }
}
