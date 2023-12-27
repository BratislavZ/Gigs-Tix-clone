export const paths = {
  home() {
    return '/';
  },
  signIn() {
    return '/sign-in';
  },
  signUp() {
    return '/sign-up';
  },
  orders() {
    return '/orders';
  },
  orderShow(orderId: string) {
    return `/orders/${orderId}`;
  },
  ticketShow(ticketId: string) {
    return `/tickets/${ticketId}`;
  },
  ticketNew() {
    return '/tickets/new';
  },
};
