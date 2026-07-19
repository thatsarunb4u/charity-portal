declare module "paynowqr" {
  interface PayNowQROptions {
    uen: string;
    amount: number;
    editable?: boolean;
    company?: string;
    refNumber?: string;
  }

  export default class PaynowQR {
    constructor(options: PayNowQROptions);
    output(): string;
  }
}