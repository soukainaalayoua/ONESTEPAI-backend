const router = require("express").Router();
const Stripe = require("stripe");
const User = require("../models/user");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  const { userId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Unlimited Goals Access",
            },
            unit_amount: 500, //
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/payment-success?userId=${userId}",
      cancel_url: "http://localhost:5173/payment-cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Payment error", error: err.message });
  }
});
// paymentRoutes. js // succss
router.post("/success/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isPro: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User upgraded to Pro", user });
  } catch (err) {
    res.status(500).json({ message: "Upgrade error", error: err.message });
  }
});

module.exports = router;
