document.addEventListener('DOMContentLoaded', function () {
    // Set the countdown date (replace with your desired date)
    const countdownDate = new Date('2024-11-05T00:00:00').getTime();

    // Function to update a single countdown element
    const updateCountdownElement = function (element, value, unit) {
        const countdownElement = element.querySelector('.countdown');
        const timeUnitElement = element.querySelector('.time-unit');

        const formattedValue = value.toString().padStart(2, '0'); // Ensure two digits

        countdownElement.innerHTML = `<span style="--value:${value};"></span>`;
        timeUnitElement.textContent = `${formattedValue} ${unit}`;
    };

    // Update the countdown every second
    const updateCountdown = function () {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update each countdown element
        updateCountdownElement(document.getElementById('days'), days, 'days');
        updateCountdownElement(document.getElementById('hours'), hours, 'hours');
        updateCountdownElement(document.getElementById('minutes'), minutes, 'min');
        updateCountdownElement(document.getElementById('seconds'), seconds, 'sec');

        // If the countdown is over, display a message
        if (distance < 0) {
            // Optionally update or display something when the countdown is over
        }
    };

    // Initial call to set the initial countdown
    updateCountdown();

    // Update the countdown every 1000ms (1 second)
    setInterval(updateCountdown, 1000);
});