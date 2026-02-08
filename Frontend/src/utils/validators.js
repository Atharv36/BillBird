export const validators = {
  1: (data) => {
    const { from } = data;
    return (
      from.email &&
      from.name &&
      from.phNo?.length === 10 &&
      from.address &&
      from.city &&
      from.state &&
      from.zipcode
    );
  },

  2: (data) => {
    const { to } = data;
    return to.email && to.name && to.address;
  },

  3: (data) => {
    const { invoicing } = data;
    return (
      invoicing.items.length > 0 &&
      invoicing.items.every(
        (i) =>
          i.description &&
          Number(i.quantity) >= 1 &&
          Number(i.quantity) <= 999 &&
          Number(i.price) >= 0
      )
    );
  },

  4: (data) => {
    const { paymentDetails } = data;
    return (
      paymentDetails.bankName &&
      paymentDetails.accountNumber?.length >= 8 &&
      paymentDetails.ifscCode
    );
  },

  5: (data) => {
    const { invoiceTerms } = data;
    return (
      invoiceTerms.issueDate &&
      invoiceTerms.dueDate
    );
  },
};
