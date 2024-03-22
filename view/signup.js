
document.addEventListener('DOMContentLoaded', ()=> {

    const signupForm = document.querySelector('#form');
    
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(signupForm);
        try {
            console.log('axios send....', formData)
            const response = await axios.post('/user/signup', {     //axios call......
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
            });
            if (response.status === 200) {
                console.log("user register successfully....")
               // window.location.href = '/login';
                //signupForm.reset(); // Reset the form fields
            }
        } catch (error) {
            console.error('Error in signup form :', error);
        }
    });
}
)

