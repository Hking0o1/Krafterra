const stripe = require('../../config/stripe')
const UserModel = require('../../models/UserModel')


const paymentController = async (req, res) => {
    try{
        const { cartItems} = req.body
        console.log(cartItems)
        const user = await UserModel.findOne({_id: req.userId})
        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            billing_address_collection : 'auto',
            shipping_options : [
                {
                    shipping_rate : 'shr_1Psq2jB9xSXwpeDywz6pKfKB'
                }
            ],
            customer_email : user.email,
            line_items: cartItems.map((item, index)=>{
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.productId.productName,
                            images: [item.productId.image[0]],
                            metadata: {
                                productId : item.productId._id
                            }
                        },
                        unit_amount: item.productId.selling * 100
                    },
                    adjustable_quantity : {
                        enabled:true,
                        minimum: 1
                    },
                    quantity : item.quantity
                }
            }
        ),
            success_url: `${process.env.CLIENT_URL}/order-success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
    }

        const session = await stripe.checkout.sessions.create(params)

        console.log('Stripe session created:', session.id);

        res.status(200).json({ success: true, id: session.id });
    }catch(err){
        console.error('Error creating Stripe session:', err);
        res.status(403).json({
            message: err.message || 'An error occurred',
            error: true,
            success: false
          });
    }
    
}

module.exports = paymentController;