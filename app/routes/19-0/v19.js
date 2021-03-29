// Routes for v16
var v = '/v19';
var vx = 'v19';
var apprentices = require('../../data/apprentices.json');

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function (router,_myData) {

	function reset(req){
		req.session.myData = JSON.parse(JSON.stringify(_myData))
		
		// Default setup
		req.session.myData.legalagreement = "true"
		req.session.myData.legalagreement2 = "true"
		req.session.myData.vrf = "notadded"
		req.session.myData.apprenticesavailable = 300
		req.session.myData.apprenticesapplied = 0
		req.session.myData.mvs = "nonmvs"
		req.session.myData.closing = "true"
        req.session.myData.datedropout = "no"
		req.session.myData.compliance = "dates"
        req.session.myData.page = 1
		req.session.myData.filters = "true"
		
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
        req.session.myData.legalagreement2 =  req.query.legal2 || req.session.myData.legalagreement2
        req.session.myData.vrf =  req.query.vrf || req.session.myData.vrf
        req.session.myData.apprenticesavailable =  req.query.apprentices || req.session.myData.apprenticesavailable
        req.session.myData.apprenticesapplied =  req.query.applied || req.session.myData.apprenticesapplied
        req.session.myData.mvs =  req.query.mvs || req.session.myData.mvs
        req.session.myData.closing =  req.query.closing || req.session.myData.closing
        req.session.myData.datedropout =  req.query.datedropout || req.session.myData.datedropout
        req.session.myData.compliance =  req.query.compliance || req.session.myData.compliance
        req.session.myData.page =  req.query.page || req.session.myData.page
        req.session.myData.declaration =  req.query.declaration || ""
        req.session.myData.filters =  req.query.filters || req.session.myData.filters

        // Sort default applied apprentices
        if(req.session.myData.appliedApprenticesSet == false){
            req.session.myData.appliedApprenticesSet = true
            req.session.myData.apprentices2.forEach(function(_apprentice, index) {
                if(req.session.myData.apprenticesapplied == 6){
                    //set custom set

                    //   "id": 229,
                    //   "name": "Pauline Fowler",

                    //   "id": 301,
                    //   "name": "Corina Carver",

                    //   "id": 302,
                    //   "name": "Jack Roberts",

                    //   "id": 303,
                    //   "name": "Jas Johal",

                    //   "id": 139,
                    //   "name": "Joaquim Pinto",

                    //   "id": 304,
                    //   "name": "John Peters",

                    //   "id": 305,
                    //   "name": "Michael Johnson",

                    //   "id": 306,
                    //   "name": "Steven Smith",

                    //   "id": 299,
                    //   "name": "Yi Chen",

                    // "id": 287,
                    // "name": "Timothy Steward",

                    // "id": 286,
                    // "name": "Timothy Jones",

                    // "id": 270,
                    // "name": "Stephen Knight",

                    // "id": 282,
                    // "name": "Terry Laughton",

                    // "id": 284,
                    // "name": "Thomas Woodman",

                    // "id": 280,
                    // "name": "Susan Wood",

                    if([301,302,303,139,304,305,306,229,299,287,286,270,282,284,280].includes(_apprentice.id)){
                        _apprentice.applied2 = true
                    }
                } else if(req.session.myData.apprenticesapplied == 300){
                    //set all
                    _apprentice.applied2 = true
                } else {
                    //set none
                    _apprentice.applied2 = false
                }
            });
        }

        //Set removable apprentices
        req.session.myData.removableApprentices = []
		req.session.myData.apprentices2.forEach(function(_apprentice, index) {
			if(_apprentice.applied2 == true && _apprentice.status != "rejected" && _apprentice.status != "cancelled" && (_apprentice.secondpayment != "paid")){
				req.session.myData.removableApprentices.push(_apprentice)
			}
        });

        //Set available apprentices
        req.session.myData.availableApprentices = []
		var _count = 0
		req.session.myData.apprentices2.forEach(function(_apprentice, index) {
			if(_apprentice.applied2 == false && _count < req.session.myData.apprenticesavailable){
				req.session.myData.availableApprentices.push(_apprentice)
				_count++
			}
		});

        //Set default selected apprentices (for deep links to work)
        req.session.myData.defaultSelectedApprentices = []
        req.session.myData.apprentices2.forEach(function(_apprentice, index) {
            if (index < 3) {
                req.session.myData.defaultSelectedApprentices.push(_apprentice)
            }
        });
		
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
			res.redirect(301, v + '/guidance');
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
            req.session.myData.takenOnNewApprenticesAnswerTemp = req.session.myData.takenOnNewApprenticesAnswerTemp || "yes"
        }
        if(!req.session.myData.takenOnNewApprenticesAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.takenOnNewApprenticesAnswer = {
                "anchor": "takenOnNewApprentices-1",
                "message": "Select yes if you have apprentices who are eligible for the payment"
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
    // Apply - shutter - legal agreement 2
    router.get(v + '/shutter/legal-agreement-2', function (req, res) {
        res.render(vx + '/shutter/legal-agreement-2', {
            myData: req.session.myData
        });
    });

    // Apply - shutter - cannot-apply
	router.get(v + '/shutter/cannot-apply', function (req, res) {
        res.render(vx + '/shutter/cannot-apply', {
            myData: req.session.myData
        });
	});
    // Apply - shutter - cannot-apply-2
	router.get(v + '/shutter/cannot-apply-2', function (req, res) {
        res.render(vx + '/shutter/cannot-apply-2', {
            myData: req.session.myData
        });
	});
    // Apply - shutter - cannot-apply-3
	router.get(v + '/shutter/cannot-apply-3', function (req, res) {
        res.render(vx + '/shutter/cannot-apply-3', {
            myData: req.session.myData
        });
	});
	
	// Apply - select-new-apprentices - small list
    router.get(v + '/select-new-apprentices', function (req, res) {
		
		req.session.myData.page = req.query.page || req.session.myData.page

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
            req.session.myData.selectedApprenticesTotalAmountNumber = 0
            req.session.myData.selectedApprenticesTotalAmount = 0
			req.session.myData.apprentices2.forEach(function(_apprentice, index) {
				if(req.session.myData.selectNewApprenticesAnswer.indexOf(_apprentice.id.toString()) != -1){
                    _apprentice.selected = true
                    req.session.myData.selectedApprentices.push(_apprentice)
                    req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmount + _apprentice.amount
                    req.session.myData.selectedApprenticesTotalAmountNumber = req.session.myData.selectedApprenticesTotalAmountNumber + _apprentice.amount
                } else {
                    _apprentice.selected = false
                }
            });
            req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            if(req.session.myData.compliance == "question"){
                res.redirect(v + '/check-answers')
            } else {
                res.redirect(v + '/enter-start-dates')
            }
            
		}
    })
    
    // Apply - enter start dates
	router.get(v + '/enter-start-dates', function (req, res) {
		res.render(vx + '/enter-start-dates', {
			myData: req.session.myData
		});
    })
    router.post(v + '/enter-start-dates', function (req, res) {
        if(req.session.myData.datedropout == "all" || req.session.myData.datedropout == "some"){
            res.redirect(v + '/enter-start-dates-dropout')
        } else {
            res.redirect(v + '/check-answers')
        }
    })
    
    // Apply - enter start dates dropout
	router.get(v + '/enter-start-dates-dropout', function (req, res) {
		res.render(vx + '/enter-start-dates-dropout', {
			myData: req.session.myData
		});
    })
    router.post(v + '/enter-start-dates-dropout', function (req, res) {
        var _selectedApprentices = 0
        req.session.myData.selectedApprentices = req.session.myData.selectedApprentices || []
        req.session.myData.selectedApprentices.forEach(function(_apprentice, index) {
            _selectedApprentices++
        });
        if(req.session.myData.datedropout == "all" || _selectedApprentices == 1){
            req.session.myData.selectedApprentices = []
            req.session.myData.apprentices2.forEach(function(_apprentice, index) {
                _apprentice.selected = false
            })
            res.redirect(v + '/hub/view-payments')
        } else {

            //remove first apprentice from list
            var _toRemoveID = req.session.myData.selectedApprentices[0].id

            if(_selectedApprentices > 2) {
                req.session.myData.selectedApprentices.splice(0, 1);
                req.session.myData.selectedApprentices.splice(1, 1);
            } else {
                req.session.myData.selectedApprentices.splice(0, 1);
            }
            //reset selected or not and total amount
            // req.session.myData.selectedApprenticesTotalAmount = 0
			req.session.myData.apprentices2.forEach(function(_apprentice, index) {
                if(_toRemoveID.toString() == _apprentice.id.toString()){
                    _apprentice.selected = false
                    req.session.myData.selectedApprenticesTotalAmountNumber = req.session.myData.selectedApprenticesTotalAmountNumber - _apprentice.amount
                }
            });
            req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmountNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
        
        var _orgName = req.session.myData.selectLegalEntityAnswer || "ABC LTD"

        req.session.myData.allSelectedEligibleAnswerTemp = req.body.allSelectedEligibleAnswer
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.allSelectedEligibleAnswerTemp = req.session.myData.allSelectedEligibleAnswerTemp || "yes"
        }
        if(!req.session.myData.allSelectedEligibleAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.allSelectedEligibleAnswer = {
                "anchor": "allSelectedEligible-1",
                "message": "Select yes if all of these apprentices joined " + _orgName + " from 1 August 2020"
            }
        }
        if(req.session.myData.validationError == "true" && req.session.myData.compliance == "question") {
            res.render(vx + '/check-answers', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.allSelectedEligibleAnswer = req.session.myData.allSelectedEligibleAnswerTemp
            req.session.myData.allSelectedEligibleAnswerTemp = ''
            
            var _newApprentices = false
            if(req.session.myData.selectedApprentices){
                req.session.myData.selectedApprentices.forEach(function(_apprentice, index) {
                    if(_apprentice.startdate == "February 2021" || _apprentice.startdate == "March 2021"){
                        _newApprentices = true
                    }
                });
            }

			// NO
			if(req.session.myData.allSelectedEligibleAnswer == "no" && req.session.myData.compliance == "question"){
				res.redirect(v + '/not-all-selected-eligible')
			} else {
			//YES
                if(req.session.myData.legalagreement2 == "false" && _newApprentices){
                    res.redirect(v + '/shutter/legal-agreement-2')
                } else {
                    res.redirect(v + '/sign-agreement')
                }
			}

        }
    })
    
    // Apply - not all selected eligible
	router.get(v + '/not-all-selected-eligible', function (req, res) {
		res.render(vx + '/not-all-selected-eligible', {
			myData: req.session.myData
		});
	})

	// Apply - sign declaration
    router.get(v + '/sign-agreement', function (req, res) {
        res.render(vx + '/sign-agreement', {
            myData: req.session.myData
        });
	});
	router.post(v + '/sign-agreement', function (req, res) {

        // set applied apprentices
        req.session.myData.apprentices2.forEach(function(_apprentice, index) {
            if(_apprentice.selected == true){
                _apprentice.applied2 = true
                req.session.myData.apprenticesapplied++
            }
        });

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
			res.redirect(v + '/bc/contact-information')
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
        req.session.myData.page = req.query.page || req.session.myData.page
		res.render(vx + '/hub/remove-apprentice', {
			myData: req.session.myData
		});
    });
	router.post(v + '/hub/remove-apprentice', function (req, res) {

		req.session.myData.removeApprenticesAnswerTemp = req.body.apprentices
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.removeApprenticesAnswerTemp = req.session.myData.removeApprenticesAnswerTemp || "1"
		}
        if(req.session.myData.removeApprenticesAnswerTemp == "_unchecked"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.removeApprenticesAnswer = {
                "anchor": "apprentice-1",
                "message": "Select which apprentices you want to cancel an application for"
            }
		}
		
		if(req.session.myData.validationError == "true") {
            res.render(vx + '/hub/remove-apprentice', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.removeApprenticesAnswer = req.session.myData.removeApprenticesAnswerTemp
			req.session.myData.removeApprenticesAnswerTemp = ''

            req.session.myData.selectedApprentices = []
            req.session.myData.selectedApprenticesTotalAmount = 0
			req.session.myData.apprentices2.forEach(function(_apprentice, index) {
				if(req.session.myData.removeApprenticesAnswer.indexOf(_apprentice.id.toString()) != -1){
                    _apprentice.selected = true
                    req.session.myData.selectedApprentices.push(_apprentice)
                    // req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmount + _apprentice.amount
                } else {
                    _apprentice.selected = false
                }
            });
            // req.session.myData.selectedApprenticesTotalAmount = req.session.myData.selectedApprenticesTotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			res.redirect(v + '/hub/confirmation')
		}
	})
	// Remove application - check answers
	router.get(v + '/hub/confirmation', function (req, res) {
		res.render(vx + '/hub/confirmation', {
			myData: req.session.myData
		});
    });
    router.post(v + '/hub/confirmation', function (req, res) {
        // set cancelled apprentices
        req.session.myData.apprentices2.forEach(function(_apprentice, index) {
            if(_apprentice.selected == true){
                _apprentice.status = "cancelled"
            }
        });
        res.redirect(v + '/hub/removed')
	})
	// Remove application - removed
	router.get(v + '/hub/removed', function (req, res) {
		req.session.myData.removedapplication = true
		res.render(vx + '/hub/removed', {
			myData: req.session.myData
		});
	});


}