import { addDoc, collection, doc, getDocs, onSnapshot, query, where } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import "./PlansScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "customers", user.uid, "subscriptions"));

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach(async (subscription) => {
        // console.log(subscription.data());

        setSubscription({
          role: subscription.data().role,
          current_period_start:
            subscription.data().current_period_start.seconds,
          current_period_end: subscription.data().current_period_end.seconds,
        });
      });
    });
  }, [user.uid]);

  useEffect(() => {
    const q = query(collection(db, "products"), where("active", "==", true));

    onSnapshot(q, (querySnapshot) => {
      const products = {};

      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data();

        const productDocRef = doc(db, "products", productDoc.id);
        
        const priceSnap = await getDocs(collection(productDocRef, "prices"));

        priceSnap.forEach((price) => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data(),
          };
        });
      });
      setProducts(products);
    });
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await addDoc(
      collection(db, "customers", user.uid, "checkout_sessions"),
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(docRef, async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        // Show an error to a customer and inspect your
        // Cloud functions logs in the firebase console.
        alert(`An error occurred: ${error.message}`);
      }
      if (sessionId) {
        // We have a session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe(
          "pk_test_51MGLNQKEotayYb0IQhXyzIYG6BCBQb3b34sI7j0d9MXaMnvtnyZVTGw3p5rnc9HQz3RGAYAQfmBuCjaAoHv6yVxx00H1QhsYji"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plansScreen">
        <br />
      {subscription && (
        <p className="plansScreen__renewal">
          Renewal date:{" "}
          {new Date(subscription?.current_period_end * 1000).toLocaleDateString(
            "CS-cs"
          )}
        </p>
      )}

          {Object.entries(products).map(([productId, productData]) => {
          // Here i verify if the user's subscription is active
             const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);
             
             return(
               <div key={productId}
               className={`${
                 isCurrentPackage && "plansScreen__plan--disabled"
               } plansScreen__plan`}>
                 <div className="plansScreen_info">
                    <h5>{productData.name}</h5>
                    <h6>{productData.description}</h6>
                 </div> 

                 <button onClick={() =>!isCurrentPackage && loadCheckout(productData.prices.priceId)}>
                    {isCurrentPackage ? "Current Plan" : "Subscribe"}
                 </button>     
               </div>
             )
        })}
    </div>
  );
}

export default PlansScreen;
