import * as functions from 'firebase-functions';
/**
 * This is a SAMPLE request response google firebase function and can be '
 * to DEMONSTRATE the capabilities of firebase functions using Send Grid
 * 
 * Improvements: 
 * 1. Store keys in Cloud Key MAnagaement Service
 * 2. or Use set environment variables for cloud functions
 * 3. For API access it is good to use facade or Proxy pattern 
 * 
 * 
 * WARNING: DO NOT USE OR MENTION KEYS in the cloud program use the any of the above two methods    
 * for storing and retrieving the keys.
 */
export const sendGrid = functions.https.onRequest((request, response) => {
	let toAddress: string;
	let data: string;
	let subject: string;
	let html: string;
	let type: string;
	let sendersName: string;
	let flag: boolean = false;
	let templateId: string;


	// Manage mail templates
	const newLeaseRequest = 'd-81exxxxxxxf806199';
	const newServiceTicket = 'd-da651bfc4xxxxxxxxx78a957bc6a1a';
	const fromAddress = 'xxxx@xxxx.com';

	// response.header('Content-Type','application/json');
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Content-Type');

	// Send Grid API Keys 
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey('SG.xxxxxxx-Y2JSKxkHsEQ.xxxxxx-FkPsekGnqKmgpTNb0XQCTQ_zQfsr7z9mQ');
	sgMail.setSubstitutionWrappers('{{', '}}');

	if (request.method === 'POST') {
		// response.send(JSON.stringify(request.body));
		// Contenxt based switching
		switch (request.get('content-type')) {
			case 'application/json':
				data = request.body.data || 'no data';
				toAddress = request.body.toAddress || 'arun.nekkalapudi@gmail.com';
				sendersName = request.body.sendersName || 'rent365';
				subject = request.body.subject || 'no subject';
				html = request.body.html || 'no html';
				type = request.body.mailtype || 'na';
				flag = true;
				break;

			case 'application/octet-stream':
				response.status(403).send('use application/json');
				break;

			case 'text/plain':
				response.status(403).send('use application/json');
				break;

			case 'application/x-www-form-urlencoded':
				response.status(403).send('use application/json');
				break;
		}
	} else {
		// Handle GET request over here
		response.send('In get method');
	}

	if (flag) {
		if(type === 'newlease'){
			templateId = newLeaseRequest;
		}
		else if(type === 'newticket') {
			templateId = newServiceTicket;
		}
		else {
			response.send(type);
		}

		sgMail
			.send({
				template_id: templateId,
				from: fromAddress,
				to: { name: sendersName, email: toAddress },
				subject: subject,
				dynamic_template_data: {
					firstname: sendersName,
					body: data
				}
			})
			.then(
				(result) => {
					response.send(JSON.stringify('success'));
				},
				(err) => {
					response.send('Error');
				}
			);
		
	}
});
