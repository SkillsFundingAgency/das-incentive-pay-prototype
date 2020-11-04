// Routes for v2
var v = '/v2';
var vx = 'v2';
var apprentices = require('./../../../app/data/apprentices.json');

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function (router,_myData) {

	function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))
    }

    // Every GET and POST
    router.all(v + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }
        next()
    });

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
			res.redirect(v + '/sign-agreement')
		}
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
		// if (req.session.data['sort-code'] === "" || req.session.data['account-number'] === "") {
		// 	req.session.data['error-bank-details'] = true
		// 	res.redirect(v + '/bank-details')
		// }
		// else {
			req.session.data['error-bank-details'] = false
			res.redirect(v + '/check-answers')
		// }
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
		res.redirect(v + '/confirmation')
	})


}