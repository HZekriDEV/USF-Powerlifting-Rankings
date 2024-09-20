document.getElementById('add-athlete-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const athleteName = document.getElementById('athlete-name').value;

    const response = await fetch('/add_athlete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: athleteName }),
    });

    const result = await response.json();

    if (result.error) {
        alert(result.error);
    }

    loadLeaderboard();
});

document.getElementById('filter-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const metric = document.getElementById('metric').value;
    const filter = document.getElementById('filter').value;
    const gender = document.getElementById('gender').value;  // Get the selected gender
    const unit = document.querySelector('input[name="unit"]:checked').value;

    const response = await fetch(`/leaderboard?metric=${metric}&filter=${filter}&gender=${gender}&unit=${unit}`);
    const athletes = await response.json();

    let leaderboard = '<table><tr><th>Name</th><th>Weight Class</th><th>Total</th><th>DOTS</th><th>Remove</th></tr>';
    athletes.forEach(athlete => {
        leaderboard += `<tr><td>${athlete[1]}</td><td>${athlete[2]}</td><td>${athlete[3]}</td><td>${athlete[4]}</td>
                        <td><button class="remove-btn" data-id="${athlete[0]}">Remove</button></td></tr>`;
    });
    leaderboard += '</table>';
    document.getElementById('leaderboard').innerHTML = leaderboard;
});


document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('remove-btn')) {
        const row = e.target.closest('tr');
        const athleteName = row.children[0].innerText;

        const response = await fetch('/remove_athlete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: athleteName }),
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
        }

        loadLeaderboard();
    }
});

async function loadLeaderboard() {
    const unit = document.querySelector('input[name="unit"]:checked').value;  // Get the selected unit
    const response = await fetch(`/leaderboard?unit=${unit}`);
    const athletes = await response.json();

    let leaderboard = '<table><tr><th>Name</th><th>Weight Class</th><th>Total</th><th>DOTS</th><th>Actions</th></tr>';
    athletes.forEach(athlete => {
        // Ensure name links to OpenPowerlifting
        const normalizedAthleteName = athlete[1].toLowerCase().replace(" ", "");
        const openPowerliftingURL = `https://www.openpowerlifting.org/u/${normalizedAthleteName}`;
        
        // Render input if weight class is missing, otherwise display the weight class
        const weightClass = athlete[2] ? athlete[2] : '<input type="text" class="weight-class-input" data-id="'+athlete[0]+'" placeholder="Enter weight class">';
        
        // Add a clickable name that links to OpenPowerlifting
        leaderboard += `<tr>
                            <td><a href="${openPowerliftingURL}" target="_blank">${athlete[1]}</a></td>
                            <td>${weightClass}</td>
                            <td>${athlete[3]}</td>
                            <td>${athlete[4]}</td>
                            <td><button class="remove-btn" data-id="${athlete[0]}">Remove</button></td>
                        </tr>`;
    });
    leaderboard += '</table>';
    document.getElementById('leaderboard').innerHTML = leaderboard;

    // Add event listeners for updating weight class inputs
    document.querySelectorAll('.weight-class-input').forEach(input => {
        input.addEventListener('blur', async function () {
            const athleteId = this.getAttribute('data-id');
            const weightClass = this.value;
            if (weightClass) {
                await fetch('/update_weight_class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ athlete_id: athleteId, weight_class_kg: weightClass }),
                });

                loadLeaderboard();  // Reload the leaderboard after update
            }
        });
    });
}

document.querySelectorAll('.toggle-button').forEach(label => {
    label.addEventListener('click', function() {
        document.querySelectorAll('.toggle-button').forEach(button => {
            button.classList.remove('active');
        });
        label.classList.add('active');
        loadLeaderboard();
    });
});

window.onload = loadLeaderboard;


