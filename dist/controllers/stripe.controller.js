import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`);
const createCheckoutSession = async (req, res) => {
    try {
        const { cart, restaurantId } = req.body;
        const lineItems = cart.map((cartItem) => {
            return {
                "price_data": {
                    "currency": "inr",
                    "unit_amount": cartItem.cartItemPrice * 100,
                    "product_data": {
                        "name": cartItem.cartItemName,
                    },
                },
                "quantity": cartItem.cartItemQty,
            };
        });
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/restaurant/results/menu/${restaurantId}`
        });
        if (!session) {
            res.status(500).json({
                "success": false,
                "message": "something went wrong with stripe"
            });
            return;
        }
        res.status(200).json({
            "success": true,
            url: session.url,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { createCheckoutSession, };
