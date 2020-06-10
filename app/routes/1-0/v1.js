// Routes for v1
var v = '/v1';

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function (router) {

	router.post(v + '/select-new-apprentices', function (req, res) {
		req.session.data['total'] = 0
		if (req.session.data['apprentice1']) {
			req.session.data['total'] = req.session.data['total'] + 3000
		}
		if (req.session.data['apprentice2']) {
			req.session.data['total'] = req.session.data['total'] + 3000
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
			res.redirect(v + '/check-claim')
		}
	})

	router.post(v + '/check-claim', function (req, res) {
		res.redirect(v + '/sign-agreement')
	})

	router.post(v + '/sign-agreement', function (req, res) {
		if (req.session.data['submitconfirm-1'] === undefined) {
			req.session.data['error-sign-agreement'] = true
			res.redirect(v + '/sign-agreement')
		}
		else {
			req.session.data['error-sign-agreement'] = false
			res.redirect(v + '/bank-details')
		}
	})

	router.post(v + '/bank-details', function (req, res) {
		if (req.session.data['sort-code'] === "" || req.session.data['account-number'] === "") {
			req.session.data['error-bank-details'] = true
			res.redirect(v + '/bank-details')
		}
		else {
			req.session.data['error-bank-details'] = false
			res.redirect(v + '/confirmation')
		}
	})


}