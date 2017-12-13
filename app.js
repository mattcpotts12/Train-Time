$(document).ready(function() {
    var interval = setInterval(function() {
        var momentNow = moment();
        $('#timeClock').html(momentNow.format('hh:mm:ss A'));
    }, 100);
});


// var table = $("#train-table");
// var refresher = setInterval(table.load.bind(table, "index.php"), 5000);
// setInterval(function() {
// 	clearInterval(refresher);
// }, 1000);


// Initialize Firebase
var config = {
	apiKey: "AIzaSyAAzhBLN5evGlRVRUG4aY4Bgo8CDhcgiSw",
	authDomain: "train-scheduler-ee882.firebaseapp.com",
	databaseURL: "https://train-scheduler-ee882.firebaseio.com",
	projectId: "train-scheduler-ee882",
	storageBucket: "train-scheduler-ee882.appspot.com",
	messagingSenderId: "579276748138"
};

firebase.initializeApp(config);

var database = firebase.database();



$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	// Grabs user input
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
	var frequency = $("#frequency-input").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		train: trainName,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	};

	console.log(newTrain);

	// Uploads train data to database
	database.ref().push(newTrain);

	// Clears all of the text-boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-input").val("");
	$("#frequency-input").val("");
	
}); // on click add-train-btn



database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().train;
	var destination = childSnapshot.val().destination;
	var firstTrain = childSnapshot.val().firstTrain;
	var frequency = childSnapshot.val().frequency;

	var currentTime = moment();
	
	var trainNextMin = moment().diff(moment.unix(firstTrain), "minutes");
	var trainRemainder = trainNextMin % frequency;
	var trainMinutesAway = frequency - trainRemainder;
	var trainNextTime = moment().add(trainMinutesAway, "m").format("hh:mm A");

	// add everything to table
	$("#train-table")
		.append($("<tr>")
			.append( $("<td>").text(trainName) )
			.append( $("<td>").text(destination) )
			.append( $("<td>").text(frequency) )
			.append( $("<td>").text(trainNextTime) )
			.append( $("<td>").text(trainMinutesAway) )
		);

	
}); // on child_added

