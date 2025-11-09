import AdminTickets from "./admin-tickets"

interface TicketManagementProps {
  tickets: any[]
}

export default function TicketManagement({ tickets }: TicketManagementProps) {
  return <AdminTickets tickets={tickets} />
}
