"use client"

import * as React from "react"
import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldCheck } from "phosphor-react"
import { useRouter } from "next/navigation"

interface PaystackIntegrationProps {
  invoice: any
  user: any
  id: any
}

export default function PaystackIntegration({ invoice, user, id }: PaystackIntegrationProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = React.useState(false)

  const config = {
    reference: `RB-${new Date().getTime()}`,
    email: user?.email || "",
    amount: invoice ? Math.round(invoice.amount * 100) : 0, // Amount in Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_dummy",
    metadata: {
      invoice_id: id,
      custom_fields: [
        {
          display_name: "Invoice ID",
          variable_name: "invoice_id",
          value: id
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    router.push("/dashboard?status=paid")
  };

  const onClose = () => {
    setIsProcessing(false)
  };

  const handlePay = () => {
    setIsProcessing(true);
    // @ts-ignore
    initializePayment(onSuccess, onClose);
  }

  return (
    <div className="space-y-4">
      <Button 
        className="w-full h-16 text-lg gap-3" 
        onClick={handlePay}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>Pay Now with Paystack <CreditCard weight="bold" /></>
        )}
      </Button>
      <div className="flex items-center justify-center gap-2 text-[10px] text-text-muted uppercase font-bold tracking-widest">
        <ShieldCheck className="text-success" /> Secured by Paystack & Reed Breed
      </div>
    </div>
  )
}
