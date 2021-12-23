function generateColour() {
    let letters = 'BCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function getMethodStats(calls, call) {
    let counter = 0;
    let timer = 0;
    calls.forEach((innerCall) => {
      if (innerCall.methodName === call.methodName) {
        counter++;
        timer += parseInt(innerCall.time);
      }
    })
    return [counter, (timer / counter).toFixed(2)];
}

export { generateColour, getMethodStats };