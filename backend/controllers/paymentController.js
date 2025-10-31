import axios from "axios";
import dotenv from "dotenv";
import Tenants from "../models/tenants.js";
import Property from "../models/property.js";

dotenv.config();

export const initializePayment = async (req, res) => {
  try {
    const { amount, email, first_name, last_name, tenantId } = req.body;
    const tx_ref = "tx-" + Date.now();

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email,
        first_name,
        last_name,
        tx_ref,
        callback_url: "http://localhost:5173/payment/success", 
        customization: {
          title: "Tenant Payment",
          description: "Property rental payment",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    // ✅ Save transaction reference to tenant for tracking
    await Tenants.findByIdAndUpdate(tenantId, { tx_ref });

    res.status(200).json({
      checkout_url: response.data.data.checkout_url,
      tx_ref,
    });
  } catch (error) {
    console.error("Error initializing payment:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};


// ✅ VERIFY PAYMENT AND UPDATE DATABASE
export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    // ✅ If payment successful
    if (response.data.status === "success" && response.data.data.status === "success") {
      console.log("✅ Payment verified successfully for:", tx_ref);

      // 1️⃣ Find tenant by tx_ref
      const tenant = await Tenants.findOne({ tx_ref }).populate("propertyId");
      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found for this transaction" });
      }

      // 2️⃣ Update tenant payment + status
      tenant.tenantsPayments = "paid";
      tenant.status = "rented";
      await tenant.save();

      // 3️⃣ Update property payment + status
      if (tenant.propertyId) {
        const property = await Property.findById(tenant.propertyId._id);
        if (property) {
          property.paymentStatus = "paid";
          property.status = "rented";
          await property.save();
        }
      }

      res.status(200).json({
        verified: true,
        message: "Payment verified and tenant updated successfully",
        tenant,
      });
    } else {
      console.log("❌ Payment not successful for:", tx_ref);
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error("Payment verification failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Verification failed" });
  }
};
