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

});

function updateUIWithData(childSnapshotVal) {
	
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
		// Change below line to multiple lines to add each input separately for better manipulation. To add attributes to all input together.
		$("#tableBody").append("<tr><td><input type='text' value='" + trainName + "'></td><td><input type='text' value='" + destination + "'></td><td>" + frequency + "</td><td><input type='text' value='" + moment(nextArrivalTime).format("hh:mm A") + "'></td><td>" + minutesToArrival + "</td><td><button type='submit' class='edit'>Edit</button><button type='submit' class='update'>Update</button><button type='submit' class='remove'>Remove</button></td></tr>");
		$("td> input").attr('disabled', 'true');
		$(".update, .remove").hide();
}

database.ref().on("child_added", function(childSnapshot) {
	console.log("Child snapshot "+JSON.stringify(childSnapshot.val()));
	updateUIWithData(childSnapshot.val());
	if(! allTrains.includes(childSnapshot.val())) {
		allTrains.push(childSnapshot.val());
	}
});

var interval = setInterval(updateUIEveryMinute, 60000);

function updateUIEveryMinute() {
	$("#tableBody").empty();
	allTrains.forEach(function(element) {
    	updateUIWithData(element);
	});
}