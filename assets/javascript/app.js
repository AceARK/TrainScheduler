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

// On button click to add new train
$("#addTrain").on("click", function(event) {
	event.preventDefault();

	// Capture input values in variables
	var trainName = $("#trainName").val().trim();
	var destination = $("#destination").val().trim();
	var startTime = moment($("#firstTrainTime").val().trim()).format('hh:mm');
	var frequency = moment($("#frequency").val().trim()).format('mm');
	console.log("received values");
	console.log(trainName + destination + startTime + frequency);

	// Creating an object with variables
	var newTrain = {
		trainName: trainName,
		destination: destination,
		startTime: startTime,
		frequency: frequency
	};

	// Adding information to database
	database.ref().push(newTrain);

	// Inform user of new train addition
	alert("New train successfully added");

	// Clear all input fields 
	$("#trainName").val("");
	$("#destination").val("");
	$("#firstTrainTime").val("");
	$("#frequency").val("");

	// return false;
});

database.ref().on("child_added", function(childSnapshot) {
	console.log(childSnapshot.val());

	var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().destination;
	var frequency = childSnapshot.val().frequency;
	// Ensuring that the start time has not passed by
	var startTime = moment(childSnapshot.val().startTime).subtract(1, "years");
	console.log(startTime);

	// Getting current time
	var currentTime = moment().format();
	console.log(currentTime);

	// Total minutes = current time - start time
	var totalMinutesPast = moment(startTime).diff(currentTime, "minutes");
	console.log(totalMinutesPast);

	// Calculating minutesAway and nextArrivalTime
	// remainder = total minutes % frequency
	var moduloRemainder = totalMinutesPast % frequency;
	// minutesAway = frequency - remainder
	var minutesToArrival = frequency - moduloRemainder;
	// nextArrivalTime = current time + minutesAway
	var nextArrivalTime = moment().add(minutesToArrival, "minutes");

	$("#trainSchedule> tbody").append("<tr><td>" + trainName + "<td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrivalTime + "</td><td>" + minutesToArrival + "</td></tr>");
});