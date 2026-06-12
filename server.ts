import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// First attempt to load service account: Check process.env, then check .env explicitly
let serviceAccount: any = null;
try {
  let saString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (saString) {
    serviceAccount = typeof saString === 'string' && saString.startsWith('{') ? JSON.parse(saString) : null;
  }
} catch (e) {
  console.error("Failed to parse Service Account Key", e);
}

// Initialize Firebase Admin
try {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin initialized with Service Account for project:", serviceAccount.project_id);
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not set or invalid. Backend Firebase Admin SDK may not function correctly.");
    initializeApp(); // Attempt default setup
  }
} catch (e) {
  console.error("Firebase admin init error:", e);
}

const db = getApps().length ? getFirestore() : null;

// Ensure Nodemailer is set up
const smtpPassRaw = process.env.SMTP_PASS || 'znbnhiswrxfwejer';
const smtpPass = smtpPassRaw.replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Assuming gmail for simplicity based on user's gmail address
  auth: {
    user: process.env.SMTP_USER || 'rahulgaming8511331923@gmail.com',
    pass: smtpPass
  }
});

const webhookUrl = 'https://discord.com/api/webhooks/1512417821164961852/nybOTg_gioT5iowmR-x_q7_g8eCxLRP9dhRuQ7iVC1mTJqZujuKHw0GuaJ9UfmjKIMq3';

