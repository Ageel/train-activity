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

    // Variables for the onClick event
    var trainName = "";
    var destination = "";
    var initialTrain = "";
    var nextArrival = "";
    var minAway = "";

    $("#add-train").on("click", function() {
        event.preventDefault();
        // Storing and retreiving new train data
        trainName = $("#train-input").val().trim();
        destination = $("#destination").val().trim();
        initialTrain = $("#initialTrain-input").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing to database
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
        var nextArr;
        var minAway;
        // Chang year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().initialTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().trainName +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().initialTrain);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});