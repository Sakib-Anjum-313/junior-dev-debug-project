/**
 * !! ATTENTION PLEASE !!
 * Please refer to the documentation at https://developer.bka.sh for information on bKash.
 */
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const createPayment = ({ bkash , config}) => async (req, res) => {
  //  console.log(config.api + "/api/bkash/status?email=" + req.body.email);
  try {
    const createAgreement = await bkash.createAgreement({
      mode: "0000",
      payerReference: req.body.phone,
      totalPrice: req.body.totalPrice,
      email: req.body.email,
      currency: "BDT",
      intent: "Sale",
      callbackURL: config.base,
    });
    res.status(201).send(createAgreement?.bkashURL);
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

export const executePayment = ({ bkash, mail, config }) => async (req, res) => {

  try {
    let email = req.query.email;
    let paymentID = req.query.paymentID;

    console.log(req.query.paymentID);

    const execute = await bkash.executeAgreement(paymentID);

     console.log(execute.statusCode);

      if (Number(execute.statusCode) !== 2054) {
      const crtPayment = await bkash.createPayment({
        mode: "0001",
        payerReference: execute?.payerReference,
        merchantAssociationInfo: "MI05MID54RF09123456One",
        merchantInvoiceNumber: "Inv0121",
        amount: req.query.totalPrice,
        currency: "BDT",
        intent: "Sale",
        agreementID: execute?.agreementID,
        baseURL: "http://localhost:3000/",
      });
        
      let createPay = await bkash.executePayment({ paymentID: crtPayment.paymentID });
      // Send a Confirmation Email
      if (createPay.statusCode === '0000') {
        await mail({
          receiver: req.query.email,
          subject: 'Coding test',
          body: fs.readFileSync(path.resolve(__dirname, 'templates', 'emailTemplate.html')),
          type: 'html'
        });
      }

        console.log(crtPayment);
     // Redirect to webpage to show a modal
      return await res.redirect(crtPayment.bkashURL);
      }
    await res.redirect(config.base);
    
  } catch (error) {
    res.status(500).send("something went wrong");
  }



  
};

export const status = ({ config }) => async (req, res) => {
  let email = req.query.email;
  res.redirect(config.base + '?buy=success?email=' + email);
};
