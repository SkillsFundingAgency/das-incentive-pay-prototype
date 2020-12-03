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
		req.session.myData.apprenticesavailable = 300
		req.session.myData.apprenticesapplied = 6
		req.session.myData.mvs = "nonmvs"
		req.session.myData.closing = "false"
		req.session.myData.page = 1
		
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
        req.session.myData.closing =  req.query.closing || req.session.myData.closing
        req.session.myData.page =  req.query.page || req.session.myData.page
		
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
	

	// Select org - for hub
	router.get(v + '/select-legal-entity-hub', function (req, res) {
        res.render(vx + '/select-legal-entity-hub', {
            myData: req.session.myData
        });
    });
    router.post(v + '/select-legal-entity-hub', function (req, res) {
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
            res.render(vx + '/select-legal-entity-hub', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.selectLegalEntityAnswer = req.session.myData.selectLegalEntityAnswerTemp
            req.session.myData.selectLegalEntityAnswerTemp = ''
			res.redirect(301, v + '/hub/home');
        }
	});
	
	// Select org - for view payments
	router.get(v + '/select-legal-entity-view-payments', function (req, res) {
        res.render(vx + '/select-legal-entity-hub', {
            myData: req.session.myData
        });
    });
    router.post(v + '/select-legal-entity-view-payments', function (req, res) {
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
            res.render(vx + '/select-legal-entity-view-payments', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.selectLegalEntityAnswer = req.session.myData.selectLegalEntityAnswerTemp
            req.session.myData.selectLegalEntityAnswerTemp = ''
			res.redirect(301, v + '/hub/view-payments');
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
                "message": "Select yes if you’ve taken on new apprentices who started their contract of employment between 1 August 2020 and 31 March 2021"
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
					res.redirect(v + '/select-new-apprentices')
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
		
		req.session.myData.page = req.query.page || req.session.myData.page

		req.session.myData.availableApprentices = []
		var _count = 0
		req.session.myData.apprentices2.forEach(function(_apprentice, index) {
			if(_apprentice.applied == false && _count < req.session.myData.apprenticesavailable){
				req.session.myData.availableApprentices.push(_apprentice)
				_count++
			}
		});

        res.render(vx + '/select-new-apprentices', {
            myData: req.session.myData
        });
	});
	// TO DO - improve
	router.post(v + '/select-new-apprentices', function (req, res) {

		req.session.myData.selectNewApprenticesAnswerTemp = req.body.apprentices
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.selectNewApprenticesAnswerTemp = req.session.myData.selectNewApprenticesAnswerTemp || "1"
		}
        if(req.session.myData.selectNewApprenticesAnswerTemp == "_unchecked"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.selectNewApprenticesAnswer = {
                "anchor": "apprentice-1",
                "message": "Select the apprentices you want to apply for"
            }
		}
		
		if(req.session.myData.validationError == "true") {
            res.render(vx + '/select-new-apprentices', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.selectNewApprenticesAnswer = req.session.myData.selectNewApprenticesAnswerTemp
			req.session.myData.selectNewApprenticesAnswerTemp = ''

            req.session.myData.selectedApprentices = []
            req.session.myData.selectedApprenticesTotalAmount = 0
			req.session.myData.apprentices2.forEach(function(_apprentice, index) {
				if(req.session.myData.selectNewApprenticesAnswer.indexOf(_apprentice.id.toString()) != -1){
                    req.session.myData.selectedApprentices.push(_apprentice)
                    req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmount + _apprentice.amount
				}
            });
            req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			res.redirect(v + '/check-answers')
		}
	})

	// Apply - check answers
	router.get(v + '/check-answers', function (req, res) {
		res.render(vx + '/check-answers', {
			myData: req.session.myData
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
		req.session.myData.vrf = "inprogress"
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
		req.session.myData.apprenticesapplied = req.session.myData.apprenticesavailable
		res.render(vx + '/confirmation', {
			myData: req.session.myData
		});
	});

	// View applications
	router.get(v + '/hub/view-payments', function (req, res) {
		res.render(vx + '/hub/view-payments', {
			myData: req.session.myData
		});
	});

	// Remove application
	router.get(v + '/hub/remove-apprentice', function (req, res) {
		res.render(vx + '/hub/remove-apprentice', {
			myData: req.session.myData
		});
	});
	// Remove application - check answers
	router.get(v + '/hub/confirmation', function (req, res) {
		res.render(vx + '/hub/confirmation', {
			myData: req.session.myData
		});
	});
	// Remove application - removed
	router.get(v + '/hub/removed', function (req, res) {
		req.session.myData.removedapplication = true
		res.render(vx + '/hub/removed', {
			myData: req.session.myData
		});
	});


}