function test(h) {
   h.classList.toggle("a") 
   h.classList.contains("a") ? h.textContent = "day" : h.textContent = "night"
}
