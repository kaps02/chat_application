/*
document.addEventListener('DOMContentLoaded', () => {
    const sendChat = document.getElementById('send');

     {
        sendChat.addEventListener('submit', async (event) => {
            event.preventDefault();
          
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('/chat/message', { message }, {
                    headers: { 'Authorization': token }
                });
                console.log('Chat message sent successfully:', response.data);
           

                if (response.status === 200) {
                    //localStorage.setItem('token', response.data.token);
                    alert("Your chat store Successfully");
                    
                } else {
                    console.error('Login failed');
                    // Optionally, display an error message to the user
                }
            } catch (error) {
                if (error.response.status === 401) {
                    //alert('incorrect password.');
                    console.log("error while storing chat");
                } 
                console.error('Error:', error);
                // Optionally, display an error message to the user
            }
        });
    }
})*/