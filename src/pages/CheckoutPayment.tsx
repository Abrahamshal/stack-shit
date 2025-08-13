const CheckoutPayment = () => {
  return (
    <div style={{ padding: '40px', minHeight: '100vh', background: 'white' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        Checkout Payment Page
      </h1>
      <p style={{ marginBottom: '20px' }}>
        This is a basic test page with inline styles.
      </p>
      <p>
        If you can see this text, the routing is working correctly.
      </p>
      <br />
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go back to home
      </a>
    </div>
  );
};

export default CheckoutPayment;