import BusinessWhatsappForm from "@/components/business-whatsapp-form";
import ChangePinForm from "@/components/change-pin-form";
import DeliveryFeeForm from "@/components/delivery-fee-form";
import DeliveryZonesForm from "@/components/delivery-zones-form";
import RegisterPasskeyButton from "@/components/register-passkey-button";
import { Card } from "@/components/ui/card";
import { getDeliveryZones, getRentalSettings } from "@/lib/supabase/queries";

export default async function OwnerSettingsPage() {
  const [settings, zones] = await Promise.all([getRentalSettings(), getDeliveryZones()]);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-center font-heading text-lg font-semibold">Settings</h1>
      <ChangePinForm dashboardHref="/owner" />
      <Card className="items-center gap-2 p-5 text-center">
        <h2 className="text-sm font-semibold text-muted-foreground">Biometric sign-in</h2>
        <RegisterPasskeyButton />
      </Card>
      <DeliveryZonesForm zones={zones} />
      <DeliveryFeeForm deliveryFeeSar={settings.deliveryFeeSar} />
      <BusinessWhatsappForm businessWhatsapp={settings.businessWhatsapp} />
    </div>
  );
}