
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            try {
                const response = await axios.post('/user/login', {      //axios call.....
                    email,
                    password
                });

                if (response.status === 200) {

                    alert("You Login Successfully");
                } else {
                    console.error('Login failed');
                    // Optionally, display an error message to the user
                }
            } catch (error) {
                if (error.response.status === 401) {
                    alert('incorrect password.');
                    console.log("incorrect password");
                } 
                console.error('Error:', error);
                // Optionally, display an error message to the user
            }
        });
    }
})