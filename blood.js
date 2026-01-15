document.addEventListener('DOMContentLoaded', () => {
    const donorForm = document.getElementById('donorForm');
    const donorMessage = document.getElementById('donorMessage');
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    const requestForm = document.getElementById('requestForm');
    const requestMessage = document.getElementById('requestMessage');
    const currentRequestsDiv = document.getElementById('currentRequests');
    const contactForm = document.getElementById('contactForm');
    const contactMessageDiv = document.getElementById('contactMessageDiv');
    const backToTopButton = document.getElementById('backToTopBtn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link'); // Select by class for easier iteration

    // Simulate a simple in-memory database for donors and blood units
    let bloodInventory = {
        "A+": [], "A-": [],
        "B+": [], "B-": [],
        "AB+": [], "AB-": [],
        "O+": [], "O-": []
    };

    let bloodRequests = []; // Array to store blood requests

    // --- Utility Functions ---
    function displayMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 5000); // Clear message after 5 seconds
    }

    function renderBloodRequests() {
        currentRequestsDiv.innerHTML = ''; // Clear previous requests
        if (bloodRequests.length === 0) {
            currentRequestsDiv.innerHTML = '<p>No blood requests at the moment.</p>';
            return;
        }

        const ul = document.createElement('ul');
        bloodRequests.forEach(request => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>Patient: <span>${request.patientName}</span></div>
                <div>Blood Type: <span>${request.bloodType}</span></div>
                <div>Units: ${request.units}</div>
                <div>Location: ${request.location}</div>
                <div>Contact: ${request.contact}</div>
            `;
            ul.appendChild(li);
        });
        currentRequestsDiv.appendChild(ul);
    }

    // Function to handle form validation feedback
    function validateInput(input) {
        const errorMessageElement = input.nextElementSibling; // Assumes error-message div is next sibling
        if (input.checkValidity()) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                errorMessageElement.textContent = '';
            }
            return true;
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                errorMessageElement.textContent = input.validationMessage;
            }
            return false;
        }
    }

    // --- Initial Dummy Data ---
    function addDummyData() {
        bloodInventory["A+"].push({ name: "Rahul Sharma", contact: "9810012345", location: "Rajouri Garden, Delhi" });
        bloodInventory["A+"].push({ name: "Dev Kumar", contact: "9810012346", location: "Nehru Place, Delhi" });
        bloodInventory["O+"].push({ name: "Shashi Kumari", contact: "9876512340", location: "Dwarka, Delhi" });
        bloodInventory["B+"].push({ name: "Anita Singh", contact: "9876512341", location: "Saket, Delhi" });
        bloodInventory["AB-"].push({ name: "Amit Verma", contact: "9765432109", location: "Karol Bagh, Delhi" });
        bloodInventory["O+"].push({ name: "Sanya Gupta", contact: "9887766554", location: "Janakpuri, Delhi" });
        bloodInventory["AB-"].push({ name: "Manish Joshi", contact: "9770099888", location: "Lajpat Nagar, Delhi" });
        bloodInventory["B-"].push({ name: "Pooja Mehra", contact: "9664455511", location: "Preet Vihar, Delhi" });
        bloodInventory["A-"].push({ name: "Sara Khan", contact: "9812345678", location: "Greater Kailash, Delhi" });
        bloodInventory["A+"].push({ name: "Alka Bhatia", contact: "9820011001", location: "Vasant Kunj, Delhi" });
        bloodInventory["O-"].push({ name: "Bobby Rao", contact: "9900112233", location: "Pitampura, Delhi" });
        bloodInventory["AB+"].push({ name: "Ritu Sharma", contact: "9811122233", location: "Hauz Khas, Delhi" });
        bloodInventory["B+"].push({ name: "Deepak Kapoor", contact: "9898877665", location: "Rohini, Delhi" });

        bloodRequests.push({
            patientName: "Sunita Verma",
            bloodType: "A+",
            units: 2,
            contact: "9810012345",
            location: "AIIMS, New Delhi"
        });
        bloodRequests.push({
            patientName: "Vikram Patel",
            bloodType: "O-",
            units: 1,
            contact: "9890011223",
            location: "Lok Hospital, New Delhi"
        });
    }
    addDummyData();
    renderBloodRequests(); // Display initial dummy requests

    // --- Event Listeners ---

    // Donor Registration Form
    if (donorForm) {
        donorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;
            donorForm.querySelectorAll('input, select').forEach(input => {
                if (!validateInput(input)) {
                    formIsValid = false;
                }
            });

            if (!formIsValid) {
                displayMessage(donorMessage, 'Please fill in all required fields correctly.', 'error');
                return;
            }

            const donorName = document.getElementById('donorName').value;
            const donorBloodType = document.getElementById('donorBloodType').value;
            const donorContact = document.getElementById('donorContact').value;
            const donorLocation = document.getElementById('donorLocation').value;

            if (bloodInventory[donorBloodType]) {
                bloodInventory[donorBloodType].push({
                    name: donorName,
                    contact: donorContact,
                    location: donorLocation
                });
                displayMessage(donorMessage, `Thank you, ${donorName}! You have been registered as an ${donorBloodType} donor.`, 'success');
                donorForm.reset();
                // Clear validation styles after reset
                donorForm.querySelectorAll('input, select').forEach(input => {
                    input.classList.remove('valid', 'invalid');
                    const errorMessageElement = input.nextElementSibling;
                    if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                        errorMessageElement.textContent = '';
                    }
                });
            } else {
                displayMessage(donorMessage, 'Error: Invalid blood type selected.', 'error');
            }
        });

        // Add real-time validation for donor form inputs
        donorForm.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input)); // Validate on blur
        });
    }


    // Blood Search Form
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;
            // Only validate the blood type select, location is optional
            const searchBloodTypeInput = document.getElementById('searchBloodType');
            if (!validateInput(searchBloodTypeInput)) {
                formIsValid = false;
            }

            if (!formIsValid) {
                searchResults.innerHTML = '<p>Please select a blood type to search.</p>';
                return;
            }

            const searchBloodType = searchBloodTypeInput.value;
            const searchLocation = document.getElementById('searchLocation').value.toLowerCase().trim();

            const availableDonors = bloodInventory[searchBloodType];
            searchResults.innerHTML = ''; // Clear previous results

            if (availableDonors && availableDonors.length > 0) {
                const filteredDonors = availableDonors.filter(donor =>
                    !searchLocation || donor.location.toLowerCase().includes(searchLocation)
                );

                if (filteredDonors.length > 0) {
                    const ul = document.createElement('ul');
                    filteredDonors.forEach(donor => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <div>Blood Type: <span>${searchBloodType}</span></div>
                            <div>Donor: <span>${donor.name}</span></div>
                            <div>Location: <span>${donor.location}</span></div>
                            <div>Contact: <span>${donor.contact}</span></div>
                        `;
                        ul.appendChild(li);
                    });
                    searchResults.appendChild(ul);
                } else {
                    searchResults.innerHTML = `<p>No <span>${searchBloodType}</span> donors found in ${searchLocation || 'any location'}.</p>`;
                }
            } else {
                searchResults.innerHTML = `<p>No <span>${searchBloodType}</span> blood available from donors at the moment.</p>`;
            }
        });

        // Add real-time validation for search form inputs (blood type)
        const searchBloodTypeInput = document.getElementById('searchBloodType');
        if (searchBloodTypeInput) {
            searchBloodTypeInput.addEventListener('input', () => validateInput(searchBloodTypeInput));
            searchBloodTypeInput.addEventListener('blur', () => validateInput(searchBloodTypeInput));
        }
    }


    // Blood Request Form
    if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;
            requestForm.querySelectorAll('input, select').forEach(input => {
                if (!validateInput(input)) {
                    formIsValid = false;
                }
            });

            if (!formIsValid) {
                displayMessage(requestMessage, 'Please fill in all required fields correctly.', 'error');
                return;
            }

            const patientName = document.getElementById('requestPatientName').value;
            const bloodType = document.getElementById('requestBloodType').value;
            const units = document.getElementById('requestUnits').value;
            const contact = document.getElementById('requestContact').value;
            const location = document.getElementById('requestLocation').value;

            const newRequest = {
                patientName,
                bloodType,
                units: parseInt(units),
                contact,
                location
            };

            bloodRequests.push(newRequest); // Add new request to the array
            renderBloodRequests(); // Update the displayed requests

            displayMessage(requestMessage, `Blood request for ${patientName} (${bloodType}, ${units} units) submitted successfully!`, 'success');
            requestForm.reset();
            // Clear validation styles after reset
            requestForm.querySelectorAll('input, select').forEach(input => {
                input.classList.remove('valid', 'invalid');
                const errorMessageElement = input.nextElementSibling;
                if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                    errorMessageElement.textContent = '';
                }
            });
        });

        // Add real-time validation for request form inputs
        requestForm.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });
    }


    // Contact Us Form (Client-side simulation)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;
            contactForm.querySelectorAll('input, textarea').forEach(input => {
                if (!validateInput(input)) {
                    formIsValid = false;
                }
            });

            if (!formIsValid) {
                displayMessage(contactMessageDiv, 'Please fill in all required fields correctly.', 'error');
                return;
            }

            // In a real application, this would send data to a server
            // For this example, we'll just simulate success.
            const contactName = document.getElementById('contactName').value;
            displayMessage(contactMessageDiv, `Thank you, ${contactName}! Your message has been sent. We will get back to you shortly.`, 'success');
            contactForm.reset();
            // Clear validation styles after reset
            contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.classList.remove('valid', 'invalid');
                const errorMessageElement = input.nextElementSibling;
                if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                    errorMessageElement.textContent = '';
                }
            });
        });

        // Add real-time validation for contact form inputs
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });
    }

    // --- UI Enhancements ---

    // Toggle mobile navigation
    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });

        // Close mobile nav when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links and highlight active link on scroll
    const sections = document.querySelectorAll('section');

    function activateNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset for better timing, considering sticky header height
            if (pageYOffset >= sectionTop - window.innerHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Immediately set active class on click for better feedback
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    window.addEventListener('scroll', activateNavLink);
    // Call on load to set initial active link
    activateNavLink();


    // "Back to Top" Button logic
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) { // Show button after scrolling 400px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dynamic year in footer
    const currentYear = new Date().getFullYear();
    const footerYearSpan = document.getElementById('currentYear');
    if (footerYearSpan) {
        footerYearSpan.textContent = currentYear;
    }
});
