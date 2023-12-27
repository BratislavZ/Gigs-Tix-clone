export type AuthFormState = {
  success: boolean;
  errors: {
    email?: Array<string>;
    passoword?: Array<string>;
    _form?: Array<string>;
  };
};

export type TicketFormState = {
  success: boolean;
  errors: {
    title?: Array<string>;
    price?: Array<string>;
    _form?: Array<string>;
  };
};

export type OrderFormState = {
  success: boolean;
  errors: {
    _form?: Array<string>;
  };
  orderId?: string;
};
