// Routes for v16
var v = '/v16';
var vx = 'v16';
var apprentices = require('../../data/apprentices.json');

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function (router,_myData) {

	function reset(req){
		req.session.myData = JSON.parse(JSON.stringify(_myData))
		
		// Default setup
		req.session.myData.legalagreement = "true"
		req.session.myData.bankdetails = "false"
		req.session.myData.apprenticesavailable = "6"
		req.session.myData.apprenticesapplied = "6"
		req.session.myData.vrf = "added"
		
    }

    // Every GET and POST
    router.all(v + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
		}

		//version
		req.session.myData.version = vx

		//defaults for setup
        req.session.myData.legalagreement =  req.query.legal || req.session.myData.legalagreement
        req.session.myData.bankdetails =  req.query.bank || req.session.myData.bankdetails
        req.session.myData.apprenticesavailable =  req.query.apprentices || req.session.myData.apprenticesavailable
        req.session.myData.apprenticesapplied =  req.query.applied || req.session.myData.apprenticesapplied
        req.session.myData.vrf =  req.query.vrf || req.session.myData.vrf
		
        next()
	});
	
	// Prototype setup
    router.get(v + '/setup', function (req, res) {
        res.render(vx + '/setup', {
            myData:req.session.myData
        });
	});

	// Hub - home
    router.get(v + '/hub/home', function (req, res) {
        res.render(vx + '/hub/home', {
            myData:req.session.myData
        });
	});
	











	// OLD

	router.post(v + '/select-legal-entity', function (req, res) {
		res.redirect(v + '/taken-on-new-apprentices')
	})

	router.post(v + '/taken-on-new-apprentices', function (req, res) {
		if (req.session.data['taken-on-new-apprentices'] === "yes") {

			if (req.session.data['agreement-needed'] === true) {
				res.redirect(v + '/shutter/legal-agreement')
			}
			else {
				res.redirect(v + '/select-new-apprentices')
			}

		}
		if (req.session.data['taken-on-new-apprentices'] === "no") {
			res.redirect(v + '/shutter/no-new-apprentices')
		}
		else {
			res.redirect(v + '/taken-on-new-apprentices')
		}
	})

	router.get(v + '/lots-of-apprentices', function (req, res) {
		req.session.apprenticeData = JSON.parse(JSON.stringify(apprentices))
		res.render(vx + '/lots-of-apprentices', {
			apprenticeData: req.session.apprenticeData
		});
	})

	router.get(v + '/lots-of-apprentices-1', function (req, res) {
		req.session.data['page2'] = false
		res.redirect(v + '/lots-of-apprentices')
	})

	router.get(v + '/lots-of-apprentices-2', function (req, res) {
		req.session.data['page2'] = true
		res.redirect(v + '/lots-of-apprentices')
	})

	router.post(v + '/select-new-apprentices', function (req, res) {
		req.session.data['total'] = 0
		if (req.session.data['apprentice1']) {
			req.session.data['total'] = req.session.data['total'] + 2000
		}
		if (req.session.data['apprentice2']) {
			req.session.data['total'] = req.session.data['total'] + 1500
		}
		if (req.session.data['apprentice3']) {
			req.session.data['total'] = req.session.data['total'] + 2000
		}
		req.session.data['totalPay'] = numberWithCommas(req.session.data['total'])
		if (req.session.data['apprentice1'] === undefined && req.session.data['apprentice2'] === undefined && req.session.data['apprentice3'] === undefined) {
			req.session.data['error-select-apprentices'] = true
			res.redirect(v + '/select-new-apprentices')
		}
		else {
			req.session.data['error-select-apprentices'] = false
			res.redirect(v + '/check-answers')
		}
	})

	router.post(v + '/sign-agreement', function (req, res) {
		req.session.data['saved-application'] = false
		req.session.data['saved-at-terms'] = false
		req.session.data['lots'] = false
		if (req.session.data['already-applied'] === true) {
			res.redirect(v + '/confirmation')
		}
		else {
			res.redirect(v + '/bank-details-needed')
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
		req.session.data['agreement-needed'] = false
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
		req.session.data['bank-incomplete'] = true
		req.session.data['already-applied'] = false
		res.redirect(v + '/account-home')
	})

	router.get(v + '/account-no-agreement', function (req, res) {
		req.session.data['agreement-needed'] = true
		res.redirect(v + '/account-home')
	})

	router.get(v + '/account-bank-needed', function (req, res) {
		req.session.data['bank-incomplete'] = true
		res.redirect(v + '/bc/start')
	})

	router.get(v + '/skip-legal', function (req, res) {
		req.session.data['agreement-needed'] = false
		res.redirect(v + '/select-new-apprentices')
	})

	// V1 CHECK ANSWERS

	router.get(v + '/check-answers-lots', function (req, res) {
		req.session.data['lots'] = true
		res.redirect(v + '/check-answers')
	})

	router.get(v + '/check-answers', function (req, res) {
		req.session.apprenticeData = JSON.parse(JSON.stringify(apprentices))
		res.render(vx + '/check-answers', {
			apprenticeData: req.session.apprenticeData,
			data: req.session.data
		});
	})

	// V2 CHECK ANSWERS
	router.post(v + '/check-answers', function (req, res) {
		res.redirect(v + '/sign-agreement')
	})

	router.post(v + '/bank-details-needed', function (req, res) {
		if (req.session.data['bank-now'] === 'yes') {
			res.redirect(v + '/bc/start')
		}
		if (req.session.data['bank-now'] === 'no') {
			req.session.data['bank-incomplete'] = true
			res.redirect(v + '/need-bank-information')
		}
	})

	router.get(v + '/complete-all', function (req, res) {
		req.session.data['bank-incomplete'] = false
		req.session.data['bank-details'] = true
		req.session.data['bank-skipped'] = false
		req.session.data['already-applied'] = true
		res.redirect(v + '/bc/complete')
	})
}