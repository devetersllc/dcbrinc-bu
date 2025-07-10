import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "ahmadrazakhalid11.0@gmail.com",
    pass: process.env.SMTP_PASS || "imgf vzzg potw utte",
  },
});

export async function sendOrderNotificationEmail(orderData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "ahmadrazakhalid9.0@gmail.com";

  const emailContent = `
    <h2>New Order Received</h2>
    <h3>Customer Information:</h3>
    <ul>
      <li><strong>Name:</strong> ${orderData.name}</li>
      <li><strong>Email:</strong> ${orderData.email}</li>
    </ul>
    
    <h3>Book Information:</h3>
    <ul>
      <li><strong>Book Size:</strong> ${orderData.bookSize}</li>
      <li><strong>Page Count:</strong> ${orderData.pageCount}</li>
      <li><strong>Interior Color:</strong> ${orderData.interiorColor}</li>
      <li><strong>Paper Type:</strong> ${orderData.paperType}</li>
      <li><strong>Binding Type:</strong> ${orderData.bindingType}</li>
      <li><strong>Cover Finish:</strong> ${orderData.coverFinish}</li>
    </ul>
    
    <h3>Order Details:</h3>
    <ul>
      <li><strong>Total Price:</strong> $${orderData.totalPrice}</li>
      <li><strong>Order Date:</strong> ${new Date(
        orderData.orderDate
      ).toLocaleString()}</li>
      <li><strong>Payment ID:</strong> ${orderData.paymentInfo?.paymentId}</li>
      <li><strong>Transaction ID:</strong> ${
        orderData.paymentInfo?.transactionId
      }</li>
    </ul>
        
    <p>Please process this order as soon as possible.</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: `New Book Order - ${orderData.name}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order notification email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to send order notification email:", error);
    return { success: false, error };
  }
}
