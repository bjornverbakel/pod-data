import type { Database } from '~/types/database.types'

type Weapon = Database['public']['Tables']['weapons']['Row']
type UserWeapon = Database['public']['Tables']['user_weapons']['Row']

export const useWeapons = () => {
  const { getAllWithStatus, toggle } = useTrackable('weapons', 'user_weapons', 'weapon_id')

  return {
    getAllWeaponsWithStatus: getAllWithStatus,
    toggleWeapon: toggle,
  }
}
