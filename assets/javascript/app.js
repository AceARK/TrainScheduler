// Initializing Firebase
var config = {
    apiKey: "AIzaSyD50yT5YrZ0OMUPJhX0hv7pXuC3e7byyWg",
    authDomain: "trainschedulerapp.firebaseapp.com",
    databaseURL: "https://trainschedulerapp.firebaseio.com",
    storageBucket: "trainschedulerapp.appspot.com",
    messagingSenderId: "492025754925"
  };

firebase.initializeApp(config);
// Getting reference for firebase database
var database = firebase.database();

var provider = new firebase.auth.GithubAuthProvider();

var allTrains = [];

var interval;

$("#signOut").hide();

$("#signInWithGithub").on("click", function(){

	firebase.auth().signInWithPopup(provider).then(function(result) {
		console.log("Entering sign in window.");
	  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  // ...
	}).catch(function(error) {
		console.log("Entering error sign in.");

	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  console.log("Error - " + errorCode + "  " + errorMessage + "  " + email + "  " + credential);

	  $("#signOut").show();
	  $("#signInWithGoogle, #signInWithGithub").hide();

	  // Observer on Auth to see if user has really been signed in
	  var user = firebase.auth().currentUser;

		if (user) {
		  console.log("User signed in.");
		} else {
		  console.log("User hasn't been signed in.");
		}

		// Getting provider-specific user info
		var user = firebase.auth().currentUser;

			if (user != null) {
			  user.providerData.forEach(function (profile) {
			    console.log("Sign-in provider: "+profile.providerId);
			    console.log("  Provider-specific UID: "+profile.uid);
			    console.log("  Name: "+profile.displayName);
			    console.log("  Email: "+profile.email);
			    console.log("  Photo URL: "+profile.photoURL);
			  });
			}

	});
});

$("#signOut").on("click", function() {
	firebase.auth().signOut().then(function() {
	  alert("Signed out successfully.");
	}, function(error) {
	  console.log("Error signing out.");
	});

	$("#signOut").hide();
	$("#signInWithGoogle, #signInWithGithub").show();
})

$("#firstTrainTime").on("blur", function() {
	if($("#firstTrainTime").val() !== "") {
		var regExp = new RegExp($("#firstTrainTime").attr('pattern'));
		var value = $("#firstTrainTime").val();
		if(!regExp.test(value)) {
			$(this).addClass("remove-default").addClass("wrong-format");
		}else {
			$(this).removeClass("remove-default").removeClass("wrong-format");
		}
	}
	else{
		$(this).removeClass("remove-default").removeClass("wrong-format");
	}
});

// On button click to add new train
$("#addTrain").on("click", function(event) {
	event.preventDefault();

	var regExp = new RegExp($("#firstTrainTime").attr('pattern'));
	var value = $("#firstTrainTime").val();
	if(!regExp.test(value)) {
		$("#firstTrainTime").toggleClass("wrong-format");
		alert("Wrong format entered. Enter HH:mm military format.");
		return;
	}else {

		// Capture input values in variables
		var trainName = $("#trainName").val().trim();
		var destination = $("#destination").val().trim();
		var startTime = $("#firstTrainTime").val().trim();
		var frequency = $("#frequency").val().trim();
		console.log("Data captured from input field " +trainName + destination + startTime + frequency);

		// Creating an object with variables
		var newTrain = {
			trainName: trainName,
			destination: destination,
			startTime: startTime,
			frequency: frequency
		};

		// Adding information to database
		database.ref().push(newTrain);

		console.log("New Train Details");
		console.log(newTrain.trainName);
		console.log(newTrain.destination);
		console.log(newTrain.startTime);
		console.log(newTrain.frequency);

		// Inform user of new train addition
		alert("New train successfully added");

		// Clear all input fields 
		$("#trainName").val("");
		$("#destination").val("");
		$("#firstTrainTime").val("");
		$("#frequency").val("");

	}

});

