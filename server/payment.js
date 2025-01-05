const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'payments'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Function to store payment information
function storePayment(paymentId, paymentStatus) {
  const query = 'INSERT INTO payments (payment_id, payment_status,payment_completion) VALUES (?, ?, ?)';
  connection.query(query, [paymentId, paymentStatus], (err, results) => {
    if (err) {
      console.error('Error inserting payment information:', err.stack);
      return;
    }
    console.log('Payment information stored successfully:', results);
  });
}

// Example usage
const paymentId = 'PAY123456';
const paymentStatus = '1';
const paymentcompletion='true';
storePayment(paymentId, paymentStatus,paymentcompletion);

// Close the connection
connection.end();
