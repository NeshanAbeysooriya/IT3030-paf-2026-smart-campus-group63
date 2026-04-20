import axios from 'axios';

async function testAddComment() {
    try {
        const response = await axios.post('http://localhost:8081/api/comments', {
            ticketId: 1,
            user: 'Test User',
            message: 'This is a test comment'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testAddComment();
