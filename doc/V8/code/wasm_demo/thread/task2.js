self.addEventListener("message", e => {
     const shareArray = e.data;
     Atomics.wait(shareArray, 2, "joker");
     console.log('🍉');
})