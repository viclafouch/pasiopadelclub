import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'

export const ProfileTab = () => {
  const currentUserQuery = useSuspenseQuery(
    convexQuery(api.users.getCurrent, {})
  )

  if (!currentUserQuery.data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
      </div>
    )
  }

  const user = currentUserQuery.data

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold">Informations personnelles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Téléphone</p>
            <p className="font-medium">{user.phone ?? 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prénom</p>
            <p className="font-medium">{user.firstName ?? 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="font-medium">{user.lastName ?? 'Non renseigné'}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        La modification du profil et la suppression de compte seront disponibles
        prochainement.
      </p>
    </div>
  )
}
