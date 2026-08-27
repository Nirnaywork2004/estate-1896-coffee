import { formatINR } from './currency';
import { getWhatsAppPhone } from './phone';

export interface WhatsAppCartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  selectedOptions?: { name: string; [key: string]: any }[];
  itemTotal: number;
}

export interface WhatsAppOrderPayload {
  storePhone: string;
  customerName: string;
  orderType: string;
  items: WhatsAppCartItem[];
  subtotal: number;
  total: number;
  deliveryAddressSummary?: string;
  specialNotes?: string;
}

/**
 * Builds a clean, formatted WhatsApp ordering message URL
 */
export function generateWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const phone = getWhatsAppPhone(payload.storePhone);

  const lines: string[] = [
    `*NEW ORDER — ESTATE 1896 COFFEE*`,
    `--------------------------------`,
    `*Customer:* ${payload.customerName}`,
    `*Order Type:* ${payload.orderType.toUpperCase()}`,
    ``,
    `*Items Ordered:*`,
  ];

  payload.items.forEach((item, index) => {
    const optionsText = item.selectedOptions && item.selectedOptions.length > 0
      ? ` (${item.selectedOptions.map((o) => o.name).join(', ')})`
      : '';
    lines.push(`${index + 1}. ${item.productName}${optionsText} x${item.quantity} — ${formatINR(item.itemTotal)}`);
  });

  lines.push(``);
  lines.push(`*Subtotal:* ${formatINR(payload.subtotal)}`);
  lines.push(`*Total Amount:* ${formatINR(payload.total)}`);

  if (payload.deliveryAddressSummary) {
    lines.push(``);
    lines.push(`*Delivery Address:* ${payload.deliveryAddressSummary}`);
  }

  if (payload.specialNotes) {
    lines.push(``);
    lines.push(`*Notes:* ${payload.specialNotes}`);
  }

  lines.push(``);
  lines.push(`_Sent via Estate 1896 Web Ordering System_`);

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
