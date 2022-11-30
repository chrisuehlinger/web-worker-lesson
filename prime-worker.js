// This is a very naive implementation of the Sieve of Eratosthenes: https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
// The point here was to have an algorithm that's not too hard to follow,
// and that wastes enough time that we will need a web worker
function findNthPrimeNumber(n) {
    console.log(`Finding the ${n}th prime number...`);
    const primes = [];
    // Keep checking numbers until we have enough primes
    for(let i = 2; primes.length < n; i++){
        // For each number "i", let's see if it's divisible by any of the primes that we've seen so far
        let isPrime = true;
        for (let j=0; j<primes.length; j++) {
            // % (or modulo) tells you the remainder after two numbers are divided
            // If i % primes[j] is 0, that means i is divisible by the jth prime number in our list
            if(i % primes[j] === 0) {
                isPrime = false;
                // At this point we don't need to look any further
                break;
            }
        }

        if(isPrime) {
            primes.push(i);
            console.log(`${i} is the ${primes.length}th prime`);
        }
    }
    return primes.pop();
}

onmessage = (event) => {
    const n = event.data.n;
    const nthPrime = findNthPrimeNumber(n);
    postMessage({n: n, prime: nthPrime});
};