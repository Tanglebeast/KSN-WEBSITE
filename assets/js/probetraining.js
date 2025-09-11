// Initialize EmailJS with your Public Key
(function(){
    emailjs.init("lmzLALffjpnCGTbcO"); // Replace with your EmailJS Public Key
})();

function updateTimes() {
    const categorySelect = document.getElementById('categorySelect');
    const timeSelect = document.getElementById('timeSelect');
    const selectedCategory = categorySelect.value;

    // Clear existing options
    timeSelect.innerHTML = '';

    // Define available times based on category
    const times = {
        adults: [
            { value: '1', time: 'Montag 18:00' },
            { value: '2', time: 'Dienstag 18:00' },
            { value: '3', time: 'Freitag 18:30' }
        ],
        kids: [
            { value: '4', time: 'Montag 16:15' },
            { value: '5', time: 'Donnerstag 16:15' }
        ],
        bambinis: [
            { value: '6', time: 'Donnerstag 15:30' }
        ],
        teens: [
            { value: '7', time: 'Montag 17:00' },
            { value: '8', time: 'Dienstag 17:00' },
            { value: '9', time: 'Mittwoch 18:00' },
            { value: '10', time: 'Donnerstag 17:00' }
        ]
    };

    // Populate time select with appropriate times
    times[selectedCategory].forEach(time => {
        const option = document.createElement('option');
        option.value = time.value;
        option.text = time.time;
        timeSelect.appendChild(option);
    });

    // Destroy and reinitialize nice-select for time select to avoid conflicts
    $(timeSelect).niceSelect('destroy');
    $(timeSelect).niceSelect();
}

// Send form data using EmailJS
function sendForm(event) {
    event.preventDefault(); // Prevent default form submission

    const form = document.getElementById('probetrainingForm');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const category = document.getElementById('categorySelect').options[document.getElementById('categorySelect').selectedIndex].text;
    const time = document.getElementById('timeSelect').options[document.getElementById('timeSelect').selectedIndex].text;
    const message = document.getElementById('message').value;
    const submitMessage = document.getElementById('submitMessage');

    // Validate required fields
    if (!name || !email || !phone) {
        submitMessage.style.display = 'block';
        submitMessage.style.color = '#dc3545'; // Rot für Fehlermeldung
        submitMessage.textContent = 'Bitte füllen Sie alle erforderlichen Felder aus (Name, Email, Handynummer).';
        setTimeout(() => {
            submitMessage.style.display = 'none';
        }, 3000);
        return false;
    }

    // EmailJS parameters
    const templateParams = {
        name: name,
        email: email,
        phone: phone,
        category: category,
        time: time,
        message: message || 'Keine Nachricht angegeben'
    };

    // Send email using EmailJS
    emailjs.send('service_tt6c19q', 'template_ipgmnav', templateParams)
        .then(function(response) {
            submitMessage.style.display = 'block';
            submitMessage.style.color = '#28a745'; // Grün für Erfolg
            submitMessage.textContent = 'Probetraining erfolgreich gebucht!';
            form.reset(); // Reset form after successful submission
            updateTimes(); // Reset time select to initial state
            setTimeout(() => {
                submitMessage.style.display = 'none';
            }, 3000);
        }, function(error) {
            submitMessage.style.display = 'block';
            submitMessage.style.color = '#dc3545'; // Rot für Fehlermeldung
            submitMessage.textContent = 'Fehler beim Senden der Anfrage: ' + (error.text || JSON.stringify(error));
            setTimeout(() => {
                submitMessage.style.display = 'none';
            }, 3000);
        });

    return false; // Prevent form submission
}

// Initialize times and nice-select on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize nice-select for both selects
    $('#categorySelect').niceSelect();
    $('#timeSelect').niceSelect();

    // Set initial times
    updateTimes();

    // Add event listener for category change on the original select element
    $('#categorySelect').on('change', function() {
        updateTimes();
        // Close the nice-select dropdown after selection
        $(this).next('.nice-select').removeClass('open');
    });
});