import React, { useState } from "react";

/**
 * ClubFees Component
 * 
 * This component displays and manages the club fee details for a player. It allows users to view 
 * the amount owed, amount paid, and balance due, and provides functionality to make payments.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.playerDetails - The details of the player including fee information.
 * @param {number} props.playerDetails.amount_owed - The total amount owed by the player.
 * @param {number} props.playerDetails.amount_paid - The total amount paid by the player.
 * @param {number} props.playerDetails.balance - The remaining balance due by the player.
 * 
 * @returns {JSX.Element} The rendered ClubFees component.
 * 
 * @example
 * // Example usage:
 * const playerDetails = {
 *   amount_owed: 500,
 *   amount_paid: 200,
 *   balance: 300
 * };
 * 
 * <ClubFees playerDetails={playerDetails} />
 */

export default function ClubFees({ playerDetails }) {
  // State to store the payment amount entered by the user
  const [paymentAmount, setPaymentAmount] = useState("");

  // State to store updated player fee details
  const [updatedDetails, setUpdatedDetails] = useState({
    ...playerDetails,
    amount_owed: parseFloat(playerDetails.amount_owed) || 0,
    amount_paid: parseFloat(playerDetails.amount_paid) || 0,
    balance: parseFloat(playerDetails.balance) || 0,
  });

  // Display a loading message if player details are not available
  if (!playerDetails) {
    return <p>Loading club fees...</p>;
  }

  /**
   * Handles the payment process.
   * Validates the payment amount, updates the fee details, and resets the input field.
   */
  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);

    // Validate the payment amount
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    // Calculate the new payment details
    const newAmountPaid = updatedDetails.amount_paid + amount;
    const newBalance = updatedDetails.amount_owed - newAmountPaid;

    // Update the state with the new payment details
    setUpdatedDetails({
      ...updatedDetails,
      amount_paid: newAmountPaid,
      balance: newBalance,
    });

    // Optionally, update the backend or localStorage here
    alert(`Payment of R${amount.toFixed(2)} successful!`);

    // Clear the input field
    setPaymentAmount("");
  };

  return (
    <div className="clubfees-container">
      <h2>Club Fees</h2>

      {/* Display the player's fee details */}
      <p><strong>Amount Owed:</strong> R{updatedDetails.amount_owed.toFixed(2)}</p>
      <p><strong>Amount Paid:</strong> R{updatedDetails.amount_paid.toFixed(2)}</p>
      <p><strong>Balance Due:</strong> R{updatedDetails.balance.toFixed(2)}</p>

      {/* Payment input and button */}
      <div className="payment-section">
        <input
          type="number"
          placeholder="Enter payment amount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <button onClick={handlePayment}>Pay</button>
      </div>
    </div>
  );
}