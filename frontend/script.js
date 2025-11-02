// Smooth scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

// Mobile nav toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const display = document.getElementById("dataCheck");
// for spinner
const spinner = document.getElementById("spinner");
const sendContent = document.getElementById("send");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Contact form handler (demo)
document.getElementById("contact-form").addEventListener("submit", async function(e){
  e.preventDefault(); //event handler to stop the browser’s default action for that event.
  Object.assign(display.style,{
    display: "none"
  })
  spinner.style.display = "block" // show spinner
 const sendFormData = new FormData(this)

  try {
  
    /*const url = "http://localhost:2000/sidejob"; // this url is for local database managment */
    const url = "/contact" 
    const endpointObject = {
      method: "POST", 
      body: sendFormData // making the data sitring
    };

    const res = await fetch(url, endpointObject);
    const data = await res.json(); //chaning data into Json format
    const userFirstName = sendFormData.get("name").match(/^[^\s]+/); 
    this.reset();
    const submitted = "Data is submitted successfully"
    if(data.Msg === submitted ){
       alert(`Thanks "${userFirstName[0]}" for your interest! I’ll contact you soon.`)
       Object.assign(display.style,{
       display: "block",
       color: "#2196f3"
       })
      display.innerHTML = data.Msg;  
    } else {
      Object.assign(display.style,{
       display: "block",
       color: "red"
       })
       display.innerHTML = `your data is not submitted due to ${data.Msg}`;  
    }
  }catch(err){
    console.error(err);
    Object.assign(display.style,{
       display: "block",
       color: "red"
       })
    display.innerHTML = "URL/API not found";
  }finally{
   spinner.style.display = "none" // hidden spinner
  }

});