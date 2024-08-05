const primaryElection = new Date("2024-06-04T20:59:59").getTime();
const generalElection = new Date("2024-11-05T20:59:59").getTime();
function makeCountdown(targetDate, elementId, message) {
// Update the countdown every second
    const interval = setInterval(function primary() {
        // Get the current date and time
        const currentDate = new Date().getTime();

        // Calculate the remaining time
        const remainingTime = targetDate - currentDate;

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Display the countdown
        document.getElementById(elementId).innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

        // Check if the countdown is over
        if (remainingTime <= 0) {
            clearInterval(interval);
            document.getElementById(elementId).innerHTML = message;
        }
    }, 1000); // Update every second

}
makeCountdown(primaryElection, "primary", "PRIMARY ELECTION WON!")
makeCountdown(generalElection, "general", "GENERAL ELECTION DAY!")