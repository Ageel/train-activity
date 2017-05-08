$(document).ready(function(){
   var config = {
    apiKey: "AIzaSyC9yhLViSJSFvmjPQyaLNbvJce7MoYn6Js",
    authDomain: "train-7fe6c.firebaseapp.com",
    databaseURL: "https://train-7fe6c.firebaseio.com",
    projectId: "train-7fe6c",
    storageBucket: "train-7fe6c.appspot.com",
    messagingSenderId: "231507051133"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

    var trainName = "";
    var destination = "";
    var initialTrain = "";
    var nextArrival = "";
    var minAway = "";
$("#add-train").on("click", function(){
   event.preventDefault();
    trainName = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    initialTrain= $("#initialTrain-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    database.ref().push({
            trainName: trainName,
            destination: destination,
            initialTrain: initialTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();

});

database.ref().on("child_added", function(childSnapshot) {
    var tFrequency = frequency;
    // Time is 3:30 AM
    var initialTrain = initialTrain;
    console.log(initialTrain);
    console.log(typeof(initialTrain));
    // First Time (pushed back 1 year to make sure it comes before current time)
    var initialTrainConverted = moment(initialTrain, "hh:mm").subtract(1, "years");
    console.log(initialTrainConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(initialTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log(tMinutesTillTrain);
    console.log(typeof(tMinutesTillTrain));
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    console.log(nextTrain);
    console.log(typeof(nextTrain));

        $("#add-row").append("<tr><td>" + childSnapshot.val().trainName +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

});