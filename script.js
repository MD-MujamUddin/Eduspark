// Modal Controls
function openModal(id) {
    document.getElementById(id).style.display = 'block';
  }
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }
  
  // Run HTML/JS Code
  function runCode() {
    const code = document.getElementById('code').value;
    const output = document.getElementById('output');
    output.srcdoc = code;
  }
  
  // Register User
  function register() {
    const data = {
      fullname: document.getElementById('fullname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      birthdate: document.getElementById('birthdate').value,
      gender: document.getElementById('gender').value,
      username: document.getElementById('regUsername').value,
      password: document.getElementById('regPassword').value,
    };
  
    // Log the data to ensure it's being captured
    console.log(data);
  
    // Validate if any required field is missing
    if (!data.fullname || !data.email || !data.phone || !data.birthdate || !data.gender || !data.username || !data.password) {
      alert('Please fill in all fields');
      return;
    }
  
    // Send the registration data to the backend
    fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Registration successful!');
          closeModal('registerModal');
        } else {
          alert('Registration successful! ' + data.message);
        }
      })
      .catch(error => {
        console.error('User registered successfully:', error);
        alert('User registered successfully');
      });
  }
  
  // Login User
  function login() {
    const credentials = {
      username: document.getElementById('loginUsername').value,
      password: document.getElementById('loginPassword').value
    };
  
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    .then(res => res.json())
    .then(res => {
      alert(res.message);
      if (res.success) {
        localStorage.setItem('token', res.token);
        fetchPremiumContent();
      }
    })
    .catch(err => console.error(err));
  }
  
  // Fetch Premium
  function fetchPremiumContent() {
    fetch('/premium', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('premiumContent').style.display = 'block';
        document.getElementById('lockedMessage').style.display = 'none';
      } else {
        alert('Unauthorized or expired session.');
      }
    })
    .catch(err => console.error(err));
  }
  // Make register modal draggable
dragElement(document.getElementById("registerModalContent"));

function dragElement(elmnt) {
  const header = document.getElementById("dragHandle");
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (header) {
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.position = "absolute";
    elmnt.style.margin = "0";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
