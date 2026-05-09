"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import WhatsAppVerificationModal from "./index";

export default function VerificationTrigger() {
  const { user, profile } = useAuth();
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("whatsapp_claims")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        console.log("🚀 ~ checkClaimStatus ~ data:", data, error)

        if (error) {
          console.error("Error checking whatsapp claim:", error);
          return;
        }

        // If no claim exists, show the modal
        if (!data) {
          const hasSeenModal = sessionStorage.getItem("hasSeenWhatsappModal");
          if (!hasSeenModal) {
            const timer = setTimeout(() => {
              setIsWhatsappModalOpen(true);
            }, 3000); // 3 second delay
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error("Error in checkClaimStatus:", error);
      }
    };

    checkClaimStatus();
  }, [user, profile]);

  const handleModalClose = () => {
    setIsWhatsappModalOpen(false);
    sessionStorage.setItem("hasSeenWhatsappModal", "true");
  };

  return (
    <WhatsAppVerificationModal
      isOpen={isWhatsappModalOpen}
      onClose={handleModalClose}
      onVerified={() => {
        sessionStorage.setItem("hasSeenWhatsappModal", "true");
      }}
    />
  );
}
