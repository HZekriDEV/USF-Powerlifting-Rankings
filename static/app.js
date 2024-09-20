
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
    alert(result.message || result.error);

    loadLeaderboard();
});

async function loadLeaderboard() {
    const response = await fetch('/leaderboard');
    const athletes = await response.json();

    let leaderboard = '<table><tr><th>Name</th><th>Weight Class</th><th>Total</th><th>DOTS</th><th>GL Points</th></tr>';
    athletes.forEach(athlete => {
        leaderboard += `<tr><td>${athlete[1]}</td><td>${athlete[2]}</td><td>${athlete[4]}</td><td>${athlete[5]}</td><td>${athlete[6]}</td></tr>`;
    });
    leaderboard += '</table>';
    document.getElementById('leaderboard').innerHTML = leaderboard;
}

window.onload = loadLeaderboard;
