api/submit-to-sheets.js
import { google } from 'googleapis';

const SHEET_ID = '1bSggJ7yubCzRsEQrzenFTRF8JkF6WWo6hRZcAfQto9A';
const SHEET_NAME = 'Zwergengruppe Leads';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      timestamp,
      name,
      email,
      phone,
      callTime,
      arbeitsmodell,
      geburtstermin,
      einkommen_pt1,
      einkommen_pt2,
      geschwister,
      geschwister_geburt,
      besonderheiten,
      elterngeld_ohne,
      elterngeld_mit,
      elterngeld_diff,
      price
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
      [
        new Date(timestamp).toLocaleString('de-DE'),
        name,
        email,
        phone,
        callTime,
        arbeitsmodell,
        geburtstermin,
        einkommen_pt1 || '',
        einkommen_pt2 || '',
        geschwister || '',
        geschwister_geburt || '',
        besonderheiten || '',
        elterngeld_ohne || '',
        elterngeld_mit || '',
        elterngeld_diff || '',
        price || '',
      ]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:P`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Lead successfully submitted',
      updatedRows: response.data.updates.updatedRows,
    });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
