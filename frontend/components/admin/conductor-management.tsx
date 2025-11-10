import AdminConductors from "./admin-conductors"

interface ConductorManagementProps {
  conductors: any[]
  agencies: any[]
}

export default function ConductorManagement({ conductors, agencies }: ConductorManagementProps) {
  return <AdminConductors conductors={conductors} agencies={agencies} />
}
