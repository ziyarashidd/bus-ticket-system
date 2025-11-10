import AdminAgencies from "./admin-agencies"

interface AgencyManagementProps {
  agencies: any[]
  onDataChange: () => void
  title?: string
}

export default function AgencyManagement({ agencies, onDataChange, title }: AgencyManagementProps) {
  return <AdminAgencies agencies={agencies} onDataChange={onDataChange} title={title} />
}
