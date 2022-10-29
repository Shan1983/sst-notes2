import { API } from "aws-amplify";
import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "./Settings.css";
import { loadStripe } from "@stripe/stripe-js";
import { onError } from "../utils/handleErrors";
import BillingForm from "../components/BillingForm";
import { Elements } from "@stripe/react-stripe-js";

const Settings = () => {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const stripePromise = loadStripe(config.STRIPE_KEY);

  const billUser = (details) => {
    API.post("notes", "/billing", {
      body: details,
    });
  };

  const handleFormSubmit = async (storage, { token, error }) => {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert("Your card has been charged successfully");
      nav("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        fonts={[
          {
            cssSrc:
              "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
          },
        ]}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
};

export default Settings;
