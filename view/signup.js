document.addEventListener('DOMContentLoaded', async () => {
    const signupForm = document.querySelector('#form');
    
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(signupForm);
        try {
            const response = await axios.post('/user/signup', {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
            });

            if (response.status === 200) {
                alert('User registered successfully.');
                console.log("User registered successfully.");
                // Optionally, you can redirect the user to another page or perform other actions
                // window.location.href = '/login';
                // signupForm.reset(); // Reset the form fields
            }
        } catch (error) {
            if (error.response.status === 400) {
                alert('User already exists. Please choose a different email.');
                console.log("User already exists.");
            } else {
                console.error('Error in signup form:', error);
            }
        }
    });
});
