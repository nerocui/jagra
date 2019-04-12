import sendgrid from "sendgrid";
import keys from "../config/keys";

const helper = sendgrid.mail;

export default class Mailer extends helper.Mail {
	constructor({ subject, recipients }, content) {
		super();
  
		this.sgApi = sendgrid(keys.sendGridKey);
		this.from_email = new helper.Email("no-reply@jagra.com");
		this.subject = subject;
		this.body = new helper.Content("text/html", content);
		this.recipients = this.formatAddresses(recipients);
	
		this.addContent(this.body);
		this.addClickTracking();
		this.addRecipients();
	}
  
	formatAddresses(recipients) {
		console.log("---------", recipients);
		return recipients.map(({ email }) => new helper.Email(email));
	}
  
	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);
	
		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}
  
	addRecipients() {
		const personalize = new helper.Personalization();
	
		this.recipients.forEach(recipient => {
			personalize.addTo(recipient);
		});
		this.addPersonalization(personalize);
	}
  
	async send() {
		const request = this.sgApi.emptyRequest({
			method: "POST",
			path: "/v3/mail/send",
			body: this.toJSON(),
		});
	
		const response = await this.sgApi.API(request);
		return response;
	}
}