// This function runs when your payment gateway confirms a success
async function sendPaymentAlert(customerName: string, amount: string | number, itemPurchased: string) {
  const payload = {
    username: "Sales Bot 💸",
    embeds: [
      {
        title: "🎉 New Payment Received!",
        color: 5763719, // A nice bright green color code
        fields: [
          {
            name: "Item",
            value: itemPurchased,
            inline: false
          },
          {
            name: "Amount",
            value: `₹${amount}`,
            inline: true
          },
          {
            name: "Customer",
            value: customerName,
            inline: true
          }
        ],
        footer: {
          text: "Website Checkout"
        },
        timestamp: new Date().toISOString() // Adds the exact time
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log("Discord payment alert sent!");
  } catch (error) {
    console.error("Failed to send alert:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' })); // Allow higher limit for base64 screenshots

  // --- API ROUTES ---

  // Submit Payment
  app.post("/api/payments/submit", async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: "Firebase DB not connected" });
      }

      const { username, email, utrNumber, amount, items, screenshotBase64 } = req.body;

      if (!username || !email || !utrNumber || !amount || !screenshotBase64) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // 1. Create Firestore Document
      const docRef = await db.collection("payments").add({
        username,
        email,
        utrNumber,
        amount,
        items,
        screenshotBase64, // Storing base64 as instructed
        status: "pending",
        emailDeliveryLogs: [], // Track email statuses
        date: FieldValue.serverTimestamp()
      });

      // Send Discord Alert
      sendPaymentAlert(username, amount, items.join(", ")).catch(console.error);

      // 2. Send Email Notification to Admin & User
      try {
        if (smtpPass) {
          // Admin Email
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: "rahulgaming8511331923@gmail.com",
            subject: `[StockMC] New Payment Submitted: ₹${amount} by ${username}`,
            html: `
              <h3>New Payment Submission</h3>
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Amount:</strong> ₹${amount}</p>
              <p><strong>Items:</strong> ${items.join(", ")}</p>
              <p><strong>UTR:</strong> ${utrNumber}</p>
              <p><strong>Date UTC:</strong> ${new Date().toISOString()}</p>
              <p><br/>Approve or reject in the Admin Dashboard.</p>
            `,
            attachments: [
              {
                filename: 'screenshot.png',
                content: screenshotBase64.split("base64,")[1] || screenshotBase64,
                encoding: 'base64'
              }
            ]
          });
          
          await docRef.update({
            emailDeliveryLogs: FieldValue.arrayUnion({
              type: "admin_notification",
              status: "sent",
              timestamp: new Date().toISOString()
            })
          });

          // User Confirmation Email
          if (email) {
            await transporter.sendMail({
              from: process.env.SMTP_USER,
              to: email,
              subject: `StockMC: We received your payment request!`,
              html: `
                <h3>Payment Received</h3>
                <p>Hello ${username},</p>
                <p>We have successfully received your payment submission of <strong>₹${amount}</strong> for the following items:</p>
                <ul>
                  ${items.map((item: string) => `<li>${item}</li>`).join("")}
                </ul>
                <p><strong>UTR:</strong> ${utrNumber}</p>
                <p>Your payment is currently <strong>pending review</strong>. You will receive another email once it has been approved by the admin.</p>
                <p>Thank you for shopping at StockMC!</p>
              `
            });
            await docRef.update({
              emailDeliveryLogs: FieldValue.arrayUnion({
                type: "user_receipt",
                status: "sent",
                timestamp: new Date().toISOString()
              })
            });
          }

        } else {
          console.warn("Skipping email notification: SMTP_PASS not set");
          await docRef.update({
            emailDeliveryLogs: FieldValue.arrayUnion({
              type: "admin_notification",
              status: "failed",
              error: "SMTP_PASS not set",
              timestamp: new Date().toISOString()
            })
          });
        }
      } catch (err: any) {
        console.error("Email failed to send but payment was recorded:", err);
        await docRef.update({
          emailDeliveryLogs: FieldValue.arrayUnion({
            type: "admin_notification",
            status: "failed",
            error: err.message || "Unknown error",
            timestamp: new Date().toISOString()
          })
        });
      }

      res.status(200).json({ success: true, txnId: docRef.id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to submit payment" });
    }
  });

  // Approve Payment
  app.post("/api/payments/approve", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Firebase DB not connected" });
      
      const { paymentId, password } = req.body;
      if (password !== "minetrex0012030") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const docRef = db.collection("payments").doc(paymentId);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: "Not found" });

      const data = doc.data()!;

      // Update Firestore
      await docRef.update({
        status: "approved",
        updatedAt: FieldValue.serverTimestamp()
      });

      // Log action
      await db.collection("auditLogs").add({
        action: "APPROVE_PAYMENT",
        paymentId,
        date: FieldValue.serverTimestamp()
      });

      // Email User
      try {
        if (smtpPass) {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: data.email,
            subject: `Your StockMC Payment was Approved!`,
            html: `
              <h3>Payment Approved!</h3>
              <p>Hello ${data.username},</p>
              <p>Your payment of ₹${data.amount} for ${data.items.join(', ')} has been successfully verified.</p>
              <p>Your items have been credited and should be available in-game.</p>
              <p>Thank you for supporting StockMC!</p>
            `
          });

          // Email Admin Confirmation
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: "rahulgaming8511331923@gmail.com",
            subject: `[StockMC] Payment APPROVED: ${data.username}`,
            html: `<p>You have approved the payment for ${data.username} (₹${data.amount}). User has been notified.</p>`
          });
          
          await docRef.update({
            emailDeliveryLogs: FieldValue.arrayUnion({
              type: "user_approval",
              status: "sent",
              timestamp: new Date().toISOString()
            })
          });
        } else {
          console.warn("Skipping email notification: SMTP_PASS not set");
          await docRef.update({
            emailDeliveryLogs: FieldValue.arrayUnion({
              type: "user_approval",
              status: "failed",
              error: "SMTP_PASS not set",
              timestamp: new Date().toISOString()
            })
          });
        }
      } catch (err: any) {
        console.error("Email sending failed for approve action:", err);
        await docRef.update({
          emailDeliveryLogs: FieldValue.arrayUnion({
            type: "user_approval",
            status: "failed",
            error: err.message || "Unknown error",
            timestamp: new Date().toISOString()
          })
        });
      }

      res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to approve payment" });
    }
  });

  // Reject Payment
  app.post("/api/payments/reject", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Firebase DB not connected" });

      const { paymentId, reason, password } = req.body;
      if (password !== "minetrex0012030") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const docRef = db.collection("payments").doc(paymentId);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: "Not found" });

      const data = doc.data()!;

      // Update Firestore
      await docRef.update({
        status: "rejected",
        rejectionReason: reason || "No reason provided",
        updatedAt: FieldValue.serverTimestamp()
      });

      // Log action
      await db.collection("auditLogs").add({
        action: "REJECT_PAYMENT",
        paymentId,
        reason: reason || "No reason provided",
        date: FieldValue.serverTimestamp()
      });

      // Email User
      try {
        if (smtpPass) {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: data.email,
            subject: `StockMC Payment Update: Action Required`,
            html: `
              <h3>Payment Issue</h3>
              <p>Hello ${data.username},</p>
              <p>Unfortunately, your payment of ₹${data.amount} could not be verified.</p>
              <p><strong>Reason:</strong> ${reason || "Invalid or unverified transaction details."}</p>
              <p>Please contact support if you believe this is an error.</p>
            `
          });

          // Email Admin Confirmation
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: "rahulgaming8511331923@gmail.com",
            subject: `[StockMC] Payment REJECTED: ${data.username}`,
            html: `<p>You have rejected the payment for ${data.username} (₹${data.amount}). Reason: ${reason}. User has been notified.</p>`
          });
          
          await docRef.update({
            emailDeliveryLogs: FieldValue.arrayUnion({
              type: "user_rejection",
              status: "sent",
              timestamp: new Date().toISOString()
            })
          });
        } else {
          console.warn("Skipping email notification: SMTP_PASS not set");
          await docRef.update({
            emailDeliveryLogs: FieldValue.arrayUnion({
              type: "user_rejection",
              status: "failed",
              error: "SMTP_PASS not set",
              timestamp: new Date().toISOString()
            })
          });
        }
      } catch (err: any) {
        console.error("Email sending failed for reject action:", err);
        await docRef.update({
          emailDeliveryLogs: FieldValue.arrayUnion({
            type: "user_rejection",
            status: "failed",
            error: err.message || "Unknown error",
            timestamp: new Date().toISOString()
          })
        });
      }

      res.status(200).json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to reject payment" });
    }
  });

  // Fetch user specific payments
  app.get("/api/payments/user/:username", async (req, res) => {
    try {
      if (!db) return res.status(503).json({ error: "API not connected to DB" });
      const { username } = req.params;
      
      const snapshot = await db.collection("payments").where("username", "==", username).get();
      const payments = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          username: d.username,
          utrNumber: d.utrNumber,
          amount: d.amount,
          status: d.status,
          date: d.date ? d.date.toDate().toISOString() : new Date().toISOString(),
          items: d.items,
          rejectionReason: d.rejectionReason
        };
      });

      payments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.status(200).json({ payments });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch user payments" });
    }
  });

  // Public Leaderboard Endpoint
  app.get("/api/leaderboard", async (req, res) => {
    try {
      if (!db) return res.status(503).json({ error: "API not connected to DB" });
      
      const snapshot = await db.collection("payments").where("status", "==", "approved").get();
      const playerTotals: Record<string, number> = {};
      
      snapshot.docs.forEach(doc => {
        const d = doc.data();
        if (d.username && d.amount) {
          playerTotals[d.username] = (playerTotals[d.username] || 0) + Number(d.amount);
        }
      });
      
      const sortedPlayers = Object.entries(playerTotals)
        .map(([username, total]) => ({ username, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
        
      res.status(200).json({ leaderboard: sortedPlayers });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Fetch Payments (For Admin Dashboard)
  app.get("/api/payments", async (req, res) => {
    try {
      if (!db) return res.status(503).json({ error: "API not connected to DB" });
      
      const pwd = req.query.pwd;
      if (pwd !== "minetrex0012030") return res.status(403).json({ error: "Unauthorized" });

      const snapshot = await db.collection("payments").orderBy("date", "desc").get();
      const payments = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          username: d.username,
          email: d.email,
          utrNumber: d.utrNumber,
          amount: d.amount,
          status: d.status,
          date: d.date ? d.date.toDate().toISOString() : new Date().toISOString(),
          items: d.items,
          screenshotBase64: d.screenshotBase64,
          rejectionReason: d.rejectionReason,
          emailDeliveryLogs: d.emailDeliveryLogs || []
        };
      });

      res.status(200).json({ payments });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
