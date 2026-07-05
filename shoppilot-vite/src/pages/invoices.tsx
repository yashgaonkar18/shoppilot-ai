import { ScrollText, Printer, X, MessageCircle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";
import {
  getInvoices,
} from "@/api/invoice";
import { getWhatsAppLink } from "@/api/whatsapp";
import { useAuth } from "@/hooks/use-auth";
import { fmtINR } from "@/lib/format";
import { toast } from "sonner";

function LoadingInvoices() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft divide-y divide-border animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4"
        >
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-muted"></div>
            <div className="h-3 w-28 rounded bg-muted"></div>
          </div>

          <div className="h-5 w-20 rounded bg-muted"></div>
        </div>
      ))}
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await getInvoices();

      setInvoices(res.data.invoices);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [active, setActive] = useState<Invoice | null>(null);

  return (
    <AppShell title="Invoices" subtitle={`${invoices.length} generated`}>
      <div className="space-y-3">
        {loading ? (
          <LoadingInvoices />
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <ScrollText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <p className="mt-3 text-sm text-muted-foreground">
              No invoices yet. Complete a sale to generate one.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-soft divide-y divide-border">
            {invoices.map((inv) => (
              <button
                key={inv._id}
                onClick={() => setActive(inv)}
                className="w-full p-4 flex items-center justify-between gap-3 hover:bg-muted/30 text-left"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold">
                    {inv.invoice_number}
                  </div>

                  <div className="text-xs text-muted-foreground truncate">
                    {inv.sale?.customer_name || "Walk-in"} •{" "}
                    {new Date(inv.created_at).toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="text-sm font-semibold">
                  {fmtINR(inv.total)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && <InvoicePreview invoice={active} onClose={() => setActive(null)} />}
    </AppShell>
  );
}

function InvoicePreview({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const { user } = useAuth();
  const shopName = user?.shop_name || "My Shop";
  const items = invoice.sale?.sale_items ?? [];
  const hasPhone = !!invoice.sale?.customer_phone;
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const handleSendWhatsApp = async () => {
    try {
      setSendingWhatsApp(true);
      const res = await getWhatsAppLink(invoice._id);

      if (res.data.success) {
        // Opens WhatsApp Web/App with the invoice message pre-filled
        window.open(res.data.whatsappUrl, "_blank");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Could not generate WhatsApp link";
      if (err.response?.data?.noPhone) {
        toast.error("No phone number recorded for this customer");
      } else if (err.response?.data?.featureLocked) {
        toast.error("WhatsApp invoices need Growth plan or higher. Upgrade to unlock.");
      } else {
        toast.error(message);
      }
    } finally {
      setSendingWhatsApp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm print:hidden" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-glow overflow-hidden print:rounded-none print:shadow-none print:border-0">
        <div className="flex items-center justify-between p-4 border-b border-border print:hidden">
          <h2 className="font-semibold text-sm">{invoice.invoice_number}</h2>
          <div className="flex gap-1">
            <button
              onClick={handleSendWhatsApp}
              disabled={!hasPhone || sendingWhatsApp}
              title={!hasPhone ? "No phone number recorded for this customer" : "Send invoice via WhatsApp"}
              className="h-8 px-3 rounded-md border border-border text-xs font-medium hover:bg-accent inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {sendingWhatsApp ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <MessageCircle className="h-3.5 w-3.5 text-success" />
              )}
              WhatsApp
            </button>
            <button onClick={() => window.print()} className="h-8 px-3 rounded-md border border-border text-xs font-medium hover:bg-accent inline-flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-bold">{shopName}</div>
              <div className="text-xs text-muted-foreground">Tax Invoice</div>
            </div>
            <div className="text-right text-xs">
              <div className="font-semibold">{invoice.invoice_number}</div>
              <div className="text-muted-foreground">{new Date(invoice.created_at).toLocaleDateString("en-IN")}</div>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-xs text-muted-foreground">Billed to</div>
            <div className="font-medium">{invoice.sale?.customer_name || "Walk-in customer"}</div>
            {hasPhone && (
              <div className="text-xs text-muted-foreground mt-0.5">{invoice.sale?.customer_phone}</div>
            )}
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium py-2">Item</th>
                <th className="text-right font-medium py-2">Qty</th>
                <th className="text-right font-medium py-2">Rate</th>
                <th className="text-right font-medium py-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((it: any, i: any) => (
                <tr key={i}>
                  <td className="py-2">{it.product_name}</td>
                  <td className="py-2 text-right">{it.qty}</td>
                  <td className="py-2 text-right">{fmtINR(it.unit_price)}</td>
                  <td className="py-2 text-right">{fmtINR(it.line_total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border">
                <td colSpan={3} className="py-3 text-right font-semibold">Total</td>
                <td className="py-3 text-right font-bold text-lg">{fmtINR(invoice.total)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-muted-foreground text-center pt-2">Thank you for your business 🙏</p>
        </div>
      </div>
    </div>
  );
}