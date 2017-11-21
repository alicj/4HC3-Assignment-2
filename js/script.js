var prevState = "";
// var curState = "begin-1a";
var curState = "main-5a";
var accountNumber = 12345678910;
var passcode = 1234;
var balance = 1255
var errorTime = 0;

function nextState(s, time=400){
	var page = s;

	$("."+curState).hide();

	if (s == "error-3a") {
		$(".error-time").html(3 - errorTime);
		// if errorTime
	}

	if (time > 0) {
		$(".wait").show();
	}

	setTimeout(function(){
		$(".wait").hide();
		$("."+s).show();
		prevState = curState;
		curState = s;

	}, time);

}

function askReceipt(){
	// display "do you want receipt screen"
	// yes -> print receipt, call askMoreService
	// no -> call askMoreService
}

function askMoreService(){
	// display "do you want to perform another action"
	// yes "go back to main-5a"
	// no -> exit, show thank you screen
}

function getInputInt(selector) {
	var input = parseInt($(selector).val());
	$(selector).val("");
		console.log(input)

	if (input <= 0 || isNaN(input)) {
		return -1;
	}
	return input;
}

$(document).ready(function() {
	nextState(curState, 0)
});

$(document).on('click', '.homeBtn', function(event) {
	event.preventDefault();
	$("input").val("");
	// TODO: need to eject card at certain state
	var l = curState.split("-");
	var n = parseInt(l[l.length - 1]);
	if (n < 5 || n == 17) {
		nextState("begin-1a", 0);
	}else {
		nextState("main-5a", 0);
	}
});

$(document).on('click', '.backBtn', function(event) {
	event.preventDefault();
	$("input").val("");
	// TODO: need to eject card at certain state
	if ($.inArray(curState, ["account-number-2c",
							 "passcode-4a"]) >= 0) { prevState = "signin-2a";}
	if ($.inArray(curState, ["account-balance-15a",
							 "withdraw-amount-6a",
							 "deposit-amount-10a",
							 "transfer-amount-11a"]) >= 0) { prevState = "main-5a";}
	nextState(prevState);
});

$(document).on('click', '#swipe-card', function(event) {
	if (curState == "swipe-2d") {
		nextState("passcode-4a");
	} else {
		// display error
	}
});

$(document).on('click', '#insert-card', function(event) {
	if (curState == "insert-2b") {
		nextState("passcode-4a");
	} else {
		// display error
	}
});

$(document).on('click', '#take-card', function(event) {
	if (curState == "login-success-4b") {
		nextState("main-5a", 0);
	}
});

$(document).on('click', '#put-money', function(event) {

});

$(document).on('click', '#take-money', function(event) {
	if (curState == "withdraw-success-7b") {
		nextState("main-5a");
	}
});

$(document).on('click', '.begin-1a', function(event) {
	console.log(event);
	console.log(event.target.tagName)
	if ($.inArray(event.target.tagName, ["SELECT", "OPTION"]) > -1) {return};
	nextState("signin-2a", 0);
	$(".homeBtn").show();
});

$(document).on('click', '.to-insert-card', function(event) {
	nextState("insert-2b", 0);
});

$(document).on('click', '.to-enter-account-number', function(event) {
	nextState("account-number-2c", 0);
});

$(document).on('click', '.to-swipe-card', function(event) {
	nextState("swipe-2d", 0);
});

$(document).on('click', '.input-account-number', function(event) {
	event.preventDefault();
	var input = getInputInt("#account-number");
	if (input < 0) {return;}

	if(input != accountNumber){
		// errorTime += 1
		// if (errorTime >= 3) {
		// 	nextState("max-error-3b");
		// 	$(".backBtn").hide();
		// 	return;
		// }
		nextState("account-error-3c");
		return;
	}

	nextState("passcode-4a");
});

$(document).on('click', '.log-in', function(event) {
	event.preventDefault();
	var input = getInputInt("#passcode");
	if (input < 0) {return;}

	$("#passcode").val("")
	if (input == passcode){
		errorTime = 0;
		nextState("login-success-4b");
	}else{
		errorTime += 1;
		if (errorTime >= 3) {
			nextState("max-error-3b");
			$(".backBtn").hide();
			return;
		}
		nextState("error-3a")
	}
});


$(document).on('click', '.withdraw', function(event) {
	event.preventDefault();
	nextState("withdraw-amount-6a");
});

$(document).on('click', '.deposit', function(event) {
	event.preventDefault();
	nextState("deposit-amount-10a");
});

$(document).on('click', '.transfer', function(event) {
	event.preventDefault();
	nextState("withdraw-amount-6a");
});

$(document).on('click', '.enter-amount', function(event) {
	event.preventDefault();
	var input = getInputInt("#amount");
	if (input < 0) {return;}

	if(curState == "withdraw-amount-6a") {
		$(".action").html("withdraw")
		if (input > balance) {
			nextState("withdraw-fail-7a");
		}else {
			balance -= input;
			nextState("withdraw-success-7b");
		}
	} else if (curState == "deposit-amount-10a") {
		// add random chance that deposit will fail because of fake money
		$(".action").html("deposit")
		balance += input;
		nextState("deposit-success-10b");
	} else if (curState == "transfer-amount-11a") {
		$(".action").html("transfer")

	}
});

$(document).on('click', '.check-balance', function(event) {
	event.preventDefault();
	nextState("account-balance-15a");
});

$(document).on('click', '.historyBtn', function(event) {
	event.preventDefault();
	nextState("trans-history-16a");
	// $(".historyBtn").hide();
});

$(document).on('click', '.sign-out', function(event) {
	event.preventDefault();
	nextState("sign-out-17a");
	setTimeout(function(){
		nextState("begin-1a")
	}, 5000);
});