function updateUIWithData(childSnapshotVal,key) {
	
		var trainName = childSnapshotVal.trainName;
		var destination = childSnapshotVal.destination;
		var frequency = childSnapshotVal.frequency;
		// Ensuring that the start time has not passed by
		var startTime = childSnapshotVal.startTime;

		var startTimeCalculated = moment(startTime, "HH:mm").subtract(1, "years");

		// // Getting current time
		var currentTime = moment();
	
		// // Total minutes = current time - start time
		var totalMinutesPast = moment().diff(moment(startTimeCalculated), "minutes");
	
		var moduloRemainder = totalMinutesPast % frequency;
	
		var minutesToArrival = frequency - moduloRemainder;
		
		var nextArrivalTime = moment().add(minutesToArrival, "minutes");

		$("#tableBody").append("<tr id='"+ key +"'><td><input type='text' class='name' value='" + trainName + "'></td><td><input type='text' class='destination' value='" + destination + "'></td><td>" + frequency + "</td><td><input type='text' class='arrivalTime' value='" + moment(nextArrivalTime).format("hh:mm A") + "'></td><td>" + minutesToArrival + "</td><td><button type='submit' class='edit btn btn-danger'>Edit</button><button type='submit' class='update btn btn-danger'>Update</button><button type='submit' class='remove btn btn-danger'>Remove</button><button class='undoEditClick btn btn-danger'>x</button></td></tr>");
		$("td> input").attr('disabled', true).addClass('non-editable');
		$(".update, .remove, .undoEditClick").hide();
}

$("#tableBody").on("click", ".update", function() {
	var currentKey = $(this).parent().parent().attr('id');
	var updatedTrainName = $(this).parent().parent().find("td> .name").val();
	var updatedDestination = $(this).parent().parent().find("td> .destination").val();
	var updatedArrivalTime = $(this).parent().parent().find("td> .arrivalTime").val();

	var dataUpdates = {
		trainName: updatedTrainName,
		destination: updatedDestination,
		startTime: updatedArrivalTime
	}

	database.ref("/"+currentKey).update(dataUpdates);

});

database.ref().on("value", function(snapshot) {
	
	console.log("Entering on value function : "+JSON.stringify(snapshot.val()));

	var json_data = snapshot.val();
	allTrains = [];
	for(var i in json_data) {
		allTrains.push([i, json_data [i]]);
	}


	$("#tableBody").empty();
	 allTrains.forEach(function(snapshotData) {
    	updateUIWithData(snapshotData[1],snapshotData[0]);
	 });

	 interval = setInterval(updateUIEveryMinute, 60000);

});

$("#tableBody").on("click", ".remove", function() {
	var currentKey = $(this).parent().parent().attr('id');

	database.ref("/"+currentKey).remove();

});

// To Do -
// Change alert to something else (modal etc)
// Authentication of accounts. 
// Admin users sign in using Github/Google. Other users cannot edit/add trains.


$("#tableBody").on("click", ".edit", function() {
	console.log("Entering Edit button click function.");
	var currentArrivalTime = $(this).parent().parent().find("td> .arrivalTime").val();
	console.log("Finding parent of parent of this " + $(this).parent().parent().find("td> input"));
	$(this).parent().parent().find("td> input").attr('disabled', false).removeClass('non-editable');
	console.log(moment(currentArrivalTime, "HH:mm A").format("HH:mm:ss"));
	formattedToDisplayTime = moment(currentArrivalTime, "HH:mm A").format("HH:mm");
	$(this).parent().parent().find("td> .arrivalTime").attr('value', formattedToDisplayTime);
	$(this).parent().parent().find("td> .arrivalTime").attr('type','time');
	$(this).hide();
	$(this).parent().parent().find(".update, .remove, .undoEditClick").show();
	clearInterval(interval);

});

$("#tableBody").on("click", ".undoEditClick", function() {
	updateUIEveryMinute();
});


function updateUIEveryMinute() {
	$("#tableBody").empty();
	allTrains.forEach(function(snapshotData) {
    	updateUIWithData(snapshotData[1],snapshotData[0]);
	});
}