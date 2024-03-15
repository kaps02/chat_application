
document.addEventListener('DOMContentLoaded', ()=> {

    const signupForm = document.querySelector('#form');
    
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(signupForm);
        try {
            const response = await axios.post('/user/signup', {     //axios call......
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            });
            if (response.status === 200) {
                console.log("user register successfully....")
                window.location.href = '/user/login';
                //signupForm.reset(); // Reset the form fields
            }
        } catch (error) {
            console.error('Error in signup form :', error);
        }
    });
}
})

