document.getElementById('add-athlete-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const athleteName = document.getElementById('athlete-name').value;

    // Send request to add an athlete with all PRs initialized to 0
    const response = await fetch('/add_athlete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: athleteName,
            squat4_kg: 0,
            bench4_kg: 0,
            deadlift4_kg: 0,
            squat3_kg: 0,
            bench3_kg: 0,
            deadlift3_kg: 0,
            squat2_kg: 0,
            bench2_kg: 0,
            deadlift2_kg: 0,
            squat1_kg: 0,
            bench1_kg: 0,
            deadlift1_kg: 0
        }),
    });

    const result = await response.json();

    if (result.error) {
        alert(result.error);
    }

    loadLeaderboard(); // Refresh leaderboard after adding athlete
});


document.getElementById('filter-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const metric = document.getElementById('metric').value;
    const filter = document.getElementById('filter').value;
    const gender = document.getElementById('gender').value;  
    const unit = document.querySelector('input[name="unit"]:checked').value;

    const response = await fetch(`/leaderboard?metric=${metric}&filter=${filter}&gender=${gender}&unit=${unit}`);
    const athletes = await response.json();

    let leaderboard = '<table><tr><th>Name</th><th>Weight Class</th><th>Total</th><th>DOTS</th><th>Actions</th></tr>';
    athletes.forEach(athlete => {
        const normalizedAthleteName = athlete[1].toLowerCase().replace(" ", "");
        const openPowerliftingURL = `https://www.openpowerlifting.org/u/${normalizedAthleteName}`;
        leaderboard += `<tr><td><a href="${openPowerliftingURL}" target="_blank">${athlete[1]}</a></td>
                            <td>${athlete[2]}</td>
                            <td>${athlete[3]}</td>
                            <td>${athlete[4]}</td>
                            <td>
                            <button class="add-prs-btn" data-id="${athlete[0]}">PR Board</button>
                            <button class="remove-btn" data-id="${athlete[0]}">Remove</button>
                            </td></tr>`;
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
        
        leaderboard += `<tr>
                            <td><a href="${openPowerliftingURL}" target="_blank">${athlete[1]}</a></td>
                            <td>${weightClass}</td>
                            <td>${athlete[3]}</td>
                            <td>${athlete[4]}</td>
                            <td>
                            <button class="add-prs-btn" data-id="${athlete[0]}">PR Board</button>
                            <button class="remove-btn" data-id="${athlete[0]}">Remove</button>
                            </td>
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

var athleteName = '';
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('add-prs-btn')) {
        const row = e.target.closest('tr');
        athleteName = row.children[0].innerText;

        const prs = await loadAthletePRs(athleteName);

        // Show Combined PR Table/Graph Modal
        const prTableGraphModal = document.getElementById('prTableGraphModal');
        const prTableGraphContent = prTableGraphModal.querySelector('.modal-content');
        const prTableGraphHeader = prTableGraphModal.querySelector('.modal-header');
        prTableGraphModal.style.display = 'block';
        makeModalDraggable(prTableGraphContent, prTableGraphHeader);

        var maxPR = Math.max(prs);

        // Display the PR table and graph
        displayPRTable(prs);
        displayPRGraph(prs, maxPR);
    }
});

async function loadAthletePRs(athleteName) {
    const response = await fetch(`/get_athlete_prs?athlete=${athleteName}`);
    if (!response.ok) {
        console.error("Failed to load PR data for athlete:", athleteName);
        return;
    }

    const prs = await response.json();
    
    // Format the PR data
    const prsFormatted = {
        s: { set4: prs.squat4, set3: prs.squat3, set2: prs.squat2, set1: prs.squat1 },
        b: { set4: prs.bench4, set3: prs.bench3, set2: prs.bench2, set1: prs.bench1 },
        d: { set4: prs.deadlift4, set3: prs.deadlift3, set2: prs.deadlift2, set1: prs.deadlift1 }
    };
    
    return prsFormatted;
}

async function saveUpdatedPR(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Fetch the current PR data for the athlete
    const currentPRsResponse = await fetch(`/get_athlete_prs?athlete=${athleteName}`);
    const currentPRs = await currentPRsResponse.json();

    // Create the updated PR data
    const prsData = {
        squat4: document.querySelector('[data-lift="S"][data-set="set4"]').value || currentPRs.squat4_kg,
        bench4: document.querySelector('[data-lift="B"][data-set="set4"]').value || currentPRs.bench4_kg,
        deadlift4: document.querySelector('[data-lift="D"][data-set="set4"]').value || currentPRs.deadlift4_kg,
        squat3: document.querySelector('[data-lift="S"][data-set="set3"]').value || currentPRs.squat3_kg,
        bench3: document.querySelector('[data-lift="B"][data-set="set3"]').value || currentPRs.bench3_kg,
        deadlift3: document.querySelector('[data-lift="D"][data-set="set3"]').value || currentPRs.deadlift3_kg,
        squat2: document.querySelector('[data-lift="S"][data-set="set2"]').value || currentPRs.squat2_kg,
        bench2: document.querySelector('[data-lift="B"][data-set="set2"]').value || currentPRs.bench2_kg,
        deadlift2: document.querySelector('[data-lift="D"][data-set="set2"]').value || currentPRs.deadlift2_kg,
        squat1: document.querySelector('[data-lift="S"][data-set="set1"]').value || currentPRs.squat1_kg,
        bench1: document.querySelector('[data-lift="B"][data-set="set1"]').value || currentPRs.bench1_kg,
        deadlift1: document.querySelector('[data-lift="D"][data-set="set1"]').value || currentPRs.deadlift1_kg
    };

    var maxPR = Math.max(prsData);

    // Send the updated PR data to the server
    const response = await fetch(`/add_prs?athlete=${athleteName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(prsData)
    });

    const result = await response.json();

    if (result.error) {
        alert(result.error);
        return;
    }

    // Fetch the updated PRs to refresh the display
    const updatedPRs = await loadAthletePRs(athleteName);

    // Show Combined PR Table/Graph Modal
    const prTableGraphModal = document.getElementById('prTableGraphModal');
    const prTableGraphContent = prTableGraphModal.querySelector('.modal-content');
    const prTableGraphHeader = prTableGraphModal.querySelector('.modal-header');
    prTableGraphModal.style.display = 'block';
    makeModalDraggable(prTableGraphContent, prTableGraphHeader);

    // Display the updated PR table and graph
    displayPRTable(updatedPRs);
    displayPRGraph(updatedPRs, maxPR);
}

// Function to display the PR table
function displayPRTable(prs) {
    const prTableBody = document.getElementById('pr-data');
    prTableBody.innerHTML = ''; // Clear the table before repopulating

    const lifts = ['S', 'B', 'D'];
    const rows = lifts.map(lift => {
        const pr = prs[lift.toLowerCase()];
        return `
            <tr>
                <td>${lift}</td>
                <td><input type="number" value="${pr.set4}" class="editable-pr" data-lift="${lift}" data-set="set4"></td>
                <td><input type="number" value="${pr.set3}" class="editable-pr" data-lift="${lift}" data-set="set3"></td>
                <td><input type="number" value="${pr.set2}" class="editable-pr" data-lift="${lift}" data-set="set2"></td>
                <td><input type="number" value="${pr.set1}" class="editable-pr" data-lift="${lift}" data-set="set1"></td>
            </tr>
        `;
    }).join('');

    prTableBody.innerHTML = rows;

    // Add event listeners to all editable input fields
    document.querySelectorAll('.editable-pr').forEach(input => {
        input.addEventListener('blur', saveUpdatedPR);  // Save the updated PR when the input loses focus
    });
}

// Function to display the PR graph
let prChartInstance = null;
function displayPRGraph(prs, maxPR) {
    const ctx = document.getElementById('prChart').getContext('2d');

    // Destroy the previous chart if it exists
    if (prChartInstance !== null) {
        prChartInstance.destroy();
    }

    const labels = ['Set of 4', 'Set of 3', 'Set of 2', 'Set of 1'];
    const squatData = [prs.s.set4, prs.s.set3, prs.s.set2, prs.s.set1];
    const benchData = [prs.b.set4, prs.b.set3, prs.b.set2, prs.b.set1];
    const deadliftData = [prs.d.set4, prs.d.set3, prs.d.set2, prs.d.set1];

    prChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'S',
                    data: squatData,
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    fill: true
                },
                {
                    label: 'B',
                    data: benchData,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    fill: true
                },
                {
                    label: 'D',
                    data: deadliftData,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    fill: true
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxPR
                }
            }
        }
    });
}

// Make a specific modal draggable
function makeModalDraggable(modalContent, header) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - modalContent.offsetLeft;
        offsetY = e.clientY - modalContent.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            modalContent.style.left = `${e.clientX - offsetX}px`;
            modalContent.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
}

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
        this.closest('.modal').style.display = 'none';
    });
});



window.onload = loadLeaderboard;


