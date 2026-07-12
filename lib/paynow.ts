import PaynowQR from "paynowqr";
import QRCode from "qrcode";

export async function generatePayNowQR(
  uen: string,
  merchant: string,
  amount: number,
  reference: string
) {
  const payload = new PaynowQR({
    uen,
    editable: false,
    amount,
    company: merchant,
    refNumber: reference,
  });

  const qrString = payload.output();

  const qrImage = await QRCode.toDataURL(qrString);

  return qrImage;
}