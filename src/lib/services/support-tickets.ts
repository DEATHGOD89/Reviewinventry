import { logAuditEvent } from "../audit";

export interface ChatMessage {
  sender: "user" | "rep";
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  createdAt: string;
  visitorName: string;
  visitorEmail?: string;
  assignedRepName: string;
  assignedRepRole: string;
  issueCategory: string;
  productMentioned?: string;
  aiSummary: string;
  recommendedStaffAction: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "NEW" | "REVIEWED" | "RESOLVED";
  transcript: ChatMessage[];
}

// Initial realistic support tickets for immediate demo visibility
const supportTicketsStore: SupportTicket[] = [
  {
    id: "tkt-001",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    visitorName: "Rohan V. (Safety Auditor)",
    visitorEmail: "rohan.v@cleanrooms.in",
    assignedRepName: "Sarah Jenkins",
    assignedRepRole: "Senior PPE & Barrier Consultant",
    issueCategory: "SDS Verification Inquiry",
    productMentioned: "Caustic soda (VS-CHM-011)",
    aiSummary: "Auditor requested verified SDS concentration sheet for caustic soda flakes to assess bulk tank neutralizing safety. Customer was informed that manufacturer SDS is pending management upload.",
    recommendedStaffAction: "Upload verified manufacturer SDS v2026 for Caustic Soda and notify user via email.",
    priority: "HIGH",
    status: "NEW",
    transcript: [
      { sender: "rep", text: "Hello! I'm Sarah Jenkins, Senior PPE & Barrier Consultant at VeriSpec. How can I assist with your industrial specifications today?", timestamp: "10:14" },
      { sender: "user", text: "Hi Sarah, where can I download the official SDS for Caustic Soda flakes? Our plant requires it before tank intake.", timestamp: "10:15" },
      { sender: "rep", text: "I completely understand Rohan! For Caustic Soda (VS-CHM-011), all chemical hazard ratings are currently held in 'Requires manufacturer SDS/label verification' status to ensure complete accuracy. We don't fabricate safety sheets.", timestamp: "10:16" },
      { sender: "user", text: "Understood. Please notify management so they upload the lab sheet ASAP.", timestamp: "10:17" },
    ],
  },
  {
    id: "tkt-002",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    visitorName: "Ananya M. (Procurement Officer)",
    visitorEmail: "ananya@medtech-hosp.org",
    assignedRepName: "Marcus Vance",
    assignedRepRole: "Chemical & Industrial Compliance Desk",
    issueCategory: "Non-Store Order Assistance",
    productMentioned: "Nitrile gloves (VS-PPE-005)",
    aiSummary: "Procurement officer attempted to place direct purchase order for 500 boxes of nitrile gloves. Representative explained VeriSpec non-store policy and guided customer to approved external seller link.",
    recommendedStaffAction: "No system issue; verified that external purchase link to authorized distributor is active and healthy.",
    priority: "MEDIUM",
    status: "REVIEWED",
    transcript: [
      { sender: "rep", text: "Hi Ananya! Marcus Vance here with VeriSpec Industrial Support. How can I help you today?", timestamp: "07:30" },
      { sender: "user", text: "I want to place an order for 500 boxes of nitrile gloves immediately. Where is the checkout cart?", timestamp: "07:31" },
      { sender: "rep", text: "Great question Ananya! VeriSpec is an inventory intelligence and review platform, not an e-commerce store. We do not process payments. However, you can click 'Buy from external seller' on the Nitrile Gloves page to order directly from verified suppliers.", timestamp: "07:32" },
      { sender: "user", text: "Ah that makes total sense. Found the button. Thank you Marcus!", timestamp: "07:33" },
    ],
  },
];

export function getAllSupportTickets(): SupportTicket[] {
  return [...supportTicketsStore];
}

export async function createSupportTicketFromChat(data: {
  visitorName: string;
  visitorEmail?: string;
  assignedRepName: string;
  assignedRepRole: string;
  issueCategory: string;
  productMentioned?: string;
  aiSummary: string;
  recommendedStaffAction: string;
  priority?: SupportTicket["priority"];
  transcript: ChatMessage[];
}): Promise<SupportTicket> {
  const newTicket: SupportTicket = {
    id: `tkt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    visitorName: data.visitorName || "Anonymous Visitor",
    visitorEmail: data.visitorEmail || "Not Provided",
    assignedRepName: data.assignedRepName,
    assignedRepRole: data.assignedRepRole,
    issueCategory: data.issueCategory,
    productMentioned: data.productMentioned || "General Platform Inquiry",
    aiSummary: data.aiSummary,
    recommendedStaffAction: data.recommendedStaffAction,
    priority: data.priority || "MEDIUM",
    status: "NEW",
    transcript: data.transcript,
  };

  supportTicketsStore.unshift(newTicket);

  await logAuditEvent({
    userEmail: newTicket.visitorEmail,
    action: "SUPPORT_TICKET_CREATED",
    entity: "SupportTicket",
    entityId: newTicket.id,
    newValues: {
      category: newTicket.issueCategory,
      rep: newTicket.assignedRepName,
      priority: newTicket.priority,
    },
    reason: `AI Customer Care Bot filed incident ticket: ${newTicket.aiSummary.slice(0, 100)}...`,
  });

  return newTicket;
}

export async function updateTicketStatus(
  ticketId: string,
  status: "NEW" | "REVIEWED" | "RESOLVED",
  userEmail: string
): Promise<boolean> {
  const ticket = supportTicketsStore.find((t) => t.id === ticketId);
  if (!ticket) return false;

  ticket.status = status;

  await logAuditEvent({
    userEmail,
    action: "SUPPORT_TICKET_STATUS_CHANGE",
    entity: "SupportTicket",
    entityId: ticketId,
    newValues: { status },
    reason: `Ticket ${ticketId} marked as ${status} by ${userEmail}`,
  });

  return true;
}
