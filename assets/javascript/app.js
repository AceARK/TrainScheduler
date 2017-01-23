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

var allTrains = [];

// var dummyTrainName = {
// 	trainName: "dummyTrain",
// 	destination: "",
// 	startTime: 0,
// 	frequency: ""
// }; 

// database.ref("/dummy").push(dummyTrainName);

// On button click to add new train
$("#addTrain").on("click", function(event) {
	event.preventDefault();

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

	// return false;
});

function updateUIWithData(childSnapshotVal) {
	
		var trainName = childSnapshotVal.trainName;
		var destination = childSnapshotVal.destination;
		var frequency = childSnapshotVal.frequency;
		// Ensuring that the start time has not passed by
		var startTime = childSnapshotVal.startTime;

		var startTimeCalculated = moment(startTime, "HH:mm").subtract(1, "years");
		// console.log(startTimeCalculated);

		// // Getting current time
		var currentTime = moment();
		// console.log("MOMENT: " + currentTime);
		// console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

		// // Total minutes = current time - start time
		var totalMinutesPast = moment().diff(moment(startTimeCalculated), "minutes");
		// console.log("DIFFERENCE IN MINS: "+ totalMinutesPast);

		// // Calculating minutesAway and nextArrivalTime
		// // remainder = total minutes % frequency
		var moduloRemainder = totalMinutesPast % frequency;
		// console.log("REMAINDER: " + moduloRemainder);
		// // minutesAway = frequency - remainder
		var minutesToArrival = frequency - moduloRemainder;
		// console.log("MINUTES AWAY: " + minutesToArrival);
		// // nextArrivalTime = current time + minutesAway
		var nextArrivalTime = moment().add(minutesToArrival, "minutes");
		// console.log("WITHOUT FORMAT: " + nextArrivalTime);
		// console.log("NEXT ARRIVAL TIME: " + moment(nextArrivalTime).format("HH:mm A"));
		$("#trainSchedule> tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrivalTime).format("hh:mm A") + "</td><td>" + minutesToArrival + "</td></tr>");

}

database.ref().on("child_added", function(childSnapshot) {
	console.log("Child snapshot "+JSON.stringify(childSnapshot.val()));
	updateUIWithData(childSnapshot.val());
	if(! allTrains.includes(childSnapshot.val())) {
		allTrains.push(childSnapshot.val());
	}
});

var interval = setInterval(executeUIUpdateLogicEverySecond, 60000);

function executeUIUpdateLogicEverySecond() {
	$("#trainSchedule> tbody").empty();
	allTrains.forEach(function(element) {
    	updateUIWithData(element);
	});
}