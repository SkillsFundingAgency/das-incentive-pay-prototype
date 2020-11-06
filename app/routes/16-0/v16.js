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
		req.session.myData.vrf = "notadded"
		req.session.myData.apprenticesavailable = 6
		req.session.myData.apprenticesapplied = 6
		req.session.myData.mvs = "nonmvs"
		
    }

    // Every GET and POST
    router.all(v + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
		}

		//version
		req.session.myData.version = vx

		// Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrors = {}
        req.session.myData.validationError = "false"
        req.session.myData.includeValidation =  req.query.includeValidation || req.session.myData.includeValidation

		//defaults for setup
        req.session.myData.legalagreement =  req.query.legal || req.session.myData.legalagreement
        req.session.myData.vrf =  req.query.vrf || req.session.myData.vrf
        req.session.myData.apprenticesavailable =  req.query.apprentices || req.session.myData.apprenticesavailable
        req.session.myData.apprenticesapplied =  req.query.applied || req.session.myData.apprenticesapplied
        req.session.myData.mvs =  req.query.mvs || req.session.myData.mvs
		
        next()
	});
	
	// Prototype setup
    router.get(v + '/setup', function (req, res) {
        res.render(vx + '/setup', {
            myData:req.session.myData
        });
	});

	// Account - home
    router.get(v + '/account-home', function (req, res) {
        res.render(vx + '/account-home', {
            myData:req.session.myData
        });
	});

	// Hub - home
    router.get(v + '/hub/home', function (req, res) {
        res.render(vx + '/hub/home', {
            myData:req.session.myData
        });
	});

	// Apply - start
    router.get(v + '/guidance', function (req, res) {
        res.render(vx + '/guidance', {
            myData:req.session.myData
        });
	});

	// Apply - choose org
    router.get(v + '/select-legal-entity', function (req, res) {
        res.render(vx + '/select-legal-entity', {
            myData: req.session.myData
        });
    });
    router.post(v + '/select-legal-entity', function (req, res) {
        req.session.myData.selectLegalEntityAnswerTemp = req.body.selectLegalEntityAnswer
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.selectLegalEntityAnswerTemp = req.session.myData.selectLegalEntityAnswerTemp || "ABC LTD"
        }
        if(!req.session.myData.selectLegalEntityAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.selectLegalEntityAnswer = {
                "anchor": "selectLegalEntity-1",
                "message": "Select an organisation"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(vx + '/select-legal-entity', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.selectLegalEntityAnswer = req.session.myData.selectLegalEntityAnswerTemp
            req.session.myData.selectLegalEntityAnswerTemp = ''
			res.redirect(301, v + '/taken-on-new-apprentices');
        }
    });

	// Apply - taken-on-new-apprentices
    router.get(v + '/taken-on-new-apprentices', function (req, res) {
        res.render(vx + '/taken-on-new-apprentices', {
            myData: req.session.myData
        });
    });
    router.post(v + '/taken-on-new-apprentices', function (req, res) {
        req.session.myData.takenOnNewApprenticesAnswerTemp = req.body.takenOnNewApprenticesAnswer
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.takenOnNewApprenticesAnswerTemp = req.session.myData.takenOnNewApprenticesAnswerTemp || "ABC LTD"
        }
        if(!req.session.myData.takenOnNewApprenticesAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.takenOnNewApprenticesAnswer = {
                "anchor": "takenOnNewApprentices-1",
                "message": "Select yes if you’ve taken on new apprentices who started their contract of employment between 1 August 2020 and 31 January 2021"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(vx + '/taken-on-new-apprentices', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.takenOnNewApprenticesAnswer = req.session.myData.takenOnNewApprenticesAnswerTemp
			req.session.myData.takenOnNewApprenticesAnswerTemp = ''

			// NO
			if(req.session.myData.takenOnNewApprenticesAnswer == "no"){
				res.redirect(v + '/shutter/no-new-apprentices')
			} else {
			//YES
				if(req.session.myData.legalagreement == "false"){
					res.redirect(v + '/shutter/legal-agreement')
				} else {
					if(req.session.myData.apprenticesavailable > 100){
						res.redirect(v + '/filter-by-start-date')
					} else {
						res.redirect(v + '/select-new-apprentices')
					}
				}
			}

        }
	});
	
	// Apply - shutter - no new apprentices
    router.get(v + '/shutter/no-new-apprentices', function (req, res) {
        res.render(vx + '/shutter/no-new-apprentices', {
            myData: req.session.myData
        });
	});
	
	// Apply - shutter - legal agreement
    router.get(v + '/shutter/legal-agreement', function (req, res) {
        res.render(vx + '/shutter/legal-agreement', {
            myData: req.session.myData
        });
    });
	
	// Apply - select-new-apprentices - small list
    router.get(v + '/select-new-apprentices', function (req, res) {
        res.render(vx + '/select-new-apprentices', {
            myData: req.session.myData
        });
	});
	// TO DO - improve
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

	// Apply - select-new-apprentices - long list - select date
	router.get(v + '/filter-by-start-date', function (req, res) {
        res.render(vx + '/filter-by-start-date', {
            myData: req.session.myData
        });
	});
	// Apply - select-new-apprentices - long list
	router.get(v + '/select-apprentice-to-apply-for', function (req, res) {
        res.render(vx + '/select-apprentice-to-apply-for', {
            myData: req.session.myData
        });
	});

	// Apply - check answers
	router.get(v + '/check-answers', function (req, res) {
		// TO DO - improve req.session.apprenticeData
		req.session.apprenticeData = JSON.parse(JSON.stringify(apprentices))
		res.render(vx + '/check-answers', {
			myData: req.session.myData,
			apprenticeData: req.session.apprenticeData,
			data: req.session.data
		});
	})
	router.post(v + '/check-answers', function (req, res) {
		res.redirect(v + '/sign-agreement')
	})

	// Apply - sign declaration
    router.get(v + '/sign-agreement', function (req, res) {
        res.render(vx + '/sign-agreement', {
            myData: req.session.myData
        });
	});
	router.post(v + '/sign-agreement', function (req, res) {
		if(req.session.myData.vrf == "notadded"){
			res.redirect(v + '/bank-details-needed')
		} else {
			res.redirect(v + '/confirmation')
		}
	})

	// Bank details - needed
	router.get(v + '/bank-details-needed', function (req, res) {
        res.render(vx + '/bank-details-needed', {
            myData: req.session.myData
        });
	});
	router.post(v + '/bank-details-needed', function (req, res) {
		if (req.body["bank-now"] === 'yes') {
			res.redirect(v + '/bc/start')
		} else {
			res.redirect(v + '/need-bank-information')
		}
	})
	// Bank details - start
	router.get(v + '/bc/start', function (req, res) {
        res.render(vx + '/bc/start', {
            myData: req.session.myData
        });
	});
	// Bank details - contact info
	router.get(v + '/bc/contact-information', function (req, res) {
        res.render(vx + '/bc/contact-information', {
            myData: req.session.myData
        });
	});
	// Bank details - organisation info
	router.get(v + '/bc/organisation-information', function (req, res) {
        res.render(vx + '/bc/organisation-information', {
            myData: req.session.myData
        });
	});
	// Bank details - bank account info
	router.get(v + '/bc/bank-acc', function (req, res) {
        res.render(vx + '/bc/bank-acc', {
            myData: req.session.myData
        });
	});
	// Bank details - complete
	router.get(v + '/bc/complete', function (req, res) {
        res.render(vx + '/bc/complete', {
            myData: req.session.myData
        });
	});

	// Application saved (still need bank information)
	router.get(v + '/need-bank-information', function (req, res) {
		res.render(vx + '/need-bank-information', {
			myData: req.session.myData
		});
	});
	// Application complete
	router.get(v + '/confirmation', function (req, res) {
		res.render(vx + '/confirmation', {
			myData: req.session.myData
		});
	});














	// OLD
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
	// V1 CHECK ANSWERS
	router.get(v + '/check-answers-lots', function (req, res) {
		req.session.data['lots'] = true
		res.redirect(v + '/check-answers')
	})
}