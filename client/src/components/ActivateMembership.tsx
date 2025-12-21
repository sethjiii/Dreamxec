import React from "react";
import { createSubscription } from "../services/subscriptionService";

const ActivateMembership: React.FC = () => {
  const handleSubscription = async () => {
    try {
      // 1️⃣ Call backend to create subscription
      const { subscriptionId } = await createSubscription();

      // 2️⃣ Create Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "DreamXec Membership",
        description: "1 Year Membership",
        handler: function (response: any) {
          alert("Membership Activated! 🎉");
          window.location.reload();
        },
        prefill: {
          email: "",
          name: "",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to start membership payment.");
    }
  };

  return (
    <button
      onClick={handleSubscription}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
    >
      Activate Membership
    </button>
  );
};

export default ActivateMembership;
