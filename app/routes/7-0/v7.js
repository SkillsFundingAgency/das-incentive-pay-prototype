// Routes for v7
var v = '/v7';
var vx = 'v7';
var apprentices = require('./../../../app/data/apprentices.json');

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function (router) {

	router.post(v + '/taken-on-new-apprentices', function (req, res) {
		if (req.session.data['taken-on-new-apprentices'] === "yes"){
			res.redirect(v + '/select-new-apprentices')
		}
		if (req.session.data['taken-on-new-apprentices'] === "no"){
			res.redirect(v + '/shutter/no-new-apprentices')
		}
		else {
			res.redirect(v + '/taken-on-new-apprentices')
		}
	})

	router.get(v + '/select-new-apprentices', function (req, res) {
		req.session.apprenticeData = JSON.parse(JSON.stringify(apprentices))
		res.render(vx + '/select-new-apprentices', {
			apprenticeData:req.session.apprenticeData
		});
	})

	router.post(v + '/select-new-apprentices', function (req, res) {
		req.session.data['total'] = 0
		if (req.session.data['apprentice1']) {
			req.session.data['total'] = req.session.data['total'] + 3000
		}
		if (req.session.data['apprentice2']) {
			req.session.data['total'] = req.session.data['total'] + 1000
		}
		if (req.session.data['apprentice3']) {
			req.session.data['total'] = req.session.data['total'] + 3000
		}
		req.session.data['totalPay'] = numberWithCommas(req.session.data['total'])

		if (req.session.data['apprentice1'] === undefined && req.session.data['apprentice2'] === undefined && req.session.data['apprentice3'] === undefined) {
			req.session.data['error-select-apprentices'] = true
			res.redirect(v + '/select-new-apprentices')
		}
		else {
			req.session.data['error-select-apprentices'] = false
			res.redirect(v + '/sign-agreement')
		}
	})

	router.post(v + '/sign-agreement', function (req, res) {
		req.session.data['saved-application'] = false
		req.session.data['saved-at-terms'] = false
		if (req.session.data['already-applied'] === true) {
			res.redirect(v + '/check-answers')
		}
		else {
			res.redirect(v + '/bank-details')
		}
	})

	router.post(v + '/add-bank-details', function (req, res) {
		res.redirect(v + '/check-bank-details')
	})

	router.post(v + '/check-bank-details', function (req, res) {
			req.session.data['bank-details'] = true
			req.session.data['bank-skipped'] = false
			res.redirect(v + '/bank-confirmation')
	})

	router.post(v + '/bank-details', function (req, res) {
		req.session.data['error-bank-details'] = false
		req.session.data['bank-skipped'] = false
		req.session.data['saved-application'] = false
		req.session.data['saved-at-bank-details'] = false
		res.redirect(v + '/check-answers')
	})

	router.get(v + '/skip-bank-details', function (req, res) {
		req.session.data['bank-details'] = false
		req.session.data['bank-skipped'] = true
		res.redirect(v + '/check-answers')
	})

	router.get(v + '/save-at-terms', function (req, res) {
		req.session.data['saved-application'] = true
		req.session.data['saved-at-terms'] = true
		res.redirect(v + '/save-confirmation')
	})

	router.get(v + '/save-at-bank-details', function (req, res) {
		req.session.data['saved-application'] = true
		req.session.data['saved-at-bank-details'] = true
		res.redirect(v + '/save-confirmation')
	})

	router.get(v + '/continue-from-terms', function (req, res) {
		req.session.data['saved-application'] = false
		req.session.data['saved-at-terms'] = false
		res.redirect(v + '/sign-agreement')
	})

	router.get(v + '/continue-from-bank-details', function (req, res) {
		req.session.data['saved-application'] = false
		req.session.data['saved-at-bank-details'] = false
		res.redirect(v + '/bank-details')
	})

	router.get(v + '/account-home-not-applied', function (req, res) {
		req.session.data['bank-skipped'] = null
		req.session.data['already-applied'] = false
		res.redirect(v + '/account-home')
	})

	router.get(v + '/guidance-not-applied', function (req, res) {
		req.session.data['bank-skipped'] = null
		req.session.data['already-applied'] = false
		res.redirect(v + '/guidance')
	})

	router.get(v + '/account-subsequent-application', function (req, res) {
		req.session.data['bank-skipped'] = false
		req.session.data['already-applied'] = true
		res.redirect(v + '/account-home')
	})

	router.get(v + '/account-with-bank-skipped', function (req, res) {
		req.session.data['bank-skipped'] = true
		req.session.data['already-applied'] = false
		res.redirect(v + '/account-home')
	})

	// V1 CHECK ANSWERS
	router.post(v + '/check-claim', function (req, res) {
		res.redirect(v + '/confirmation')
	})

	router.get(v + '/check-answers', function (req, res) {
		req.session.apprenticeData = JSON.parse(JSON.stringify(apprentices))
		res.render(vx + '/check-answers', {
			apprenticeData:req.session.apprenticeData,
			data:req.session.data
		});
	})

	// V2 CHECK ANSWERS
	router.post(v + '/check-answers', function (req, res) {
		if (req.session.data['bank-skipped'] !== true)
		{
			req.session.data['already-applied'] = true
		}
			res.redirect(v + '/confirmation')
	})


}