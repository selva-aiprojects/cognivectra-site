export default async function handler(req, res) {
  const lead = req.body;

  const zohoPayload = {
    data: [
      {
        Company: lead.company || "Unknown",
        Last_Name: lead.user_name || "Unknown",
        Email: lead.user_email,
        Lead_Source: "Chatbot",
        Description: lead.challenge,
        Lead_Status: lead.lead_score.toUpperCase(),
        Budget: lead.budget,
        Timeline: lead.timeline,
      },
    ],
  };

  await fetch("https://www.zohoapis.com/crm/v2/Leads", {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${process.env.ZOHO_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(zohoPayload),
  });

  res.status(200).json({ ok: true });
}
