let playerName = null
if (playerName === null) {
    console.log("Player name is not set.");
} else {
    console.log('Player name is $(playerName)');
}

function test(t) {
    if (t === undefined) {
        return 'Undefined'
    }
}
function calculate() {
    let num1 = parseInt(document.getElementById('num1').value);
    let num2 = parseInt(document.getElementById('num2').value);
    let result = num1 + num2;
    document.getElementById('result').innerText = "Result: " + result;
}