import { AwesomeQR } from 'awesome-qr';
import joi from 'joi';

const bodySchema = joi.object().keys({
	firstName: joi.string().required(),
	lastName:  joi.string().required(),
	birthdate: joi.string().required(),
	phone: joi.string().required(),
	email: joi.string().email().required(),
});

export const config = {
	api: {
	  bodyParser: {
		sizeLimit: '1mb',
	  },
	},
  }

export default function handler (req, res) {
	if (req.method !== 'POST') {
		res.status(404).end();
		return;
	}

	bodySchema.validateAsync(req.body, {
		abortEarly: false,
	}).then(() => {
		const qr = new AwesomeQR({
			text: JSON.stringify({
				firstName: req.body.firstName,
				lastName:  req.body.lastName,
				birthdate: req.body.birthdate,
				phone: req.body.phone,
				email: req.body.email,
				timesteamp: new Date().toISOString(),
			}),
		});

		return qr.draw();
	}).then((qr) => {
		res.end(qr.toString('base64'));
	}).catch((err) => {
		res.status(400);

		res.end(err.message);
	});
}